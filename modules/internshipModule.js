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
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructors",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    textColor: {
      type: String,
      default: "000000",
    },
    backgroundColor: {
      type: String,
      default: "ffffff",
    },
  },
  { timestamps: true }
);

const Internship = mongoose.model("internships", internshipSchema);
export default Internship;
