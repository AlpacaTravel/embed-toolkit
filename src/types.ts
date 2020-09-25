export type FeatureItem = {
  id: string;
  title?: string;
};

export type Resolver = Function;

export type WindowMessaging = {
  url: string;
  host: string;
  remove: Function;
  dispatch: Function;
};

type ViewportPosition = {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
};

type ViewportBounds = {
  bounds: number[];
};

export type TargetViewport = ViewportPosition | ViewportBounds;

export type TargetMove = {
  command: "flyTo" | "fitBounds";
  args: any[];
};
