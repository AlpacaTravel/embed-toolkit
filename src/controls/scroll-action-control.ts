import assert from "assert";
import throttle from "lodash.throttle";

import View, { Control } from "../view";

const defaultOffsetTop = (element: HTMLElement) =>
  element.getBoundingClientRect().top + window.scrollY;

const defaultOptions: ScrollActionControlOptions = {
  attribute: "data-alpaca-id",
  selectors: undefined,
  action: undefined,
  throttle: 50, // 50ms throttle
  offsetY: 50, // scroll position offset
  offsetTop: defaultOffsetTop,
};

type ItemOffsets = {
  [id: string]: number;
};

type Action = (id: string | null) => void;

type ScrollActionControlOptions = {
  throttle?: number;
  selectors?: string;
  attribute?: string;
  action?: Action;
  offsetY?: number;
  offsetTop: Function;
};

class ScrollActionControl implements Control {
  private options: ScrollActionControlOptions;
  private stopped: boolean;
  private trigger: EventListener;
  private view?: View;
  private action?: Action;
  private id?: string;
  private offsets?: ItemOffsets;

  constructor(options: ScrollActionControlOptions) {
    // Obtain the options
    this.options = (<any>Object).assign({}, defaultOptions, options);

    this.trigger = throttle(
      this.triggerInvoke.bind(this),
      this.options.throttle
    ) as EventListener;

    this.stopped = false;
  }

  triggerInvoke(e: Event) {
    // Ensure we have state
    if (!this.view || !this.action || this.stopped || !this.offsets) {
      return;
    }

    // Obtain the current scroll position
    const scrollPosition =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      (this.options.offsetY || 0);

    // Set indicated features
    const features = Object.keys(this.offsets).filter(
      (i) => this.offsets != null && this.offsets[i] <= scrollPosition
    );
    if (features.length) {
      const lastFeatureId = features.slice().pop();
      if (this.id !== lastFeatureId && lastFeatureId) {
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

  add(view: View) {
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
    if (
      !view ||
      !this.options.attribute ||
      !this.options.selectors ||
      !this.options.action
    ) {
      return;
    }

    // Obtain the query setup
    const { attribute, selectors, action } = this.options;

    // Hold onto the view
    this.view = view;

    // Resolve the action
    if (typeof action === "string") {
      assert(view[action], "Specified action does not exist on the view");
      this.action = view[action];
    } else if (typeof action === "function") {
      this.action = action;
    }
    assert(this.action, "Missing action");

    // Obtain the offsets
    const points = document.querySelectorAll(selectors);
    this.offsets = {};
    points.forEach((e) => {
      if (attribute) {
        const id = e.getAttribute(attribute);
        if (id && this.offsets) {
          this.offsets[id] = this.options.offsetTop(e);
        }
      }
    });

    // Bind ourselves
    window.addEventListener("scroll", this.trigger, false);
  }

  remove() {
    // Remove outselves
    window.removeEventListener("scroll", this.trigger, false);
    this.view = undefined;
    this.offsets = undefined;
    this.id = undefined;
    this.action = undefined;
  }
}

export default ScrollActionControl;
