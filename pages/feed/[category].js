import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight } from "@styled-icons/boxicons-solid/ChevronRight";
import { Trash } from "@styled-icons/boxicons-solid/Trash";
import { Plus } from "@styled-icons/boxicons-regular/Plus";
import { FileBlank } from "@styled-icons/boxicons-regular/FileBlank";
import toast, { Toaster } from "react-hot-toast";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import dbConnect from "../../utils/db";
import User from "./../../models/User";
import { DeleteContext } from "../../contexts/DeleteContext";

const toastStyles = {
  fontSize: "2rem",
  fontWeight: "600",
  backgroundColor: "#181818",
  color: "#fff",
};

function CategoryFeed({ feedData }) {
  const shouldReduceMotion = useReducedMotion();

  const { isActive } = useContext(DeleteContext);

  const [feed, setFeed] = useState(feedData);

  const router = useRouter();
  console.log(router.query.category);

  console.log("FEED", feed);

  const deleteFeed = async (feedId) => {
    try {
      const res = await fetch("/api/deleteFeed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedId }),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.msg);
      }
      const prevFeed = [...feed];
      const newFeed = prevFeed.filter((feed) => feed.feedId !== feedId);
      setFeed(newFeed);
    } catch (err) {
      toast.error(err.message, {
        style: toastStyles,
      });
    }
  };

  return (
    <>
      {feed.length ? (
        <div className="category-feed">
          <AnimatePresence>
            {feed.map((item, i) => (
              <motion.div
                className="category-feed__item"
                key={item.feedId}
                variants={{
                  hidden: () => ({
                    y: shouldReduceMotion ? 0 : -60 * i,
                    opacity: shouldReduceMotion ? 1 : 0,
                  }),
                  show: () => ({
                    y: 0,
                    opacity: 1,
                    transition: {
                      delay: i * 0.05,
                    },
                  }),
                  exit: {
                    opacity: 0,
                  },
                }}
                initial="hidden"
                custom={i}
                animate="show"
                exit="exit"
              >
                <Link
                  href={`/feed/${router.query.category}/list?id=${item.feedId}`}
                >
                  <a className="category-feed__item-link">
                    {item.favicon ? (
                      <img
                        src={item.favicon}
                        alt="feed-logo"
                        className="category-feed__image"
                        width="30"
                        height="30"
                      />
                    ) : (
                      <span className="add__feed-image category__default-img">
                        {item.title.split("")[0]}
                      </span>
                    )}

                    <span className="u-ml1-5">{item.title}</span>
                  </a>
                </Link>

                <div className="category__feed-icon">
                  {isActive ? (
                    <button
                      onClick={() => deleteFeed(item.feedId)}
                      className="trash-icon"
                      title="Delete"
                    >
                      <Trash size={28} />
                    </button>
                  ) : (
                    <button
                      className="icon-chevron"
                      onClick={() =>
                        router.push(
                          `/feed/${router.query.category}/list?id=${item.feedId}`
                        )
                      }
                    >
                      <ChevronRight size={28} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <Toaster position="bottom-center" />
        </div>
      ) : (
        <div className="category__empty">
          <FileBlank size={60} opacity="0.5" />
          <p className="category__empty-heading">No Feeds Yet</p>
          <p className="category__empty-text">
            The feed you add will appear here.
          </p>
          <Link href="/add">
            <a className="category__empty-link">
              <Plus size={28} />
              <span className="u-ml1">Add a feed</span>
            </a>
          </Link>
        </div>
      )}
    </>
  );
}

export default CategoryFeed;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const { req, res, query } = context;

    await dbConnect();

    // console.log("QUERY", query.category);

    const session = await getSession(req, res);

    try {
      const data = await User.find({ user: session?.user.sub });

      console.log("SERVER_SIDE_DATA", data[0].feeds);

      const filteredData = data[0].feeds.filter(
        (item) => item.category === query.category
      );
      console.log("FILTERED_DATA", filteredData);

      return {
        props: {
          feedData: JSON.parse(JSON.stringify(filteredData)),
        },
      };
    } catch (err) {
      return {
        props: {
          err: "Something went wrong",
          feedData: [],
        },
      };
    }
  },
});
