require("isomorphic-fetch");

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
    const embedService = new URL(resolvedOptions.oembedService);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        embedService.searchParams.append(key, params[key]);
      }
    });
    return fetch(embedService)
      .then((res) => {
        success(res.json());
      })
      .catch(fail);
  });

module.exports = {
  get,
};
