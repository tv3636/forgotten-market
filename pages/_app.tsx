import { Provider as MobxStateTreeProvider } from "../store";
import Head from "next/head";
import { useGTag } from "../hooks/useGTag";
import { useStore } from "../store";
import { AnimateSharedLayout } from "framer-motion";
import NextNprogress from "nextjs-progressbar";
import "../public/static/game/wizards/fonts.css";
import "../styles/root.css";
import { ChainId, DAppProvider } from "@usedapp/core";

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
        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta
          name="twitter:creator"
          content={"@forgottenrunes"}
          key="twhandle"
        />
        <meta 
          name="twitter:image" 
          content={"https://forgotten.market/static/img/OSFeature.png"}
          key="twimage"
        />

        {/* Open Graph */}
        <meta
          property="og:url"
          content={"https://forgotten.market"}
          key="ogurl"
        />
        <meta
          property="og:image"
          content={"https://forgotten.market/static/img/OSFeature.png"}
          key="ogimage"
        />
        <meta
          property="og:site_name"
          content={"Forgotten Market"}
          key="ogsitename"
        />
        <meta
          property="og:title"
          content={"Forgotten Market"}
          key="ogtitle"
        />
      </Head>
      <DAppProvider
        config={{
          readOnlyChainId: ChainId.Mainnet,
        }}
      >
        <MobxStateTreeProvider value={store}>
          <AnimateSharedLayout>
            <Component {...pageProps} />
            <NextNprogress
              color="darkgrey"
              startPosition={0.1}
              stopDelayMs={200}
              height={3}
              showOnShallow={false}
            />
          </AnimateSharedLayout>
        </MobxStateTreeProvider>
      </DAppProvider>
    </>
  );
}

export default App;
