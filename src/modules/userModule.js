import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userId: { type: String, required: true },
    favorites: [{ type: Schema.Types.Mixed, required: true }],
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
