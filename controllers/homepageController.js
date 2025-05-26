import Homepage from "../modules/homepageModule.js";

// Get all homepage records
export const getHomepage = async (req, res) => {
  try {
    const records = await Homepage.find();
    console.log("Fetched homepage records:", records);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new homepage record
export const createHomepage = async (req, res) => {
  try {
    const { type, videos, text } = req.body;

    // Check if record of this type exists
    const exists = await Homepage.findOne({ type });
    if (exists) {
      return res.status(400).json({ message: "Record of this type already exists" });
    }

    const homepage = new Homepage({ type, videos, text });
    await homepage.save();
    res.status(201).json(homepage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a homepage record by type
export const updateHomepage = async (req, res) => {
  try {
    const { type } = req.params;
    const { videos, text } = req.body;
    const updated = await Homepage.findOneAndUpdate(
      { type },
      { videos, text },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
