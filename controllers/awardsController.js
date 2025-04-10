import Award from "../modules/awardsModule.js";

// GET all awards
export const getAwards = async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });
    res.status(200).json(awards);
  } catch (err) {
    console.error("Error retrieving awards:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST new award
export const createAward = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    if (!name || !image || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAward = new Award({ name, image, description });
    await newAward.save();

    res.status(201).json(newAward);
  } catch (err) {
    console.error("Error creating award:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE award by ID
export const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findById(id);

    if (!award) {
      return res.status(404).json({ error: "Award not found" });
    }

    await Award.findByIdAndDelete(id);
    res.status(200).json({ message: "Award deleted successfully" });
  } catch (err) {
    console.error("Error deleting award:", err);
    res.status(500).json({ error: "Server error" });
  }
};
