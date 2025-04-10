import Instructor from "../modules/instructorModule.js";

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
      { folder: "instructors" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const getInstructors = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = year ? { years: parseInt(year) } : {};

    const instructors = await Instructor.find(filter);
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error retrieving instructors:", error);
    res.status(500).send("Internal server error.");
  }
};

export const createInstructor = async (req, res) => {
  try {
    const { name, image, description, years } = req.body;

    const instructor = new Instructor({
      name,
      image,
      description,
      years,
    });

    await instructor.save();
    res.status(201).json(instructor);
  } catch (error) {
    console.error("Error creating instructor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    // בקריאה עם form-data, req.body מגיע כ־stringים
    const { name, description } = req.body;
    const years = JSON.parse(req.body.years || "[]");

    if (!name || !description || !Array.isArray(years)) {
      return res.status(400).json({ message: "Missing or invalid data" });
    }

    // תמונה קיימת או העלאה חדשה
    let imageUrl = req.body.image;

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updated = await Instructor.findByIdAndUpdate(
      id,
      { name, description, years, image: imageUrl },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating instructor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
