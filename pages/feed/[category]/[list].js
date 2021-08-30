import { useRouter } from "next/router";

import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import parse from "rss-to-json";

import dbConnect from "../../../utils/db";
import User from "./../../../models/User";
import FeedList from "../../../components/FeedList";
import TwitterList from "../../../components/TwitterList";

function List({ feedList, feedLink, feedTitle, tweetList }) {
  console.log(feedLink);
  const router = useRouter();
  // console.log("ROUTER", router.query.category);
  // console.log(router.query.id);

  return (
    <div className="list">
      {router.query.category === "twitter" ? (
        <TwitterList tweetList={tweetList} />
      ) : (
        <FeedList
          feed={{ feedList, feedLink, feedTitle }}
          feedList={feedList}
          feedLink={feedLink}
          feedTitle={feedTitle}
        />
      )}
    </div>
  );
}

export default List;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const { req, res, query } = context;
    console.log(query.id);

    await dbConnect();

    const session = await getSession(req, res);

    try {
      const data = await User.findOne({ user: session?.user.sub }).select({
        feeds: { $elemMatch: { feedId: query.id } },
      });
      console.log("SERVER_DATA", data);

      if (query.category === "twitter") {
        const response = await fetch(
          `https://api.twitter.com/2/users/${data.feeds[0].twitterId}/tweets?expansions=attachments.media_keys,author_id&exclude=retweets,replies&media.fields=url,preview_image_url&tweet.fields=created_at&user.fields=username,verified&max_results=5`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            },
          }
        );

        const userTweets = await response.json();

        console.log(userTweets);

        return {
          props: {
            tweetList: userTweets,
          },
        };
      }

      console.log(data.feeds[0].feedUrl);

      const feed = await parse(data.feeds[0].feedUrl);

      return {
        props: {
          feedList: JSON.parse(JSON.stringify(feed.items.splice(0, 10))),
          feedLink: feed?.link[1].href || feed.link,
          feedTitle: feed.title,
        },
      };
    } catch (err) {
      return {
        props: {
          msg: "Something went wrong",
          feedList: [],
          feedLink: "",
          tweetList: [],
        },
      };
    }
  },
});
