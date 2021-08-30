import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  user: String,
  feeds: [
    {
      title: String,
      url: String,
      feedUrl: String,
      category: String,
      favicon: String,
      twitterId: String,
      feedId: String,
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
