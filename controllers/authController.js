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

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const bulkRegister = async (req, res) => {
  const users = req.body; // [{email, password, role, internship}]
  if (!Array.isArray(users)) {
    return res.status(400).json({ error: "Expected an array of users" });
  }

  const results = {
    created: [],
    skipped: [],
    errors: [],
  };

  for (const userData of users) {
    try {
      const { email, password, role, internship } = userData;
      if (!email || !password) {
        results.errors.push({ email, error: "Missing email or password" });
        continue;
      }

      const exists = await User.findOne({ email });
      if (exists) {
        results.skipped.push({ email, reason: "Email already exists" });
        continue;
      }

      const newUser = new User({
        email,
        password,
        role: role || "student",
        internship: internship || "",
      });

      await newUser.save();
      results.created.push({ email });
    } catch (err) {
      results.errors.push({ email: userData.email, error: err.message });
    }
  }

  return res.status(201).json(results);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // לא נשלח סיסמה
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, role, internship } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.email = email || user.email;
    user.role = role || user.role;
    user.internship = internship || user.internship;

    if (password && password.trim() !== "") {
      user.password = password; // יעבור הצפנה דרך pre("save")
    }

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (err) {
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
