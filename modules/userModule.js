import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "internships",
      default: null,
    },

    year: { type: Number, default: new Date().getFullYear() },
    image: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" },
    about: { type: String, maxlength: 500, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
