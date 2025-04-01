import { v4 as uuidv4 } from "uuid";

export const ensureUserID = (req, res) => {
  let userID = req.cookies.userID;
  if (!userID) {
    userID = uuidv4();
    res.cookie("userID", userID, { httpOnly: true });
  }
  return userID;
};
