import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

import dbConnect from "../../utils/db";
import User from "../../models/User";

export default withApiAuthRequired(async (req, res) => {
  const { user } = await getSession(req, res);

  await dbConnect();

  try {
    const response = await User.deleteOne({ user: user.sub });
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
