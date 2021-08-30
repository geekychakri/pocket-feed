import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

// import { connect } from "../../utils/db";
import dbConnect from "../../utils/db";
import User from "../../models/User";

// connect();

export default withApiAuthRequired(async (req, res) => {
  console.log("REQ_BODY", req.body);
  console.log("REQ_METHOD", req.method);

  await dbConnect();

  const { user } = await getSession(req, res);

  switch (req.method) {
    case "GET": {
      try {
        const data = await User.find({ user: user?.sub });
        res.status(200).json(data);
      } catch (err) {}
      break;
    }
    case "POST": {
      try {
        const user = await User.create(req.body);
        res.status(200).json({ user });
      } catch (err) {}
      break;
    }
    case "PUT": {
      try {
        const feed = await User.findOneAndUpdate(
          { user: user?.sub },
          {
            $push: {
              feeds: {
                title: req.body.title,
                url: req.body.url,
                feedUrl: req.body.feedUrl,
                category: req.body.category,
                favicon: req.body.favicon,
                twitterId: req.body.twitterId,
                feedId: req.body.feedId,
              },
            },
          },
          {
            new: true,
          }
        );
        res.status(200).json(feed);
      } catch (err) {
        res.status(500).json({ msg: "Something went wrong" });
      }
      break;
    }
    default:
      res.status(500).json({ msg: "Something went wrong" });
      break;
  }
});
