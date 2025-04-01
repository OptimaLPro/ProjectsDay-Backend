import Project from "../modules/projectModule.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    console.log("Projects retrieved successfully:", projects);
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).send("Internal server error.");
  }
};
