/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        source: "/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42',
        permanent: true,
      },
      {
        source: '/marketplace',
        destination: '/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42',
        permanent: true,
      },
      {
        source: '/marketplace/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
      {
        source: '/en-US/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
    ]
  },
  transpilePackages: ['@reservoir0x/reservoir-kit-ui'],
}

module.exports = nextConfig
