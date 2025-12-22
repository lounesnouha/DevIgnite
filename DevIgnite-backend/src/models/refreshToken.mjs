import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
    },
    token: {
        type: String,
        required : true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
})

export const RefreshToken = mongoose.model("refreshToken", refreshTokenSchema);