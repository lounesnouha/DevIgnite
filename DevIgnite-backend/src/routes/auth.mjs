import bcrypt  from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import {body, validationResult, matchedData, checkSchema} from 'express-validator';
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import {loginValidation} from '../utils/validationSchema.mjs';
import { tokenValidationSchema } from '../utils/validationSchema.mjs';

import { Router } from "express";

import {User} from '../models/User.mjs';  
import { RefreshToken } from '../models/refreshToken.mjs';

import {authenticateToken} from '../middleware/auth.mjs';

const router = Router();

router.post("/register", checkSchema(createUserValidationSchema),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({error: errors.array()});

    const {username, email, password} = matchedData(req);

    try{
        const exists = await User.findOne({email});
        if (exists) 
            return res.status(400).json({msg: "User with this email already exists."});

        const hashedPassword = await bcrypt.hash(password,10);
        const userData = {username, email, password: hashedPassword};
        const newUser = new User(userData);

        const savedUser = await newUser.save();

        const userPayload = {userID: savedUser._id};
        const accessToken= jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20min'});
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

        await RefreshToken.deleteMany({ userId: savedUser._id });
        await RefreshToken.create({
            userId: savedUser._id,
            token: refreshToken, 
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        })

        res.status(201).json({
            msg: "User registered successfully",
            accessToken,
            refreshToken,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})

router.post("/login", checkSchema(loginValidation), async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({error: errors.array()});

    const {email, password} = matchedData(req);
    try{
        const findUser = await User.findOne({email});
        if (!findUser) return res.status(400).json({msg: "Invalid credentials"});

        const isMatched = await bcrypt.compare(password, findUser.password);
        if (!isMatched) return res.status(400).json({msg: "Invalid credentials"});

        const user = {userID: findUser._id};
        const accessToken= jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20min'});
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

        await RefreshToken.deleteMany({ userId: findUser._id });
        await RefreshToken.create({
            userId: findUser._id,
            token: refreshToken, 
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        })

        res.status(200).json({
            msg: "Login successful",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
                id: findUser._id,
                username: findUser.username,
                email: findUser.email
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})


router.post("/refresh", checkSchema(tokenValidationSchema),  async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    const {token} = matchedData(req);
    
    try{
        const storedToken = await RefreshToken.findOne({token});
        if(!storedToken) return res.status(403).json({msg: "Invalid refresh token"});
        if (storedToken.expiresAt < new Date()){
            await RefreshToken.deleteOne({ token });
            return res.status(403).json({ msg: "Refresh token expired" });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
            if (err) return res.status(403).json({msg: "Invalid or Expired token"});

            const accessToken = jwt.sign({userID: user.userID}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20min'});
            res.status(200).json({accessToken});
        })
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
})

router.post("/logout", checkSchema(tokenValidationSchema), async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    const {token} = matchedData(req);

    try{
        const deleted = await RefreshToken.deleteOne({token});
        if (deleted.deletedCount === 0) 
            return res.status(403).json({msg: "Invalid refresh token"});

        res.status(200).json({msg: "Logged out successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
})

export default router;