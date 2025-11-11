import mongoose from "mongoose";

// Defining structure (schema) for a user document
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, 
    },
  },
  { timestamps: true } // auto add createdAt, updatedAt fields
);


export default mongoose.model("User", userSchema);
