import "isomorphic-fetch";
import { Promise } from "es6-promise";
import * as config from "../config";

export type GetOptions = {
  width?: number;
  height?: number;
  viewMode?: string;
  responsive?: boolean;
  baseUrl?: string;
  oembedService?: string;
};

const defaults: GetOptions = {
  oembedService: config.OEMBED_ENDPOINT,
};

type OEmbedResponse = {
  html: string;
};

// Obtain the oembed information based on the supplied url
export const get = (url: string, options: GetOptions = {}) =>
  new Promise<OEmbedResponse>((success, fail) => {
    const resolvedOptions = (<any>Object).assign({}, defaults, options);
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
    if (params.url) {
      embedService.searchParams.append("url", params.url);
    }
    if (params.width) {
      embedService.searchParams.append("width", params.width);
    }
    if (params.width) {
      embedService.searchParams.append("height", params.height);
    }
    if (params.responsive === false) {
      embedService.searchParams.append("responsive", "false");
    }
    if (params.viewMode) {
      embedService.searchParams.append("viewMode", params.viewMode);
    }
    if (params.baseUrl) {
      embedService.searchParams.append("baseUrl", params.baseUrl);
    }

    return fetch(embedService.toString())
      .then((res) => {
        success(res.json());
      })
      .catch(fail);
  });
