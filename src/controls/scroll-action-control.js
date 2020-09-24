const assert = require("assert");
const throttle = require("lodash.throttle");

const defaultOffsetTop = (e) => e.getBoundingClientRect().top + window.scrollY;

const defaultOptions = {
  attribute: "data-alpaca-id",
  selectors: null,
  action: null,
  throttle: 50, // 50ms throttle
  offsetY: 50, // scroll position offset
  offsetTop: defaultOffsetTop,
};

class ScrollActionControl {
  constructor(options) {
    // Obtain the options
    this.options = Object.assign({}, defaultOptions, options);

    this.trigger = throttle(this.trigger.bind(this), this.options.throttle);

    this.stopped = false;
  }

  trigger() {
    // Ensure we have state
    if (!this.view || !this.action || this.stopped) {
      return;
    }

    // Obtain the current scroll position
    const scrollPosition =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      this.options.offsetY;

    // Set indicated features
    const features = Object.keys(this.offsets).filter(
      (i) => this.offsets[i] <= scrollPosition
    );
    if (features.length) {
      const lastFeatureId = features.slice().pop();
      if (this.id !== lastFeatureId) {
        this.id = lastFeatureId;
        this.action(lastFeatureId);
      }
    } else if (this.id !== null) {
      this.action(null);
      this.id = null;
    }
  }

  stop() {
    this.stopped = true;
  }

  start() {
    this.stopped = false;
  }

  add(view) {
    assert(view, "Missing the reference to the object to add to");
    assert(
      this.options.attribute,
      "Missing the query selector options.attribute"
    );
    assert(
      this.options.selectors,
      "Missing the query selector options.selectors"
    );
    assert(this.options.action, "Missing the action");

    // Obtain the query setup
    const { attribute, selectors, action } = this.options;

    // Hold onto the view
    this.view = view;
    this.id = null;
    this.action = null;

    // Resolve the action
    if (typeof action === "string") {
      assert(
        view[action],
        "Specified action does not exist on the view",
        action
      );
      this.action = view[action];
    } else if (typeof action === "function") {
      this.action = action;
    }
    assert(this.action, "Missing action");

    // Obtain the offsets
    const points = document.querySelectorAll(selectors);
    this.offsets = {};
    points.forEach((e) => {
      const id = e.getAttribute(attribute);
      if (id) {
        this.offsets[id] = this.options.offsetTop(e);
      }
    });

    // Bind ourselves
    window.addEventListener("scroll", this.trigger, false);
  }

  remove() {
    // Remove outselves
    window.removeEventListener("scroll", this.scroll, false);
    this.view = null;
    this.offsets = null;
    this.id = null;
    this.action = null;
  }
}

module.exports = ScrollActionControl;
