import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    department: {
        type: String,
        enum: ["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"],
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    likesCount:{
        type: Number,
        default: 0,
        min: 0,
    },
    notificationsSent: {
    type: Boolean,
    default: false,
    },
    notificationSentAt: {
    type: Date,
    default: null,
},
recipientCount: {
  type: Number,
  default: 0,
}
},
{
    timestamps: true,
}
)

export const Post = mongoose.model("Post", postSchema)