import User from "../modules/userModule.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      internship: user.internship,
      year: user.year,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, role, internship } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const user = new User({
      email,
      password,
      role: role || "student",
      internship: internship || "",
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

    console.log("User found:", user); // Debugging line

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
