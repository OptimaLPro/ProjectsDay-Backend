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
    const { name, years } = req.body;

    if (!name || !years || !Array.isArray(years)) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    const internship = new Internship({ name, years });
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
    const { name, years } = req.body;

    if (!name || !years || !Array.isArray(years)) {
      return res.status(400).json({ error: "Missing or invalid data" });
    }

    const updated = await Internship.findByIdAndUpdate(
      id,
      { name, years },
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
