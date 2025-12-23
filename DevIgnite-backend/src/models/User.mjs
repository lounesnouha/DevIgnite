import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
        select: false
    },

    role: {
      type: String,
      enum: [
        "president",
        "vice_president",
        "manager",
        "assistant_manager",
        "member"
      ],
      default: "member"
    },

    department: {       //only for manager and assistant_manager
      type: String,
      enum: ["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"],
      default: null,
      validate:{
        validator: function(value){
            if(["manager", "assistant_manager"].includes(this.role)) 
                return value!==null;
            return value===null || value === "";
        },
        message: "Department is required only for manager roles"
      }
    },

    followedDepartments: {
      type: [String],
      enum: ["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"],
      default: []
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }], 
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
},
{
    timestamps: true
}
)

export const User = mongoose.model("User", userSchema);