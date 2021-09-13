import * as React from "react";

import Head from "next/head";

const ogImageBaseURL = `https://og.forgottenrunes.com/`;

type Props = {
  wizard?: string | number;
  fontSize?: string;
  title: string;
};

// TODO figure out the min-max of font-size
// actually put this in the og-generator
function linearmap(
  value: number,
  istart: number,
  istop: number,
  ostart: number,
  ostop: number
) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

// https://og.forgottenrunes.com/6001.png?wizard=6001&fontSize=128px
export default function OgImage({ title, fontSize, wizard }: Props) {
  const filename = encodeURIComponent(title);
  let params: any = {};
  if (fontSize) {
    params.fontSize = fontSize;
  }
  if (wizard) {
    params.wizard = wizard;
  }
  const queryString = Object.keys(params)
    .map((key) => key + "=" + params[key])
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
    </Head>
  );
}
