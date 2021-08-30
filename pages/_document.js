import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preload"
            href="/fonts/SourceSans3VF-Roman.ttf.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <script
            defer
            data-domain="pocket-feed.vercel.app"
            src="https://plausible.io/js/plausible.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
