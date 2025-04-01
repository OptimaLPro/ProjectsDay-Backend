import User from "../modules/userModule.js";

export const getFavorites = async (req, res) => {
  try {
    let user = await User.findOne({ userId: req.userID });

    if (!user) {
      user = await User.create({ userId: req.userID, favorites: [] });
    }
    res.status(200).send(user.favorites);
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).send("Internal server error.");
  }
};

export const addFavorite = async (req, res) => {
  try {
    let user = await User.findOne({ userId: req.userID });

    const repoWithTimestamp = {
      ...req.body,
      added_favorites: new Date(),
    };

    if (!user) {
      user = await User.create({
        userId: req.userID,
        favorites: [repoWithTimestamp],
      });
    } else {
      user.favorites.push(repoWithTimestamp);
      await user.save();
    }

    res.status(200).send(user.favorites);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).send("Internal server error.");
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ userId: req.userID });
    if (!user) {
      res.status(404).send("User not found.");
    } else {
      user.favorites = user.favorites.filter((favorite) => favorite.id !== id);
      await user.save();
      res.status(200).send(user.favorites);
    }
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).send("Internal server error.");
  }
};
