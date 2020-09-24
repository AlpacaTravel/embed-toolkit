// FIXME: Remove axios
const axios = require("axios");
const config = require("../config");

const defaults = {
  oembedService: config.OEMBED_ENDPOINT,
};

// Obtain the oembed information based on the supplied url
const get = (url, options = {}) =>
  new Promise((success, fail) => {
    const resolvedOptions = Object.assign({}, defaults, options);
    const {
      width,
      height,
      viewMode,
      responsive,
      baseUrl,
      oembedService,
    } = resolvedOptions;

    // OEmbed Options
    const params = {
      url,
      width,
      height,
      viewMode,
      responsive,
      baseUrl,
    };

    // Query oEmbed
    axios
      .get(resolvedOptions.oembedService, { params })
      .then(({ data }) => success(data))
      .catch(fail);
  });

module.exports = {
  get,
};
