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
  },
  { timestamps: true }
);

const Internship = mongoose.model("internships", internshipSchema);
export default Internship;
