import * as oembed from "../api/oembed";

// Setup the default options
const defaultOptions: { iframe: null } = {
  iframe: null,
};

type AttachOptions = {
  url: string;
  target: string | HTMLElement;
  iframe?: HTMLIFrameElement;
  width?: number;
  height?: number;
};

// Embed the item
export const attach = async (
  url: string,
  target: HTMLElement,
  options: AttachOptions
) => {
  console.assert(url, "Missing URL to embed");
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
  const iframe = await obtainIFrameElement(url, resolvedOptions);

  // Append the node
  target.appendChild(iframe);

  // Return the reference to the iframe element target
  return iframe;
};

// Query the oembed
export const obtainIFrameElement = async (
  url: string,
  options: AttachOptions
) => {
  if (options.iframe) {
    return options.iframe;
  }

  // Obtain the oembed
  const data = await oembed.get(url, options);
  console.assert(data.html, "Failed to lookup the oembed iframe html");

  // Return a iframe element
  const div = document.createElement("div");
  div.innerHTML = data.html;

  // Return the first child
  return div.firstChild as HTMLIFrameElement;
};
