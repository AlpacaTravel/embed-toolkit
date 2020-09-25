import * as oembed from "../api/oembed";

// Setup the default options
const defaultOptions = {};

type AttachWithoutIframeOptions = {
  url: string;
  target: string | HTMLElement;
};

type AttachOptions = oembed.GetOptions & AttachWithoutIframeOptions;

// Embed the item
export const attach = async (target: HTMLElement, options: AttachOptions) => {
  console.assert(target, "Required target element");

  if (typeof target === "string") {
    // Selector?
    console.error("Please supply the element");
  }

  console.assert(
    target.appendChild,
    "Target should be an element we can appendNode to. Check the supplied element is a HTML Dom Element"
  );

  // Setup the embed options
  const resolvedOptions: AttachOptions = (<any>Object).assign(
    {},
    defaultOptions,
    options
  );

  // Add the iframe to the target element
  const html = await (async () => {
    const val = await getOembedHtml(
      options.url,
      resolvedOptions as oembed.GetOptions
    );

    return val;
  })();

  // Append the node
  target.innerHTML = html;

  // Return the reference to the iframe element target
  return target.firstChild as HTMLIFrameElement;
};

export const getOembedHtml = async (
  url: string,
  options: oembed.GetOptions
) => {
  // Obtain the oembed
  const data = await oembed.get(url, options);
  console.assert(data.html, "Failed to lookup the oembed iframe html");

  return data.html;
};

// Query the oembed
export const obtainIFrameElement = async (
  url: string,
  options: oembed.GetOptions
) => {
  const html = await getOembedHtml(url, options);

  // Return a iframe element
  const div = document.createElement("div");
  div.innerHTML = html;

  // Return the first child
  return div.firstChild as HTMLIFrameElement;
};
