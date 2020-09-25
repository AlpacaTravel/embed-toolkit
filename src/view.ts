import assert from "assert";
import { Promise } from "es6-promise";

import Evented from "./evented";
import * as messaging from "./window/messaging";
import * as embed from "./window/embed";
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

const defaultOptions = {
  viewMode: "default",
  baseUrl: config.BASE_URL, // No trailing slash
  responsive: false,
};

type ViewOptions = {
  container: HTMLElement | "string";
  url: string;
  width?: number;
  height?: number;
  iframe?: HTMLIFrameElement;
  baseUrl: string;
};

type MessagingResponse = {
  type: string;
  payload: any;
};

class View extends Evented {
  private options: ViewOptions;

  private container: HTMLElement;
  private initialising?: Promise<void>;
  private messaging?: WindowMessaging;
  private target?: Window;
  private items?: Promise<FeatureItem[]>;

  constructor(options: ViewOptions) {
    super();
    const resolvedOptions = (<any>Object).assign({}, defaultOptions, options);
    assert(resolvedOptions.container, "Requires the container");
    assert(resolvedOptions.url, "Requires the content to view");
    this.options = resolvedOptions;

    // Setup the element based on the container
    if (typeof this.options.container === "string") {
      const matchedContainer = document.getElementById(this.options.container);
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
        const setupTarget = new Promise((resolve) => {
          // Update the embed options
          const attachOptions = {
            url: this.options.url,
            height: this.options.height,
            width: this.options.width,
            target: this.container,
            iframe: this.options.iframe,
          };

          // Embed the element
          embed
            .attach(this.options.url, this.container, attachOptions)
            .then((iframe) => {
              // Initialise messaging with the iframe
              const options = {
                url: this.options.url,
                callback: this.receiveMessage,
                host: this.options.baseUrl,
              };
              this.messaging = messaging.init(iframe, options);

              // Set the target in the app
              if (!iframe.contentWindow) {
                throw new Error(
                  "Unable to obtain the content window for the iframe"
                );
              }

              this.target = iframe.contentWindow;
            })
            .then(resolve);
        });

        // Wait on all the elements
        Promise.all([setupTarget])
          .then(() => this.emit("init"))
          .then(success)
          .catch((err) => this.emit("error", err));
      });
    }

    return this.initialising;
  }

  receiveMessage(data: MessagingResponse) {
    if (data) {
      const { type, payload } = data;
      if (type) {
        this.emit(type, payload);
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
}

export default View;

export interface Control {
  add: (view: View) => void;
  remove: (view: View) => void;
}
