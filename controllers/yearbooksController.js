import Yearbook from "../modules/yearbookModule.js";

export const getYearbooks = async (req, res) => {
  try {
    const yearbooks = await Yearbook.find({}).sort({ year: -1 });
    res.status(200).json(yearbooks);
  } catch (error) {
    console.error("Error retrieving yearbooks:", error);
    res.status(500).send("Internal server error.");
  }
};

export const getActiveYearbook = async (req, res) => {
  try {
    const yearbook = await Yearbook.findOne({ active: true });
    res.status(200).json(yearbook);
  } catch (error) {
    console.error("Error retrieving yearbook:", error);
    res.status(500).send("Internal server error.");
  }
};

export const createYearbook = async (req, res) => {
  const { year, active } = req.body;
  try {
    const exists = await Yearbook.findOne({ year });
    if (exists)
      return res.status(400).json({ error: "Yearbook already exists" });

    const yearbook = new Yearbook({
      year,
      active,
    });

    await yearbook.save();

    res.status(201).json(yearbook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateYearbook = async (req, res) => {
  const { id } = req.params;
  const { year, active } = req.body;

  try {
    if (active) {
      // Set all other yearbooks' active field to false
      await Yearbook.updateMany({ active: true }, { $set: { active: false } });
    }

    const updatedYearbook = await Yearbook.findByIdAndUpdate(
      id,
      { year, active },
      { new: true }
    );

    if (!updatedYearbook) {
      return res.status(404).json({ error: "Yearbook not found" });
    }

    res.status(200).json(updatedYearbook);
  } catch (error) {
    console.error("Error updating yearbook:", error);
    res.status(500).json({ error: "Server error" });
  }
};