import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  internship: { type: String, required: true },
  description: { type: String, required: true },
  short_description: { type: String },
  gallery: [{ type: String }],
  youtube: { type: String },
  instructor: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  awards: [{ type: mongoose.Schema.Types.ObjectId, ref: "awards" }],
  year: { type: Number, required: true },
});

const Project = mongoose.model("projects", projectSchema);
export default Project;
