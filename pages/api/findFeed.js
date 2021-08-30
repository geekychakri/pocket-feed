import feedFinder from "@hughrun/feedfinder";
import rssFinder from "rss-finder";
import ytch from "yt-channel-info";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async (req, res) => {
  const { url, category } = req.body;

  switch (category) {
    case "twitter": {
      const username = url.split("/").pop();
      try {
        const response = await fetch(
          `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url,protected`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            },
          }
        );

        const user = await response.json();

        if (user.errors) {
          return res.status(404).json({ msg: "User Not Found" });
        }
        //If PROTECTED
        if (user.data.protected) {
          return res.status(401).json({ msg: "Private Account" });
        }

        const {
          name: title,
          profile_image_url: favicon,
          id: twitterId,
        } = user.data;

        res.status(200).json({
          title,
          favicon,
          twitterId,
        });
      } catch (err) {
        console.log("ERROR", err);
        res.status(500).json({ msg: "Something went wrong" });
      }
      break;
    }
    case "reddit": {
      try {
        const response = await rssFinder(`${url}.rss`);
        console.log(response);
        const data = {
          url: response.site.url,
          feed: response.feedUrls[0].url,
          title: response.site.title,
          favicon: "/img/reddit-logo.png",
        };
        res.status(200).json(data);
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Something went wrong" });
      }
      break;
    }
    default: {
      try {
        const res1 = await rssFinder(url);
        console.log("RES1", res1);

        // YouTube FAVICON
        let ytFavicon;
        if (category === "youtube") {
          console.log("YOUTUBE");
          const channelId = res1.feedUrls[0].url.split("?")[1].split("=")[1];
          console.log("CHANNEL_ID", channelId);
          const ytResponse = await ytch.getChannelInfo(channelId);

          ytFavicon = ytResponse.authorThumbnails[0].url;
        }

        console.log("YT_FAVICON", ytFavicon);

        if (!res1.feedUrls.length || res1.feedUrls.length > 3) {
          try {
            const res2 = await feedFinder.getFeed(url);
            console.log("RES2", res2);
            res.status(200).json({
              ...res2,
              feed: res2.feed,
              favicon: ytFavicon || res1.site.favicon,
            });
            return;
          } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: "No Feed Found" });
          }
        }
        const data = {
          url: res1.site.url,
          feed: res1.feedUrls[0].url,
          title: res1.site.title,
          favicon: ytFavicon || res1.site.favicon,
        };
        res.status(200).json(data);
      } catch (err) {
        console.log("ERROR", err);
        res.status(500).json({ msg: "Something went wrong" });
      }
    }
  }
});
