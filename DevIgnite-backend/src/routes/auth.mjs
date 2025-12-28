import bcrypt  from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import {validationResult, matchedData, checkSchema} from 'express-validator';
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import {loginValidation} from '../utils/validationSchema.mjs';
import { tokenValidationSchema } from '../utils/validationSchema.mjs';

import { Router } from "express";

import {User} from '../models/User.mjs';  
import { RefreshToken } from '../models/refreshToken.mjs';

import {authenticateToken} from '../middleware/auth.mjs';
import { validateRequest } from '../middleware/validationRequest.mjs'


const router = Router();

router.post("/api/register", checkSchema(createUserValidationSchema), validateRequest, async (req,res)=>{

    const {username, email, password} = matchedData(req);

    try{
        const exists = await User.findOne({email});
        if (exists) 
            return res.status(400).json({msg: "User with this email already exists."});

        const isFirstUser = (await User.countDocuments()) === 0;
        const role = isFirstUser ? "president" : "member";

        const hashedPassword = await bcrypt.hash(password,10);
        const userData = {username, email, password: hashedPassword, role};

        const newUser = new User(userData);

        const savedUser = await newUser.save();

        const userPayload = {userID: savedUser._id, 
                            role: savedUser.role, 
                            department: savedUser.department};
        const accessToken= jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20min'});
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

        await RefreshToken.create({
            userID: savedUser._id,
            role: savedUser.role, 
            department: savedUser.department,
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
                email: savedUser.email,
                role: savedUser.role,
                department: savedUser.department
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})

router.post("/api/login", checkSchema(loginValidation), validateRequest,  async (req,res)=>{
    const {email, password} = matchedData(req);
    try{
        const findUser = await User.findOne({email}).select("+password");
        if (!findUser) return res.status(400).json({msg: "Invalid credentials"});

        const isMatched = await bcrypt.compare(password, findUser.password);
        if (!isMatched) return res.status(400).json({msg: "Invalid credentials"});

        const user = {userID: findUser._id, 
                    role: findUser.role, 
                    department: findUser.department
                    };
        const accessToken= jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20min'});
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});

        await RefreshToken.deleteMany({ userID: findUser._id });
        await RefreshToken.create({
            userID: findUser._id,
            role: findUser.role, 
            department: findUser.department,
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
                email: findUser.email,
                role: findUser.role,
                department: findUser.department
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})


router.post("/api/refresh", checkSchema(tokenValidationSchema), validateRequest, async (req,res)=>{
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
            const userPayload = {userID: user.userID, 
                            role: user.role, 
                            department: user.department};

            const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20m'});
            res.status(200).json({accessToken});
        })
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
})

router.post("/api/logout", authenticateToken, async (req,res)=>{
    try{
        const deleted = await RefreshToken.deleteOne({ userID: req.user.userID });
        if (deleted.deletedCount === 0) 
            return res.status(403).json({msg: "No active sessions found"});

        res.status(200).json({msg: "Logged out successfully", sessionsCleared: deleted.deletedCount });
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Server error"});
    }
})

export default router;