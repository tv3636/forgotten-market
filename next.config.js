const path = require("path");
const webpack = require("webpack");
const root = path.resolve(__dirname);
const withImages = require("next-images");
const withSvgr = require("next-svgr");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/
});

// https://gist.github.com/diachedelic/6ded48f5c6442482fa69e91ec7ab1742
let nextConfig = {
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react$: path.resolve(root, "./node_modules/react")
    };
    return config;
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  // images: {
  //   domains: ['nftz.forgottenrunes.com'],
  // },

};

nextConfig = withImages(nextConfig);
nextConfig = withSvgr(nextConfig);
nextConfig = withMDX(nextConfig);

module.exports = nextConfig;
