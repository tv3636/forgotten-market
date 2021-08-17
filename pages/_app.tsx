import { Provider as MobxStateTreeProvider } from "../store";

import Head from "next/head";
import { useGTag } from "../hooks/useGTag";
import { useStore } from "../store";

import "../public/static/game/wizards/fonts.css";
import "../styles/root.css";

function App({ Component, pageProps }: { Component: any; pageProps: any }) {
  useGTag();
  const store = useStore(pageProps.initialState);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/static/img/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/img/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/img/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="64x64"
          href="/static/img/favicon64.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/static/img/favicon128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/static/img/favicon256.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/static/img/favicon512.png"
        />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta
          name="twitter:creator"
          content={"@forgottenrunes"}
          key="twhandle"
        />

        {/* Open Graph */}
        <meta
          property="og:url"
          content={"https://forgottenrunes.com"}
          key="ogurl"
        />
        <meta
          property="og:image"
          content={"/static/img/OSFeature.png"}
          key="ogimage"
        />
        <meta
          property="og:site_name"
          content={"Forgotten Runes Wizard's Cult: 10k on-chain Wizard NFTs"}
          key="ogsitename"
        />
        <meta
          property="og:title"
          content={"Forgotten Runes Wizard's Cult: 10k on-chain Wizard NFTs"}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={"Forgotten Runes Wizard's Cult: 10k on-chain Wizard NFTs"}
          key="ogdesc"
        />
      </Head>

      <MobxStateTreeProvider value={store}>
        <Component {...pageProps} />
      </MobxStateTreeProvider>
    </>
  );
}

export default App;
