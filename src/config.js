const env = process.env || {};

module.exports = {
  OEMBED_ENDPOINT: env.OEMBED_ENDPOINT || "https://embed.alpacamaps.com/oembed",
  BASE_URL: env.BASE_URL || "https://embed.alpacamaps.com",
};
