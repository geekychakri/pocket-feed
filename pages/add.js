import { useState } from "react";
import router from "next/router";

import toast, { Toaster } from "react-hot-toast";
import { nanoid } from "nanoid";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";

const toastStyles = {
  fontSize: "2rem",
  fontWeight: "600",
  backgroundColor: "#181818",
  color: "#fff",
};

function Add() {
  const { user } = useUser();

  console.log(user?.sub);

  const [formState, setFormState] = useState({
    url: "",
    category: "youtube",
  });

  const [feedData, setFeedData] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const isObjectEmpty = Object.keys(feedData).length === 0;

  const addFeed = async () => {
    toast.loading("Adding...", {
      id: "add",
      style: toastStyles,
    });
    console.log("CLICKED");
    const feedId = nanoid();
    try {
      const res = await fetch("/api/handleUser");
      const data = await res.json();
      console.log("USER_FEED_LIST", data);
      console.log(data?.[0]?.feeds);

      //CHECK IF FEED ALREADY EXISTS
      if (data?.[0]?.feeds) {
        const checkFeedExists = data[0].feeds.some(
          (feed) => feed.title === feedData.title
        );
        if (checkFeedExists) {
          toast.remove("add");
          toast("Feed Already Exists", {
            style: toastStyles,
          });
          return;
        }
      }

      //UPDATE THE USER WITH A NEW FEED
      if (data.length) {
        console.log("USER ALREADY EXISTS");
        const res = await fetch("/api/handleUser", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: feedData.title,
            url: feedData.url || formState.url,
            feedUrl: feedData.feed,
            favicon: feedData.favicon,
            category: formState.category,
            twitterId: feedData.twitterId,
            feedId,
          }),
        });
        console.log(res);
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        toast.remove("add");
        router.push(`/feed/${formState.category}`);
        return;
      }

      //IF USER DOESN'T EXIST CREATE A NEW USER
      if (!data.length) {
        console.log("USER DOESN'T EXIST");
        const res = await fetch("/api/handleUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user?.sub,
            feeds: [
              {
                title: feedData.title,
                url: feedData.url || formState.url,
                feedUrl: feedData.feed,
                favicon: feedData.favicon,
                category: formState.category,
                twitterId: feedData.twitterId,
                feedId,
              },
            ],
          }),
        });
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        toast.remove("add");
        router.push(`/feed/${formState.category}`);
      }
    } catch (err) {
      console.log("ERROR");
      toast.remove("add");
      toast.error(err.message, {
        style: toastStyles,
      });
    }
  };

  const handleChange = (e) => {
    setFeedData({});
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const res = await fetch("/api/findFeed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      console.log(res);
      const responseData = await res.json();
      console.log(responseData);
      if (!res.ok) {
        throw new Error(responseData.msg);
      }
      setFeedData(responseData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message, {
        style: toastStyles,
      });
    }
  };

  console.log("TWITTER_ID", feedData.twitterId);

  return (
    <div className="add">
      <h2 className="add__heading">Add a Feed</h2>
      <form className="add__form" onSubmit={handleSubmit}>
        <label htmlFor="url" className="add__label">
          Please enter a URL
        </label>
        <input
          type="url"
          placeholder="https://example.com"
          className="add__input"
          id="url"
          name="url"
          required
          onChange={handleChange}
        />
        <label htmlFor="categories" className="add__label">
          Select a category
        </label>
        <select
          name="category"
          id="categories"
          className="add__select"
          value={formState.category}
          onChange={handleChange}
        >
          <option value="youtube">YouTube</option>
          <option value="twitter">Twitter</option>
          <option value="reddit">Reddit</option>
          <option value="news">News</option>
          <option value="blog">Blog</option>
          <option value="podcast">Podcast</option>
        </select>
        {isObjectEmpty && (
          <button className="add__btn">
            {isLoading ? <div className="spinner"></div> : "Continue"}
          </button>
        )}
      </form>
      {!isObjectEmpty && (
        <div className="add__feed">
          {feedData.favicon ? (
            <img
              src={feedData.favicon}
              width="25"
              height="25"
              alt="icon"
              className="add__feed-icon"
            />
          ) : (
            <div className="add__feed-image add__default-img">
              {feedData.title.split("")[0]}
            </div>
          )}

          <h2 className="add__feed-title">{feedData.title}</h2>
          <p className="add__feed-url">{feedData.url || formState.url}</p>
          <button className="add__btn" onClick={addFeed}>
            Add
          </button>
        </div>
      )}
      <Toaster position="bottom-center" />
    </div>
  );
}

export default Add;

export const getServerSideProps = withPageAuthRequired();
