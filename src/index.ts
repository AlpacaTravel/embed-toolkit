// FIXME: Remove this requirement
import "nodelist-foreach-polyfill";
import * as availableControls from "./controls/index";
import { resolver } from "./resolver";
import View from "./view";

export { Control } from "./view";
export { FeatureItem, TargetViewport, TargetMove } from "./types";

export default {
  View,
  resolver,
  controls: {
    ScrollActionControl: availableControls.ScrollActionControl,
    MouseActionControl: availableControls.MouseActionControl,
    AutoBindControl: availableControls.AutoBindControl,
    TimelineActionControl: availableControls.TimelineActionControl,
  },
};
