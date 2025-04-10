import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    years: {
      type: [Number],
      required: true,
      default: [],
    },
    instructor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Internship = mongoose.model("internships", internshipSchema);
export default Internship;
