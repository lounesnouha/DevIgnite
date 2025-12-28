import mongoose from "mongoose";
import { Router } from "express";
import { validationResult, matchedData, checkSchema } from 'express-validator';
import { postValidationSchema } from '../utils/validationSchema.mjs';


import {authenticateToken} from '../middleware/auth.mjs';
import { canCreatePost } from "../middleware/canCreatePost.mjs";
import { validateRequest } from '../middleware/validationRequest.mjs'

import { Post } from "../models/Post.mjs";
import { User } from "../models/User.mjs";

const router = Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post("/api/post",authenticateToken, 
    checkSchema(postValidationSchema), validateRequest,
    canCreatePost,
    async (req, res)=>{
        const postData = matchedData(req);

        try{
            const createdPost = await Post.create(postData)
            res.status(201).json({msg: "Post created successfully!", post: createdPost});
        }catch(err){
            console.log(err);
            res.status(500).json({msg: "Server error"});
        }
})

router.get("/api/posts/department/:department", async (req,res)=>{
    const { department } = req.params;
    const validDepartments = ["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"];

    if(!validDepartments.includes(department))
        return res.status(400).json({msg: "Invalid department"});

    try{
        const posts = await Post.find({department}).sort({createdAt: -1});
        res.status(200).json({posts});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
    
})

router.get("/api/posts/general", async (req, res)=>{
    try{
        const posts = await Post.find().sort({createdAt: -1});
        res.status(200).json({posts});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})


router.get("/api/posts/feed",authenticateToken, async (req,res)=>{
    const userID = req.user.userID;
    try{
        const user = await User.findById(userID);
        if(!user) return res.status(404).json({msg: "User not found"});
        const followedDepartments = user.followedDepartments;

        if(!followedDepartments || followedDepartments.length === 0)
            return res.status(200).json({msg: "You don't follow any departments"});
    
        const posts = await Post.find({department: {$in: followedDepartments}}).sort({createdAt: -1});
        res.status(200).json({posts});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})




router.post("/api/posts/:id/like", authenticateToken, async (req,res)=>{
    const { id: postID } = req.params;
    const userID = req.user.userID; 

    if (!isValidObjectId(postID)) 
        return res.status(400).json({msg: "Invalid post ID"});

    try{
        const [post, user] = await Promise.all([
            Post.findById(postID),
            User.findById(userID)
        ]);
        
        if (!post) return res.status(404).json({msg: "Post not found"});
        if(!user) return res.status(404).json({msg: "User not found"});

        const alreadyLiked = user.likedPosts.some(id => id.toString() === postID);

        if (!alreadyLiked){
            user.likedPosts.push(postID);
            post.likesCount++;
        }else{
            user.likedPosts = user.likedPosts.filter(id => id.toString() !== postID);
            post.likesCount = Math.max(post.likesCount - 1, 0);
        }

        await Promise.all([user.save(), post.save()]);

        res.status(200).json({
            msg: alreadyLiked ? "Post unliked" : "Post liked",
            likesCount: post.likesCount
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})


router.post("/api/posts/:id/save", authenticateToken, async (req,res)=>{
    const { id: postID } = req.params;
    const userID = req.user.userID;

    if (!isValidObjectId(postID)) 
        return res.status(400).json({msg: "Invalid post ID"});
    
    try{
        const [post, user] = await Promise.all([
            Post.findById(postID),
            User.findById(userID)
        ]);
        
        if (!post) return res.status(404).json({msg: "Post not found"});
        if(!user) return res.status(404).json({msg: "User not found"});

        const alreadySaved = user.savedPosts.some(id => id.toString() === postID);

        if (!alreadySaved) user.savedPosts.push(postID);
        else user.savedPosts = user.savedPosts.filter(id => id.toString() !== postID);

        await user.save();
        res.status(200).json({
            msg: alreadySaved ? "Post unsaved" : "Post saved"
        });
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})



export default router;