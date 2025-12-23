import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
});

export const Department = mongoose.model("Department", departmentSchema)
