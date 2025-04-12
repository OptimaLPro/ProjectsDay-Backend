import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";
import Project from "../modules/projectModule.js";
import mongoose from "mongoose";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage });

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
    const page = parseInt(req.query.page) || 0;
    const year = req.query.year;
    const pageSize = 6;
    const filter = year ? { year } : {};

    const projects = await Project.find(filter)
      .populate("awards")
      .skip(page * pageSize)
      .limit(pageSize);
    const totalProjects = await Project.countDocuments(filter);
    const nextPage = (page + 1) * pageSize < totalProjects ? page + 1 : null;

    res.status(200).json({ projects, nextPage });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).send("Internal server error.");
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate("awards");
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
    const project = await Project.findById(id).populate("awards");
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
    const {
      name,
      internship,
      description,
      short_description,
      gallery,
      youtube,
      instructor,
      year,
      members,
      awards,
    } = req.body;

    const parsedMembers =
      typeof members === "string" ? JSON.parse(members) : members;
    const parsedGallery =
      typeof gallery === "string" ? JSON.parse(gallery) : gallery;
    const parsedAwards =
      typeof awards === "string" ? JSON.parse(awards) : awards;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const result = await streamUpload(req.file.buffer);
    const imageUrl = result.secure_url;

    const newProject = new Project({
      name,
      internship,
      description,
      short_description,
      gallery: parsedGallery,
      youtube,
      instructor,
      year,
      image: imageUrl,
      members: parsedMembers,
      awards: parsedAwards,
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
    console.log("Update project request body:", req.body);
    const { id } = req.params;
    const {
      name,
      internship,
      description,
      short_description,
      gallery,
      youtube,
      instructor,
      year,
    } = req.body;

    const members = JSON.parse(req.body.members || "[]");
    const parsedGallery =
      typeof gallery === "string" ? JSON.parse(gallery) : gallery;
    const parsedAwards =
      typeof req.body.awards === "string"
        ? JSON.parse(req.body.awards)
        : req.body.awards || [];

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = req.user;
    const isAdmin = user?.role === "admin";

    if (!isAdmin) {
      const userId = user?._id || user?.id;
      const isAuthorized = existingProject.members.some(
        (memberId) => memberId.toString() === userId
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

    console.log("DEBUG 0");

    const previousGallery = existingProject.gallery || [];
    const updatedGallery = parsedGallery || [];

    const removedImages = previousGallery.filter(
      (url) => !updatedGallery.includes(url)
    );

    for (const url of removedImages) {
      const publicId = extractCloudinaryPublicId(url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn(
            `Failed to delete image from Cloudinary: ${publicId}`,
            err
          );
        }
      }
    }

    console.log("DEBUG 1");

    existingProject.gallery = updatedGallery;

    if (req.files?.newGalleryFiles) {
      const uploadedImages = [];

      const files = Array.isArray(req.files.newGalleryFiles)
        ? req.files.newGalleryFiles
        : [req.files.newGalleryFiles];

      for (const file of files) {
        const result = await streamUpload(file.buffer);
        uploadedImages.push(result.secure_url);
      }

      existingProject.gallery = [...existingProject.gallery, ...uploadedImages];
    }

    existingProject.name = name;
    existingProject.internship = mongoose.Types.ObjectId.isValid(internship)
    ? new mongoose.Types.ObjectId(internship)
    : existingProject.internship;
  
  existingProject.instructor = mongoose.Types.ObjectId.isValid(instructor)
    ? new mongoose.Types.ObjectId(instructor)
    : existingProject.instructor;
  
    
    existingProject.description = description;
    existingProject.short_description = short_description;
    existingProject.youtube = youtube;
    existingProject.awards = parsedAwards;
    existingProject.year = year;
    existingProject.members = members;
    existingProject.image = imageUrl;
    
    console.log(existingProject);
    await existingProject.save();
    res.status(200).json(existingProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function extractCloudinaryPublicId(url) {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((p) => p === "upload");
    if (uploadIndex === -1) return null;

    const publicIdParts = parts.slice(uploadIndex + 1);
    const lastPart = publicIdParts[publicIdParts.length - 1];
    const withoutExtension = lastPart.split(".")[0];
    publicIdParts[publicIdParts.length - 1] = withoutExtension;

    return publicIdParts.join("/");
  } catch (e) {
    return null;
  }
}

export const getMyProject = async (req, res) => {
  try {
    console.log(req.user);
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const project = await Project.findOne({
      members: req.user._id,
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

export const assignProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.user._id;

    const existingProject = await Project.findOne({ members: userId });
    if (existingProject) {
      return res
        .status(400)
        .json({ message: "You are already assigned to another project" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("User ID:", userId);
    console.log("Project ID:", projectId);
    console.log("Project members before assignment:", project.members);

    project.members.push(userId);
    await project.save();

    res.status(200).json({ message: "User assigned successfully", project });
  } catch (error) {
    console.error("Error assigning user to project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unassignProject = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user._id;

    const project = await Project.findOne({ members: userId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== userId.toString()
    );

    await project.save();
    console.log("✅ Before save - members:", project.members);

    res.status(200).json({ message: "You have been removed from the project" });
  } catch (error) {
    console.error("Error unassigning project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
