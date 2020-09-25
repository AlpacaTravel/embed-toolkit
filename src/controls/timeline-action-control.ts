import assert from "assert";

import Evented from "../evented";
import { resolver, ResolverOptions } from "../resolver";
import { FeatureItem, Resolver } from "../types";
import View, { Control } from "../view";

const uuid = (): string =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

const createResolver = (items: FeatureItem[], options?: ResolverOptions) => {
  const r = resolver(items, options);
  return (keyframe: Keyframe): KeyframeResolver => {
    // Extract the keyframe text to match against
    let text = keyframe.title;

    // Use the resolver
    return r(text);
  };
};

type KeyframeResolver = (keyframe: KeyframeResolver) => string | null;

const defaultOptions = {
  keyframes: [],
};

type ReferenceableKeyframe = Keyframe & {
  uuid: string;
  end: number;
};

type Keyframe = {
  id: string;
  title: string;
  start: number;
  end?: number;
  onEnter: Function;
  onLeave: Function;
};

type TimelineActionControlOptions = {
  keyframes: Keyframe[];
  resolver?: KeyframeResolver;
  defaultResolverOptions?: ResolverOptions;
};

class TimelineActionControl extends Evented implements Control {
  private options: TimelineActionControlOptions;
  private keyframes: ReferenceableKeyframe[];
  private active: ReferenceableKeyframe[];
  private resolver: Resolver | null = null;
  private view: View | null = null;
  private items: FeatureItem[] | null = null;

  constructor(options: TimelineActionControlOptions) {
    super();

    this.options = (<any>Object).assign({}, defaultOptions, options);

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

  seek(time: number) {
    // Determine the active keyframes
    const activeKeyframes = this.keyframes.filter(
      (keyframe: ReferenceableKeyframe) =>
        keyframe.start <= time && time < keyframe.end
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

  addKeyframe(keyframe: Keyframe) {
    assert(keyframe);
    assert(
      keyframe.title || keyframe.id,
      "Unable to add keyframe as it is missing an ID or title"
    );
    assert(keyframe.start >= 0, "Missing keyframe start time");

    this.keyframes.push(
      (<any>Object).assign({}, { uuid: uuid(), end: Infinity }, keyframe)
    );
  }

  add(view: View) {
    view.getItems().then((items: FeatureItem[]) => {
      this.items = items;
      this.view = view;
      this.resolver =
        this.options.resolver ||
        createResolver(items, this.options.defaultResolverOptions);
      this.emit("ready");
    });
  }

  remove() {
    this.items = null;
    this.view = null;
    this.resolver = null;
  }
}

export default TimelineActionControl;
