const path = require("path");
const webpack = require("webpack");
const root = path.resolve(__dirname);
const withImages = require("next-images");
const withSvgr = require("next-svgr");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});
const withTM = require("next-transpile-modules")([
  "rehype-slug",
  "rehype-autolink-headings",
  "hast-util-has-property",
  "hast-util-heading-rank",
  "hast-util-to-string",
  "hast-util-is-element",
  "unist-util-is",
]);

// https://gist.github.com/diachedelic/6ded48f5c6442482fa69e91ec7ab1742
let nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react$: path.resolve(root, "./node_modules/react"),
    };

    if (isServer) {
      return {
        ...config,
        entry() {
          return config.entry().then((entry) => {
            return Object.assign({}, entry, {
              lorebackup: "./scripts/book-of-lore-backup.ts",
            });
          });
        },
      };
    }

    // if (!options.isServer) {
    //   config.node = {
    //     fs: "empty",
    //   };
    // }
    return config;
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en-US", "ja"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en-US",
    localeDetection: true,
  },
  images: {
    domains: ["nftz.forgottenrunes.com", "cloudflare-ipfs.com"],
  },
  experimental: { esmExternals: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

nextConfig = withImages(nextConfig);
nextConfig = withSvgr(nextConfig);
nextConfig = withMDX(nextConfig);
nextConfig = withTM({
  webpack5: false,
  ...nextConfig,
});

module.exports = nextConfig;
