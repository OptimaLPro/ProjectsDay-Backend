import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
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
    internships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "internships",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Instructor = mongoose.model("instructors", instructorSchema);

export default Instructor;
