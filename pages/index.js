import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { getSession } from "@auth0/nextjs-auth0";
import { motion, useReducedMotion } from "framer-motion";

import { ChevronRight } from "@styled-icons/entypo/ChevronRight";
import { Video } from "@styled-icons/fa-solid/Video";

const ModalVideo = dynamic(() => import("react-modal-video"), {
  ssr: false,
});

function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const container = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    show: { opacity: 1 },
  };

  const fadeInRight = {
    hidden: {
      x: shouldReduceMotion ? 0 : 60,
      opacity: shouldReduceMotion ? 1 : 0,
    },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const fadeInLeft = {
    hidden: {
      x: shouldReduceMotion ? 0 : -60,
      opacity: shouldReduceMotion ? 1 : 0,
    },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <motion.header
        className="header"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="header__text-box">
          <motion.h1 className="heading-primary">
            <motion.span variants={item} className="heading-primary--main">
              More Signal. Less Noise.
            </motion.span>
            <motion.span variants={item} className="heading-primary--sub">
              The one stop shop for content you love.
            </motion.span>
          </motion.h1>
          <motion.div className="header__btns" variants={fadeInLeft}>
            <a href="/api/auth/login" className="btn-main">
              <span style={{ marginRight: "1.5rem" }}>TRY NOW</span>
              <ChevronRight size={32} className="icon-chevron" />
            </a>
            <button className="btn-video" onClick={() => setIsOpen(true)}>
              <Video size={32} />
              <span style={{ marginLeft: "1.5rem" }}>Watch Demo</span>
            </button>
          </motion.div>
          <motion.p className="maker" variants={fadeInLeft}>
            Made with love by{" "}
            <a
              href="https://twitter.com/geekychakri"
              rel="noopener norefereer"
              target="__blank"
              className="maker__connect"
            >
              Chakri
            </a>
          </motion.p>
        </motion.div>
        <motion.div className="header__img" variants={fadeInRight}>
          <Image
            src="/img/header.png"
            alt="illustration"
            width="450"
            height="450"
          />
        </motion.div>
      </motion.header>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="ulBqEc0dbPI"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default Home;

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = getSession(req, res);

  if (session?.user) {
    return {
      redirect: {
        destination: "/feed/blog",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
