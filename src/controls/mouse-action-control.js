const assert = require("assert");
const throttle = require("lodash.throttle");

const defaultOptions = {
  attribute: "data-alpaca-id",
  selectors: null,
};

class MouseActionControl {
  constructor(options) {
    // Obtain the options
    this.options = Object.assign({}, defaultOptions, options);

    this.trigger = this.trigger.bind(this);

    this.stopped = false;
  }

  stop() {
    this.stopped = true;
  }

  start() {
    this.stopped = false;
  }

  trigger(e) {
    const { type, target } = e;
    let action = null;
    switch (type) {
      case "click":
        action = this.options.onClick;
        break;
      case "dblclick":
        action = this.options.onDblClick;
        break;
      case "mousedown":
        action = this.options.onMouseDown;
        break;
      case "mouseup":
        action = this.options.onMouseUp;
        break;
      case "mouseenter":
        action = this.options.onMouseEnter;
        break;
      case "mouseleave":
        action = this.options.onMouseLeave;
        break;
      case "mouseover":
        action = this.options.onMouseOver;
        break;
      case "mouseout":
        action = this.options.onMouseOut;
        break;
      default:
        break;
    }
    if (typeof action === "function") {
      const { attribute } = this.options;
      const id = target.getAttribute(attribute);
      if (id) {
        action(id, this.view, e);
      }
    }
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

    // Obtain the query setup
    const { attribute, selectors } = this.options;

    // Hold onto the view
    this.view = view;

    // Obtain the offsets
    this.elements = document.querySelectorAll(selectors);
    this.elements.forEach((e) => {
      if (e.hasAttribute(attribute)) {
        e.addEventListener("mouseenter", this.trigger, false);
        e.addEventListener("mouseleave", this.trigger, false);
        e.addEventListener("mouseover", this.trigger, false);
        e.addEventListener("mouseout", this.trigger, false);
        e.addEventListener("click", this.trigger, false);
        e.addEventListener("dblclick", this.trigger, false);
      }
    });
  }

  remove() {
    const { attribute } = this.options;
    this.elements.forEach((e) => {
      if (e.hasAttribute(attribute)) {
        e.removeEventListener("mouseenter", this.trigger, false);
        e.removeEventListener("mouseleave", this.trigger, false);
        e.removeEventListener("mouseover", this.trigger, false);
        e.removeEventListener("mouseout", this.trigger, false);
        e.removeEventListener("click", this.trigger, false);
        e.removeEventListener("dblclick", this.trigger, false);
      }
    });
  }
}

module.exports = MouseActionControl;
