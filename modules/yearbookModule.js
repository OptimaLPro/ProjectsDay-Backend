import mongoose, { Schema } from "mongoose";

const yearbookSchema = new Schema(
  {
    year: { type: Number, required: true, unique: true },
    active: { type: Boolean, required: true },
    userBlock: { type: Boolean, default: false },
    excludedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  { timestamps: true }
);

const Yearbook = mongoose.model("yearbooks", yearbookSchema);
export default Yearbook;
