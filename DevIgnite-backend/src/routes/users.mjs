import mongoose from "mongoose";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.mjs";
import { User } from "../models/User.mjs";
import { RefreshToken } from "../models/refreshToken.mjs";
import { canChangeRole } from "../middleware/canChangeRole.mjs";
const router = Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const validDepartments = ["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"];


router.get("/me/profile", authenticateToken,  async(req, res)=>{
    const userID = req.user.userID;
    try{
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({msg: "User not found"});

        res.status(200).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})


router.get("/posts/me/liked", authenticateToken, async (req,res)=>{
    const userID = req.user.userID;

    try{
        const user = await User.findById(userID).populate("likedPosts");
        if(!user) return res.status(404).json({msg: "User not found"});

        if(user.likedPosts.length === 0) 
            return res.status(200).json({msg: "You haven't liked any posts yet"});
        else res.status(200).json({likedPosts: user.likedPosts});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})

router.get("/posts/me/saved", authenticateToken, async (req,res)=>{
    const userID = req.user.userID;

    try{
        const user = await User.findById(userID).populate("savedPosts");
        if(!user) return res.status(404).json({msg: "User not found"});

        if(user.savedPosts.length === 0) 
            return res.status(200).json({msg: "You haven't saved any posts yet"});
        else res.status(200).json({savedPosts: user.savedPosts});
    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})

router.put("/users/:id/role", authenticateToken, canChangeRole, async (req, res)=>{
    const {id: userToChangeID} = req.params;

    if (!isValidObjectId(userToChangeID)) {
        return res.status(400).json({ msg: "Invalid user ID" });
    }

    const { newRole, newDepartment } = req.body;
    const validRoles = ["vice_president", "manager", "assistant_manager"];
    if (!newRole || !validRoles.includes(newRole)) 
        return res.status(400).json({msg: "Bad request"});
    if ((newRole === "manager" || newRole === "assistant_manager") && !newDepartment) {
        return res.status(400).json({ msg: "Department is required for managers" });
    }
    if ((newRole === "manager" || newRole === "assistant_manager") && !validDepartments.includes(newDepartment))
        return res.status(400).json({msg: "Department doesn't exist"});
    
    try{
        const userToChange = await User.findById(userToChangeID);
        if(!userToChange) return res.status(404).json({msg: "User not found"});

        if (userToChange.role === "president") {
            return res.status(403).json({ msg: "Cannot change president's role" });
        }

        userToChange.role = newRole;
        if (newRole === "manager" || newRole === "assistant_manager") {
            userToChange.department = newDepartment;
        }else {
            userToChange.department = null;
        }
        await userToChange.save();

        await RefreshToken.deleteMany({ userID: userToChangeID });

        res.status(200).json({
            msg: "Role updated successfully. User must log in again.",
            user: {
                id: userToChange._id,
                username: userToChange.username,
                email: userToChange.email,
                role: userToChange.role,
                department: userToChange.department
            }
        });

    }catch(err){
        console.log(err);
        res.status(500).json({msg: "Server error"});
    }
})

router.post("/users/follow/:department", authenticateToken, async (req, res) => {
    const { department } = req.params;
    const userID = req.user.userID;
    
    if (!validDepartments.includes(department)) {
        return res.status(400).json({ msg: "Invalid department" });
    }
    
    try {
        const user = await User.findById(userID);
        const alreadyFollowed = user.followedDepartments.includes(department)
        if (!alreadyFollowed) {
            user.followedDepartments.push(department);
        }else{
            user.followedDepartments = user.followedDepartments.filter(dep => dep !== department);
        }
        await user.save();

        res.status(200).json({ msg: alreadyFollowed ? "Department unfollowed successfully" : "Department followed successfully" });
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;