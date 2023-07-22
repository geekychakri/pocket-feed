module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
};
