import { decode } from "html-entities";
import dayjs from "dayjs";

function TwitterList({ tweetList }) {
  console.log("MEDIA", tweetList.includes.media);

  return (
    <>
      <h2 className="list__heading">{tweetList.includes.users[0].name}</h2>
      {tweetList.data.map((tweet, index) => {
        let imageUrl, imageIndex;
        if (tweetList.includes?.media) {
          imageIndex = tweetList.includes.media.findIndex(
            (item) => item.media_key === tweet?.attachments?.media_keys[0]
          );

          // console.log(imageIndex);
          // console.log(tweetList.includes.users[0].username);

          imageUrl =
            tweetList.includes?.media[imageIndex]?.url ||
            tweetList.includes?.media[imageIndex]?.preview_image_url;
        }

        return (
          <a
            className="list__twitter"
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            href={`https://twitter.com/${tweetList.includes.users[0].username}/status/${tweet.id}`}
          >
            <span className="list__twitter-date">
              {dayjs(tweet.created_at).format("DD-MM-YYYY, hh:mm a")}
            </span>
            <span className="list__twitter-text">{decode(tweet.text)}</span>
            {tweetList.includes.media && imageIndex !== -1 && (
              <img
                src={imageUrl}
                width="100%"
                className="list__twitter-media"
              />
            )}
          </a>
        );
      })}
      <a
        href={`https://twitter.com/${tweetList.includes.users[0].username}`}
        target="__blank"
        rel="noopener noreferrer"
        className="list__link"
      >
        Visit Profile
      </a>
    </>
  );
}

export default TwitterList;
