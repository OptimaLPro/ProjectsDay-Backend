import mongoose from "mongoose";

const awardsSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
},
{ timestamps: true }
);

const Award = mongoose.model("awards", awardsSchema);
export default Award;
