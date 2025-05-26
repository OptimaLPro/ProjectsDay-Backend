import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["youtube", "herotext"],
    required: true,
    unique: true,
  },
  videos: {
    type: [String],
    default: [],
  },
  text: {
    type: String,
    default: "",
  },
});

const Homepage = mongoose.model("homepages", homepageSchema);

export default Homepage;