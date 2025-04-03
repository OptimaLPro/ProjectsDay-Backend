import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    internship: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
      default: new Date().getFullYear(), // 👈 כאן הקסם
    },
  },
  { timestamps: true }
);

// הצפנת סיסמה
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// בדיקת סיסמה
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
