import Head from "next/head";
import { ReactNode } from "react";
import SiteNav from "./NewSiteNav";

type Props = {
  children?: ReactNode;
  description?: string;
  title?: string;
  image?: string;
};

const Layout = ({
  children,
  description,
  image = "https://forgotten.market/static/img/OSFeature.png",
  title = "forgotten.market",
}: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content={title} key="ogtitle" />
      <meta name="twitter:title" content={title} key="twittertitle" />
      <meta name="twitter:card" content="summary_large_image" key="twcard" />

      {description && (
        <meta property="og:description" content={description} key="ogdesc" />
      )}
      {description && (
        <meta
          name="twitter:description"
          content={description}
          key="twitterdesc"
        />
      )}

      {image ? (
        <meta 
          name="twitter:image" 
          content={image}
          key="twimage"
        />
      ) :
      <meta 
        name="twitter:image" 
        content={"https://forgotten.market/static/img/OSFeature.png"}
        key="twimage"
      />
    }

      {image ? (
      <meta
        property="og:image"
        content={image}
        key="ogimage"
      />
      ) :
      <meta
        property="og:image"
        content={"https://forgotten.market/static/img/OSFeature.png"}
        key="ogimage"
      />
      }
      
      {/* <meta property="og:image" content="image.png" /> */}
    </Head>
    <SiteNav />
    {children}
  </div>
);

export default Layout;