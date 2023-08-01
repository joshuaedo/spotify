import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Listen to any song, anywhere" />
        <meta name="url" content="https://joshuaedo-spotify.vercel.app/" />
        <meta
          name="identifier-URL"
          content="https://joshuaedo-spotify.vercel.app/"
        />
        <meta name="pagename" content="Stream" />
        <meta
          property="og:description"
          content="Listen to any song, anywhere"
        />
        <meta property="og:site_name" content="Stream" />
        <meta property="og:type" content="website" />
        <meta name="twitter:creator" content="joshua edo" />
        <meta
          name="twitter:description"
          content="Listen to any song, anywhere"
        />
        <link rel="preconnect" href="https://sdk.scdn.co" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
