import Internship from "../modules/internshipModule.js";

export const getInternships = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = year ? { years: parseInt(year) } : {};
    const internships = await Internship.find(filter);
    res.status(200).json(internships);
  } catch (error) {
    console.error("Error retrieving internships:", error);
    res.status(500).send("Internal server error.");
  }
};

export const createInternship = async (req, res) => {
  try {
    const { name, instructor, description, years, textColor, backgroundColor } =
      req.body;

    if (!name || !instructor || !description || !Array.isArray(years)) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    const internship = new Internship({
      name,
      years,
      instructor,
      description,
      textColor,
      backgroundColor,
    });

    await internship.save();
    res.status(201).json(internship);
  } catch (error) {
    console.error("Error creating internship:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, years, instructor, description, textColor, backgroundColor } =
      req.body;

    if (
      !name ||
      !years ||
      !Array.isArray(years) ||
      !instructor ||
      !description
    ) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    const updated = await Internship.findByIdAndUpdate(
      id,
      { name, years, instructor, description, textColor, backgroundColor },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Internship not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating internship:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findById(id);
    if (!internship) {
      return res.status(404).json({ error: "Internship not found" });
    }

    await Internship.findByIdAndDelete(id);
    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (error) {
    console.error("Error deleting internship:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
