const EventEmitter2 = require("eventemitter2").EventEmitter2;
const assert = require("assert");

const Evented = require("./evented");
let messaging = null;
if (process.env.NODE_ENV === "test") {
  messaging = require("./window/messaging");
} else {
  messaging = require("./window/channel-messaging");
}
const embed = require("./window/embed");
const config = require("./config");

const defaultOptions = {
  viewMode: "default",
  baseUrl: config.BASE_URL, // No trailing slash
  responsive: false,
};

class View extends Evented {
  constructor(options) {
    super();
    const resolvedOptions = Object.assign({}, defaultOptions, options);
    assert(resolvedOptions.container, "Requires the container");
    assert(resolvedOptions.url, "Requires the content to view");
    this.options = resolvedOptions;

    // Setup the element based on the container
    if (typeof resolvedOptions.container === "object") {
      this.container = this.options.container;
    } else if (typeof this.options.container === "string") {
      this.container = document.getElementById(this.options.container);
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

    // Set up event handling
    this.emitter = new EventEmitter2();

    // Initialise...
    this.init();
  }

  init() {
    if (!this.initialising) {
      this.initialising = new Promise((success) => {
        const setupTarget = new Promise((resolve) => {
          // Embed the element
          embed
            .attach(this.options.url, this.container, this.options)
            .then((iframe) => {
              // Initialise messaging with the iframe
              const options = {
                url: this.options.content,
                callback: this.receiveMessage,
                host: this.options.baseUrl,
              };
              this.messaging = messaging.init(iframe, options);

              // Set the target in the app
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

  receiveMessage(data) {
    if (data) {
      const { type, payload } = data;
      if (type) {
        this.emit(type, payload);
      }
    }
  }

  // TODO: Add a queue mechanism so that these are applied after 'load'
  dispatch(method, args) {
    if (this.target) {
      this.messaging.dispatch(this.target, { prop: method, args });
    }
  }

  setIndicatedFeature(...args) {
    this.dispatch("setIndicatedFeature", args);
  }

  setSelectedFeature(...args) {
    this.dispatch("setSelectedFeature", args);
  }

  setTargetViewport(...args) {
    this.dispatch("setTargetViewport", args);
  }

  resetTargetViewport(...args) {
    this.dispatch("resetTargetViewport", args);
  }

  setLocaleHotLoad(...args) {
    this.dispatch("setLocaleHotLoad", args);
  }

  setViewMode(...args) {
    this.dispatch("setViewMode", args);
  }

  getItems() {
    if (!this.items) {
      // Await for them to arrive
      this.items = new Promise((success, resolve) => {
        const handler = ({ items }) => {
          success(items || []);
        };
        this.once("items", handler);
      });
    }

    return this.items;
  }

  // Register of controls
  addControl(control) {
    assert(control, "Missing a supplied control");
    assert(control.add, "Supplied control does not have add()");
    control.add(this);
  }
  removeControl(control) {
    assert(control, "Missing a supplied control");
    assert(control.remove, "Supplied control does not have remove()");
    control.remove(this);
  }
}

module.exports = View;
