const assert = require("assert");

const Evented = require("../evented");
const resolver = require("../resolver").resolver;

const uuid = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

const createResolver = (items, options) => {
  const r = resolver(items, options);
  return (keyframe) => {
    // Extract the keyframe text to match against
    let text = keyframe.title;

    // Use the resolver
    return r(text);
  };
};

const defaultOptions = {
  keyframes: [],
  default: null,
};

class TimelineActionControl extends Evented {
  constructor(options = {}) {
    super();

    this.options = Object.assign({}, defaultOptions, options);

    // Add in keyframes
    this.keyframes = [];
    this.active = [];

    // Local binds
    this.seek = this.seek.bind(this);
    this.reset = this.reset.bind(this);
    this.addKeyframe = this.addKeyframe.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);

    // Add frames
    this.options.keyframes.forEach(this.addKeyframe);
  }

  seek(time) {
    // Determine the active keyframes
    const activeKeyframes = this.keyframes.filter(
      (keyframe) => keyframe.start <= time && time < keyframe.end
    );

    // Execute their onEnter...
    activeKeyframes
      .filter(
        (keyframe) =>
          this.active.findIndex((kf) => kf.uuid === keyframe.uuid) < 0
      )
      .forEach((keyframe) => {
        if (!keyframe.id && !this.resolver) {
          console.warn("Keyframe resolver is not ready");
        }
        const id =
          keyframe.id ||
          (this.resolver && this.resolver(keyframe, this.items, this.options));
        // Keep the id in the keyframe
        if (!keyframe.id && id) {
          keyframe.id = id;
        }
        const onEnter = keyframe.onEnter;
        if (onEnter) {
          onEnter(keyframe, this.view, this.options);
        }
      });

    // Execute their onExit
    this.active
      .filter(
        (keyframe) =>
          activeKeyframes.findIndex((kf) => kf.uuid === keyframe.uuid) < 0
      )
      .forEach((keyframe) => {
        const onLeave = keyframe.onLeave;
        if (onLeave) {
          onLeave(keyframe, this.view, this.options);
        }
      });

    // Update
    this.active = activeKeyframes;
  }

  reset() {
    this.active = [];
  }

  addKeyframe(keyframe) {
    assert(keyframe);
    assert(
      keyframe.title || keyframe.id,
      "Unable to add keyframe as it is missing an ID or title"
    );
    assert(keyframe.start >= 0, "Missing keyframe start time");

    this.keyframes.push(
      Object.assign({}, { uuid: uuid(), end: Infinity }, keyframe)
    );
  }

  add(view) {
    view.getItems().then((items) => {
      this.items = items;
      this.view = view;
      this.resolver =
        this.options.resolver || createResolver(items, this.options);
      this.emit("ready");
    });
  }

  remove() {}
}

module.exports = TimelineActionControl;
