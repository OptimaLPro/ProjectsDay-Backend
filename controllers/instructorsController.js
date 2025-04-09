import Instructor from "../modules/instructorModule.js";

export const getInstructors = async (req, res) => {
  try {
    const { year } = req.query;
    const filter = year ? { years: parseInt(year) } : {};

    const instructors = await Instructor.find(filter);
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error retrieving instructors:", error);
    res.status(500).send("Internal server error.");
  }
};

export const createInstructor = async (req, res) => {
  try {
    const { name, image, description, years } = req.body;

    const instructor = new Instructor({
      name,
      image,
      description,
      years, // ⬅️ שלח מערך כמו [2025, 2026]
    });

    await instructor.save();
    res.status(201).json(instructor);
  } catch (error) {
    console.error("Error creating instructor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, description, years } = req.body;

    if (!name || !image || !description || !Array.isArray(years)) {
      return res.status(400).json({ message: "Missing or invalid data" });
    }

    const updated = await Instructor.findByIdAndUpdate(
      id,
      { name, image, description, years },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating instructor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
