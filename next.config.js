const path = require("path");
const webpack = require("webpack");
const root = path.resolve(__dirname);
const withImages = require("next-images");
const withSvgr = require("next-svgr");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/
});
const withTM = require("next-transpile-modules")([
  "rehype-slug",
  "rehype-autolink-headings",
  "hast-util-has-property",
  "hast-util-heading-rank",
  "hast-util-to-string",
  "hast-util-is-element"
]);

// https://gist.github.com/diachedelic/6ded48f5c6442482fa69e91ec7ab1742
let nextConfig = {
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react$: path.resolve(root, "./node_modules/react")
    };
    return config;
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"]
};

nextConfig = withImages(nextConfig);
nextConfig = withSvgr(nextConfig);
nextConfig = withMDX(nextConfig);
nextConfig = withTM({
  webpack5: false,
  ...nextConfig
});

module.exports = nextConfig;
