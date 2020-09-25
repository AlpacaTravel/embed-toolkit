// FIXME: Should this ship as part of this package?
import Fuse from "fuse.js";

import { Resolver, FeatureItem } from "./types";

const defaultOptions = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.2,
  tokenize: true,
  keys: [
    {
      name: "title",
      weight: 0.6,
    },
    {
      name: "locationKeywords",
      weight: 0.2,
    },
    {
      name: "synopsis",
      weight: 0.1,
    },
    {
      name: "tags",
      weight: 0.1,
    },
  ],
  minMatchCharLength: 3,
  maxPatternLength: 60,
  location: 0,
  distance: 100,
};

export type ResolverOptions = {
  threshold?: number;
  keys?: [{ name: string; weight: number }];
  location?: number;
  distance?: number;
  minMatchCharLength?: number;
  maxPatternLength?: number;
};

type FuseResult = {
  item: FeatureItem;
};

export const resolver = (
  items: FeatureItem[],
  options: ResolverOptions = {}
): Resolver => {
  const resolvedOptions = (<any>Object).assign({}, defaultOptions, options);
  const f = new Fuse(items, resolvedOptions);
  return (text: string) => {
    try {
      const result: FuseResult[] = f.search(text);

      // Check the result..
      if (result.length > 0) {
        const item = result[0].item;
        return item.id;
      }
    } catch (e) {}

    return null;
  };
};
