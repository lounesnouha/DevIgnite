import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    departement: {
        type: String,
        required: true,
    },
    
})

export const Post = mongoose.model("Post", postSchema)