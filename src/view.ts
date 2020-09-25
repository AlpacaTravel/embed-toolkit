import Evented from "./evented";
import assert from "./assert";
import * as messaging from "./window/messaging";
import * as embed from "./window/embed";
import * as oembed from "./api/oembed";
import * as config from "./config";
import {
  FeatureItem,
  WindowMessaging,
  TargetViewport,
  TargetMove,
} from "./types";

/*let messaging = null;
if (process.env.NODE_ENV === "test") {
  messaging = require("./window/messaging");
} else {
  messaging = require("./window/channel-messaging");
}*/

const defaultOptions = {};

const defaultGetOptions = {
  baseUrl: config.BASE_URL,
  oembedService: config.OEMBED_ENDPOINT,
};

function isIframe(obj: any): obj is IframeAttach {
  return obj.iframe !== undefined;
}

function isOembed(obj: any): obj is OembedAttach {
  return obj.url && obj.container;
}

type OembedAttach = oembed.GetOptions & {
  container: HTMLElement | string;
  url: string;
};

type IframeAttach = {
  iframe: HTMLIFrameElement;
  host?: string;
};

type ViewOptions = IframeAttach | OembedAttach;

type MessagingResponse = {
  type: string;
  payload: any;
};

class View extends Evented<EventType> {
  private options: ViewOptions;

  private container?: HTMLElement;
  private initialising?: Promise<void>;
  private messaging?: WindowMessaging;
  private target?: Window;
  private iframe?: HTMLIFrameElement;
  private items?: Promise<FeatureItem[]>;

  constructor(options: ViewOptions) {
    super();

    // Resolve the options we are using
    const resolvedDefaultOptions = (() => {
      if (isIframe(options)) {
        return (<any>Object).assign({}, defaultOptions);
      }
      return (<any>Object).assign({}, defaultOptions, defaultGetOptions);
    })();
    const resolvedOptions = (<any>Object).assign(
      {},
      resolvedDefaultOptions,
      options
    );
    this.options = resolvedOptions;

    // Passing the iframe directly
    if (isIframe(this.options)) {
      const { iframe } = options as IframeAttach;
      this.iframe = iframe;
      // Set the target in the app
      if (!iframe.contentWindow) {
        throw new Error("Unable to obtain the content window for the iframe");
      }

      this.target = iframe.contentWindow;
    } else {
      // Use OEmbed
      if (!this.options.container || !this.options.url) {
        throw new Error(
          "Must define the url and the container (via ID or supplying the element)"
        );
      }
      // Setup the element based on the container
      if (typeof this.options.container === "string") {
        const matchedContainer = document.getElementById(
          this.options.container
        );
        if (!matchedContainer) {
          throw new Error(
            "Unable to locate the supplied container ID via getElementById"
          );
        }
        this.container = matchedContainer;
      } else {
        this.container = this.options.container;
      }
      assert(this.container, "Unable to resolve the container");
    }

    // Ensure that the bind is local
    this.dispatch = this.dispatch.bind(this);
    this.addControl = this.addControl.bind(this);
    this.removeControl = this.removeControl.bind(this);
    this.setIndicatedFeature = this.setIndicatedFeature.bind(this);
    this.setSelectedFeature = this.setSelectedFeature.bind(this);
    this.getItems = this.getItems.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);

    // Initialise...
    this.init();
  }

  init() {
    if (!this.initialising) {
      this.initialising = new Promise((success) => {
        // Check the invocation
        if (this.iframe) {
          if (!this.iframe.src) {
            throw new Error("Unable to obtain the src from the iframe");
          }
          // If we have been supplied an iframe
          // Initialise messaging with the iframe

          // Build the iframe messaging
          const options = {
            url: this.iframe.src,
            callback: this.receiveMessage,
            host: (this.options as IframeAttach).host || "*",
          };
          // Initialise our messaging
          this.messaging = messaging.init(this.iframe, options);

          this.emit("init");
          success();
        } else {
          // Otherwise, use Oembed...
          const setupTarget = new Promise((resolve) => {
            if (!isOembed(this.options)) {
              throw new Error("Misinitialised iframe options");
            }

            // Update the embed options
            const attachOptions = {
              url: this.options.url,
              target: this.container,
              /* Embed options */
              height: this.options.height,
              width: this.options.width,
              viewMode: this.options.viewMode,
              baseUrl: this.options.baseUrl,
              oembedService: this.options.oembedService,
              responsive: this.options.responsive,
            };

            // Embed the element
            embed
              .attach(this.container, attachOptions)
              .then((iframe) => {
                const options = {
                  url: (this.options as OembedAttach).url,
                  callback: this.receiveMessage,
                  host: (this.options as OembedAttach).baseUrl,
                };

                this.messaging = messaging.init(iframe, options);

                // Set the target in the app
                if (!iframe.contentWindow) {
                  throw new Error(
                    "Unable to obtain the content window for the iframe after setting up using oembed"
                  );
                }

                this.target = iframe.contentWindow;
              })
              .then(resolve);
          });

          // Wait on all the elements
          setupTarget
            .then(() => this.emit("init"))
            .then(() => success())
            .catch((err) => this.emit("error", err));
        }
      });
    }

    return this.initialising;
  }

  receiveMessage(data: MessagingResponse) {
    if (data) {
      const { type, payload } = data;
      switch (type) {
        case "init":
        case "indicated":
        case "selected":
        case "state":
        case "items":
        case "loaded":
        case "error":
          this.emit(type, payload);
        default:
          break;
      }
    }
  }

  // TODO: Add a queue mechanism so that these are applied after 'load'
  dispatch(method: string, args: any[]) {
    if (this.target && this.messaging) {
      this.messaging.dispatch(this.target, { prop: method, args });
    }
  }

  setIndicatedFeature(id: string) {
    this.dispatch("setIndicatedFeature", [id]);
  }

  setSelectedFeature(id: string) {
    this.dispatch("setSelectedFeature", [id]);
  }

  setTargetViewport(target: TargetViewport, move?: TargetMove) {
    this.dispatch("setTargetViewport", [target, move]);
  }

  resetTargetViewport() {
    this.dispatch("resetTargetViewport", []);
  }

  setLocaleHotLoad(...args: any[]) {
    this.dispatch("setLocaleHotLoad", args);
  }

  setViewMode(viewMode: string) {
    this.dispatch("setViewMode", [viewMode]);
  }

  getItems() {
    if (!this.items) {
      // Await for them to arrive
      this.items = new Promise<FeatureItem[]>((success) => {
        const handler = ({ items }: { items: FeatureItem[] }) => {
          success(items || []);
        };
        this.once("items", handler);
      });
    }

    return this.items;
  }

  // Register of controls
  addControl(control: Control) {
    assert(control, "Missing a supplied control");
    assert(control.add, "Supplied control does not have add()");
    control.add(this);
  }
  removeControl(control: Control) {
    assert(control, "Missing a supplied control");
    assert(control.remove, "Supplied control does not have remove()");
    control.remove(this);
  }

  getMessaging() {
    return this.messaging;
  }
}

export default View;

export type Control = {
  add: (view: View) => void;
  remove: (view: View) => void;
};

type EventType =
  | "init"
  | "error"
  | "indicated"
  | "items"
  | "loading"
  | "loaded"
  | "selected"
  | "state";
