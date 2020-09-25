const env = process.env || {};
export const OEMBED_ENDPOINT =
  env.OEMBED_ENDPOINT || "https://embed.alpacamaps.com/oembed";
export const BASE_URL = env.BASE_URL || "https://embed.alpacamaps.com";
