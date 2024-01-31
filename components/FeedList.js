import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { decode } from "html-entities";
import { HeadphonesAlt } from "@styled-icons/fa-solid/HeadphonesAlt";
import { ExternalLinkOutline } from "@styled-icons/evaicons-outline/ExternalLinkOutline";
import { ControllerPlay } from "@styled-icons/entypo/ControllerPlay";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});
const ModalVideo = dynamic(() => import("react-modal-video"), {
  ssr: false,
});

dayjs.extend(relativeTime);

function FeedList({ feedList, feedLink, feedTitle }) {
  let latestPodcastTitle = feedList[0]?.title || "";
  let latestPodcastURL = "";
  if (feedList[0]?.enclosures?.length) {
    latestPodcastURL = feedList[0].enclosures[0].url;
  }

  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [audioURL, setAudioURL] = useState(latestPodcastURL);
  const [podcastTitle, setPodcastTitle] = useState(latestPodcastTitle);
  const [isPlaying, setIsPlaying] = useState(false);

  const router = useRouter();

  const isYouTube = router.query.category === "youtube";
  const isPodcast = router.query.category === "podcast";

  const handleOpen = () => {
    setIsOpen(true);
    document.body.style.overflowY = "hidden";
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflowY = "scroll";
  };

  const PodcastPlayer = () => {
    return (
      <div className="list__podcast">
        <h2 className="list__podcast-heading">
          <span className="u-mr2">Now Listening</span>
          <HeadphonesAlt size={44} />
        </h2>
        <p className="list__podcast-title">{podcastTitle}</p>
        <ReactPlayer
          url={audioURL}
          controls
          width="100%"
          height="50px"
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
          playing={isPlaying}
        />
      </div>
    );
  };

  return (
    <>
      <h1 className="list__heading">{feedTitle}</h1>
      {isPodcast && feedList[0]?.enclosures.length ? <PodcastPlayer /> : null}
      <AnimatePresence>
        {feedList.map((item, i) => {
          return (
            <motion.a
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
              href={isYouTube || isPodcast ? null : item.link}
              target="__blank"
              rel="noopener noreferrer"
              className="list__item"
              key={i}
            >
              <span className="list__item-header">
                <span
                  className={`list__item-main  ${
                    isYouTube || isPodcast ? "" : ""
                  }`}
                >
                  <span className="list__item-title">{decode(item.title)}</span>
                  <span className="list__item-content">
                    {decode(item.content)
                      .replace(/(<([^>]+)>)/gi, "")
                      .replace(/(&#[^;]+;)/gi, "") ||
                      decode(item.description)
                        .replace(/(<([^>]+)>)/gi, "")
                        .replace(/(&#[^;]+;)/gi, "")}
                  </span>
                  <span className="list__item-info">
                    <span
                      className="list__item-date"
                      title={dayjs(item.created).format("DD-MM-YYYY, hh:mm a")}
                    >
                      {dayjs(item.created).fromNow()}
                    </span>
                    {isYouTube && (
                      <button
                        className="list__item-play"
                        onClick={() => {
                          const id = item.id.split(":")[2];
                          setVideoId(id);
                          handleOpen();
                        }}
                      >
                        <ControllerPlay size={28} />
                        <span style={{ marginLeft: "1px" }}>Play</span>
                      </button>
                    )}
                    {isPodcast && feedList[0].enclosures.length ? (
                      <button
                        className="list__item-play"
                        onClick={() => {
                          setPodcastTitle(decode(item.title));
                          setAudioURL(item.enclosures[0].url);
                          setIsPlaying(true);
                        }}
                      >
                        <ControllerPlay size={28} />
                        <span style={{ marginLeft: "1px" }}>Play</span>
                      </button>
                    ) : (
                      isPodcast && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="list__item-play"
                        >
                          <span style={{ marginRight: "5px" }}>Listen</span>
                          <ExternalLinkOutline size={28} />
                        </a>
                      )
                    )}
                  </span>
                </span>
              </span>
            </motion.a>
          );
        })}
      </AnimatePresence>

      <a
        href={feedLink}
        target="__blank"
        rel="noopener noreferrer"
        className="list__link"
      >
        {isYouTube ? "Visit Channel" : "Visit Page"}
      </a>

      {isYouTube && (
        <ModalVideo
          channel="youtube"
          autoplay
          isOpen={isOpen}
          videoId={videoId}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export default FeedList;
