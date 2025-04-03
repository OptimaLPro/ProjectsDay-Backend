import Internship from "../modules/internshipModule.js";

export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({});
    res.status(200).json(internships);
  } catch (error) {
    console.error("Error retrieving internships:", error);
    res.status(500).send("Internal server error.");
  }
};
