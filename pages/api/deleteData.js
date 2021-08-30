import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

import { connect } from "../../utils/db";
import User from "../../models/User";

connect();

export default withApiAuthRequired(async (req, res) => {
  const { user } = await getSession(req, res);
  try {
    const response = await User.deleteOne({ user: user.sub });
    res.status(204).json({});
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});
