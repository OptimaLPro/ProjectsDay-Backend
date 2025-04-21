import mongoose from "mongoose";
import User from "../modules/userModule.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import Yearbook from "../modules/yearbookModule.js";

dotenv.config();

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      internship: user.internship,
      year: user.year,
      first_name: user.first_name,
      last_name: user.last_name,
      image: user.image,
      linkedin: user.linkedin,
      github: user.github,
      website: user.website,
      about: user.about,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "users" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const register = async (req, res) => {
  const { email, password, role, internship, image, first_name, last_name } =
    req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const user = new User({
      email,
      password,
      role: role || "student",
      internship: mongoose.Types.ObjectId.isValid(internship)
        ? mongoose.Types.ObjectId.createFromHexString(internship)
        : null,

      image: image || "",
      first_name: first_name || "",
      last_name: last_name || "",
      linkedin: req.body.linkedin || "",
      github: req.body.github || "",
      website: req.body.website || "",
      about: req.body.about || "",
    });

    await user.save();
    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      const activeYearbook = await Yearbook.findOne({ active: true });
      if (!activeYearbook || user.year !== activeYearbook.year) {
        return res.status(403).json({
          error: `You do not belong to the active yearbook (${activeYearbook?.year}).`,
        });
      }
    }

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const bulkRegister = async (req, res) => {
  const users = req.body; 
  if (!Array.isArray(users)) {
    return res.status(400).json({ error: "Expected an array of users" });
  }

  const results = { created: [], skipped: [], errors: [] };
  console.log(users);
  for (const userData of users) {
    try {
      const {
        email,
        password,
        role,
        internship = "student",
        image,
        first_name,
        last_name,
      } = userData;
      if (!email || !password) {
        results.errors.push({ email, error: "Missing email or password" });
        continue;
      }

      const exists = await User.findOne({ email });
      if (exists) {
        console.log(`User with email ${email} already exists`);
        results.skipped.push({ email, reason: "Email already exists" });
        continue;
      }

      //check if internship is a valid (internship is text)
      if (internship && !mongoose.Types.ObjectId.isValid(internship)) {
        const internshipExists = await User.findOne({ _id: internship });
        if (!internshipExists) {
          results.errors.push({
            email,
            error: `Internship ${internship} does not exist`,
          });
          continue;
        }
      }

      const newUser = new User({
        email,
        password,
        role: role || "student",
        internship: internship,
        image: image || "",
        first_name: first_name || "",
        last_name: last_name || "",
      });

      console.log(newUser);

      await newUser.save();
      results.created.push({ email });
    } catch (err) {
      results.errors.push({ email: userData.email, error: err.message });
    }
  }
  console.log(results);
  return res.status(201).json(results);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    password,
    role,
    internship,
    first_name,
    last_name,
    linkedin,
    github,
    website,
    about,
  } = req.body;

  try {
    console.log("req.body:", req.body);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.email = email || user.email;
    if (user.role === "admin") {
      user.role = role || user.role;
    }

    user.internship = mongoose.Types.ObjectId.isValid(internship)
      ? mongoose.Types.ObjectId.createFromHexString(internship)
      : user.internship;

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;

    if (password && password.trim() !== "") {
      user.password = password;
    }

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      user.image = result.secure_url;
    }

    user.linkedin = linkedin ?? user.linkedin;
    user.github = github ?? user.github;
    user.website = website ?? user.website;
    user.about = about ?? user.about;

    console.log("user:", user);

    await user.save();
    const token = createToken(user);
    res.json({ message: "User updated successfully", user, token });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getUsersByEmails = async (req, res) => {
  try {
    const { emails } = req.query;
    if (!emails) {
      return res.status(400).json({ error: "Missing emails parameter" });
    }

    const emailArray = Array.isArray(emails) ? emails : emails.split(",");
    const users = await User.find({ email: { $in: emailArray } }).select(
      "email image"
    );

    res.json(users);
  } catch (err) {
    console.error("Error fetching users by emails:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllUserEmails = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "email first_name last_name image internship year"
    );
    res.json(users);
  } catch (err) {
    console.error("Error fetching user emails:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
