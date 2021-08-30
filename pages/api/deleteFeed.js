import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

import dbConnect from "../../utils/db";
import User from "./../../models/User";

export default withApiAuthRequired(async (req, res) => {
  const { user } = getSession(req, res);
  console.log(user.sub);
  const { feedId } = req.body;

  await dbConnect();

  try {
    const doc = await User.updateOne(
      { user: user.sub },
      { $pull: { feeds: { feedId } } }
    );
    // console.log(doc);
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
