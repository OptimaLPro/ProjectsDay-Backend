import mongoose, { Schema } from "mongoose";

const yearbookSchema = new Schema(
  {
    year: { type: Number, required: true, unique: true },
    active: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Yearbook = mongoose.model("yearbooks", yearbookSchema);
export default Yearbook;
