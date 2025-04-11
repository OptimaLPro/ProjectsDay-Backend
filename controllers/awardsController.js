import Award from "../modules/awardsModule.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "awards" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const getAwards = async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });
    res.status(200).json(awards);
  } catch (err) {
    console.error("Error retrieving awards:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createAward = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let imageUrl = "";
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({ error: "Image is required" });
    }

    const newAward = new Award({ name, image: imageUrl, description });
    await newAward.save();

    res.status(201).json(newAward);
  } catch (err) {
    console.error("Error creating award:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let imageUrl = req.body.image;

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updated = await Award.findByIdAndUpdate(
      id,
      { name, description, image: imageUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Award not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating award:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findById(id);

    if (!award) {
      return res.status(404).json({ error: "Award not found" });
    }

    await Award.findByIdAndDelete(id);
    res.status(200).json({ message: "Award deleted successfully" });
  } catch (err) {
    console.error("Error deleting award:", err);
    res.status(500).json({ error: "Server error" });
  }
};
