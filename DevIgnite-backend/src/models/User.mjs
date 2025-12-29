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
    notificationPreferences: {
  DEV: {
    type: Boolean,
    default: true
  },
  UIUX: {
    type: Boolean,
    default: true
  },
  DESIGN: {
    type: Boolean,
    default: true
  },
  HR: {
    type: Boolean,
    default: true
  },
  COM: {
    type: Boolean,
    default: true
  },
  RELV: {
    type: Boolean,
    default: true
  }
},

notificationHistory: [{
  department: {
    type: String,
    enum: ["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"]
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
}],
},
{
    timestamps: true
}
)

userSchema.methods.wantsNotificationFor = function(department) {
  const isFollowing = this.followedDepartments.includes(department);
  const notifEnabled = this.notificationPreferences[department] !== false;
  return isFollowing && notifEnabled;
};

userSchema.methods.updateNotificationPreference = function(department, enabled) {
  if (!this.notificationPreferences) {
    this.notificationPreferences = {};
  }
  this.notificationPreferences[department] = enabled;
  return this.save();
};

export const User = mongoose.model("User", userSchema);