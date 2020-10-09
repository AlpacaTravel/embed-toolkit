import { get } from "./api/oembed";
import * as config from "./config";

// Obtain the script attribute
const element = document.currentScript;

// Obtain the configuration
const id = element.getAttribute("id");
const dataset = element.dataset;
const contentId = dataset.id;

// Build the container
const containerId = dataset.containerId || "alpacaWidget";
if (!document.getElementById(containerId)) {
  document.write(`<div id="${containerId}"></div>`);
}

// Build the oembed service options
const oembedOptions = (() => {
  const width = dataset.width && Number(dataset.width);
  const height = dataset.height && Number(dataset.height);
  const baseUrl = dataset.baseUrl || config.BASE_URL;
  const responsive = dataset.responsive === "false" ? false : undefined;
  const oembedService = dataset.oembedService || config.OEMBED_ENDPOINT;
  const viewMode = dataset.viewMode;
  const inline = dataset.inline === "true" ? true : undefined;

  return {
    width,
    height,
    baseUrl,
    responsive,
    oembedService,
    viewMode,
    inline,
  };
})();

// Can't directly insert the HTML script tags
function insertHTML(html, dest, append = false) {
  if (!append) dest.innerHTML = "";
  let container = document.createElement("div");
  container.innerHTML = html;
  let scripts = container.querySelectorAll("script");
  let nodes = container.childNodes;
  for (let i = 0; i < nodes.length; i++)
    dest.appendChild(nodes[i].cloneNode(true));
  for (let i = 0; i < scripts.length; i++) {
    let script = document.createElement("script");
    script.type = scripts[i].type || "text/javascript";
    if (scripts[i].hasAttribute("src")) script.src = scripts[i].src;
    script.innerHTML = scripts[i].innerHTML;
    document.head.appendChild(script);
    document.head.removeChild(script);
  }
  return true;
}

// Write via oembed
const oembed = async (url, options) => {
  try {
    const { html } = await get(url, options);

    // Determine the insertion mode
    if (oembedOptions.inline) {
      // Insert a path for us to use a memory history
      (window as any).shimLocation = {
        path: `/${contentId}/${oembedOptions.viewMode}`,
      };
      insertHTML(html, document.getElementById(containerId));
    } else {
      document.getElementById(containerId).innerHTML = html;
    }
  } catch (e) {
    console.error(e);
  }
};

// Include the oembed in place
oembed(`https://embed.alpacamaps.com/${contentId}`, oembedOptions);
