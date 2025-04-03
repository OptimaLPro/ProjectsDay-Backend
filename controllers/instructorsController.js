import Instructor from "../modules/instructorModule.js";

export const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({});
    console.log("Instructors retrieved successfully:", instructors);
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error retrieving instructors:", error);
    res.status(500).send("Internal server error.");
  }
};