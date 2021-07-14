const path = require("path");
const webpack = require("webpack");
const root = path.resolve(__dirname);
const withImages = require("next-images");
const withSvgr = require("next-svgr");

// https://gist.github.com/diachedelic/6ded48f5c6442482fa69e91ec7ab1742
let nextConfig = {
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react$: path.resolve(root, "./node_modules/react")
    };
    return config;
  }
};

nextConfig = withImages(nextConfig);
nextConfig = withSvgr(nextConfig);

module.exports = nextConfig;
