import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Internship = mongoose.model("internships", internshipSchema);
export default Internship;
