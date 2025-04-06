import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";
import Project from "../modules/projectModule.js";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer with memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Helper function to upload file buffer to Cloudinary
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "projects" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0; // עמוד נוכחי, ברירת מחדל 0
    const pageSize = 6; // מספר פרויקטים לעמוד
    // מציאת הפרויקטים לעמוד הנוכחי
    const projects = await Project.find({})
      .skip(page * pageSize)
      .limit(pageSize);
    // ספירת כל הפרויקטים במסד
    const totalProjects = await Project.countDocuments({});
    // בדיקה האם יש עמוד נוסף
    const nextPage = (page + 1) * pageSize < totalProjects ? page + 1 : null;

    res.status(200).json({ projects, nextPage });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).send("Internal server error.");
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    if (!projects || projects.length === 0) {
      return res.status(404).send("No projects found.");
    }
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error retrieving all projects:", error);
    res.status(500).send("Internal server error.");
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error retrieving project:", error);
    res.status(500).send("Internal server error.");
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, internship, description, instructor, year, members } =
      req.body;
    const parsedMembers =
      typeof members === "string" ? JSON.parse(members) : members;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    // Upload image buffer to Cloudinary
    const result = await streamUpload(req.file.buffer);
    const imageUrl = result.secure_url;

    // Create a new project document
    const newProject = new Project({
      name,
      internship,
      description,
      instructor,
      year,
      image: imageUrl,
      members: parsedMembers,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, internship, description, instructor, year } = req.body;
    const members = JSON.parse(req.body.members || "[]");

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ בדיקת הרשאה – Admin יכול הכל
    const user = req.user;
    console.log("User from request:", user);
    const isAdmin = user?.role === "admin";

    if (!isAdmin) {
      const userEmail = user?.email;
      const isAuthorized = existingProject.members.some(
        (member) => member.email === userEmail
      );
      if (!isAuthorized) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this project" });
      }
    }

    let imageUrl = existingProject.image;
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    existingProject.name = name;
    existingProject.internship = internship;
    existingProject.description = description;
    existingProject.instructor = instructor;
    existingProject.year = year;
    existingProject.members = members;
    existingProject.image = imageUrl;

    await existingProject.save();
    res.status(200).json(existingProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProject = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const project = await Project.findOne({
      "members.email": userEmail,
    });

    if (!project) {
      return res.status(200).json({ exists: false, project: null });
    }

    return res.status(200).json({ exists: true, project });
  } catch (error) {
    console.error("Error checking user project:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = req.user;
    const isAdmin = user?.role === "admin";

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admin can delete projects" });
    }

    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
