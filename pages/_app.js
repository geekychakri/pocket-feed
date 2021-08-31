import { useState, useEffect } from "react";

import Head from "next/head";
import Router from "next/router";

import { UserProvider } from "@auth0/nextjs-auth0";

import "../styles/normalize.css";
import "../styles/styles.css";
import "react-modal-video/css/modal-video.min.css";

import Layout from "../components/Layout";
import DeleteContextProvider from "../contexts/DeleteContext";
import PFLoader from "./../components/PFLoader";

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setIsLoading(true);
    };
    const end = () => {
      setIsLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="The one-stop shop for content you love"
        />
        <meta name="keywords" content="productivity" />
        <meta name="theme-color" content="#fcf8f4" />
        <meta property="og:title" content="Pocket Feed" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pocket-feed.vercel.app" />
        <meta
          property="og:description"
          content="The one-stop shop for content you love"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://pocket-feed.vercel.app/cover.png"
        />
        <meta name="twitter:title" content="Pocket Feed" />
        <meta
          name="twitter:description"
          content="The one-stop shop for content you love"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Pocket Feed</title>
      </Head>
      <UserProvider>
        <DeleteContextProvider>
          <Layout>
            {isLoading ? <PFLoader /> : <Component {...pageProps} />}
          </Layout>
        </DeleteContextProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
