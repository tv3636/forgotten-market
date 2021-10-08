import * as React from "react";
import { isNumber } from "lodash";

import Head from "next/head";

const ogImageBaseURL =
  process.env.NEXT_PUBLIC_OG_IMAGE_BASE ?? `https://og.forgottenrunes.com/`;

type Props = {
  wizard?: string | number;
  wizardImage?: string | number;
  fontSize?: string;
  title: string;
  images?: string | null;
  bgColor?: string;
};

// https://og.forgottenrunes.com/6001.png?wizard=6001&fontSize=128px
export default function OgImage({
  title,
  fontSize,
  wizard,
  wizardImage,
  images,
  bgColor,
}: Props) {
  const filename = encodeURIComponent(title);
  let params: any = {};
  if (fontSize) {
    params.fontSize = fontSize;
  }
  if (isNumber(wizard) && !images) {
    params.wizard = wizard;
  }
  if (isNumber(wizardImage) && !images) {
    params.wizardImage = wizardImage;
  }
  if (images) {
    params.images = images;
  }
  if (bgColor) {
    params.bgColor = bgColor;
  }
  const queryString = Object.keys(params)
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");
  const ogImageUrl = [ogImageBaseURL, filename, ".png", "?", queryString].join(
    ""
  );

  return (
    <Head>
      <meta property="og:image" key="ogimage" content={ogImageUrl} />
      <meta name="twitter:image" key="twitterimage" content={ogImageUrl} />
      <meta
        name="twitter:card"
        key="twittercard"
        content="summary_large_image"
      />
      <meta name="twitter:image:width" content="2048" />
      <meta name="twitter:image:height" content="1170" />
    </Head>
  );
}
