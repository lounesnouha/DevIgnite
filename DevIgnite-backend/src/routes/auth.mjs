import bcrypt  from 'bcrypt';
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import {loginValidation} from '../utils/validationSchema.mjs';
import {validationResult, matchedData, checkSchema} from 'express-validator';
import { Router } from "express";


import {User} from '../models/User.mjs';

const router = Router();

router.post("/register", checkSchema(createUserValidationSchema),async (req,res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({error: result.array()});

    const {username, email, password} = matchedData(req);

    try{
        const exists = await User.findOne({email});
        if (exists) 
            return res.status(400).json({msg: "User with this email already exists."});

        const hashedPassword = await bcrypt.hash(password,10);
        const userData = {username, email, password: hashedPassword};
        const newUser = new User(userData);

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})

router.post("/login", checkSchema(loginValidation),async (req,res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({error: result.array()});

    const {email, password} = matchedData(req);
    try{
        const findUser = await User.findOne({email});
        if (!findUser) return res.status(400).json({msg: "User not found"});

        const isMatched = await bcrypt.compare(password, findUser.password);
        if (!isMatched) return res.status(400).json({msg: "Invalid credentials"});

        res.status(200).json(findUser);
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})

export default router;