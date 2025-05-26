import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  project_id: { type: String, default: null, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "internships",
    required: true,
  },
  description: { type: String, required: true },
  short_description: { type: String },
  gallery: [{ type: String }],
  youtube: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructors",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  awards: [{ type: mongoose.Schema.Types.ObjectId, ref: "awards" }],
  year: { type: Number, required: true },
});

const Project = mongoose.model("projects", projectSchema);
export default Project;
