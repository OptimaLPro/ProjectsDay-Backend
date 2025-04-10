import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    years: {
      type: [Number],
      required: true,
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    internships: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Instructor = mongoose.model("instructors", instructorSchema);

export default Instructor;
