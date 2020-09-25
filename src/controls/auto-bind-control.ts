import assert from "assert";

import { FeatureItem, Resolver } from "../types";
import Evented from "../evented";
import { resolver, ResolverOptions } from "../resolver";
import View, { Control } from "../view";

const createResolver = (
  items: FeatureItem[],
  options?: ResolverOptions
): Resolver => {
  const r = resolver(items, options);
  return (element: HTMLElement | HTMLImageElement) => {
    // Extract the element text to match against
    let text = element.textContent;
    switch (element.tagName.toLowerCase()) {
      case "img":
        text = element.getAttribute("alt");
        break;

      default:
        break;
    }

    // Use the resolver
    return r(text);
  };
};

const defaultFilter: FeatureItemFilter = (i: FeatureItem) =>
  typeof i.title === "string";

type FeatureItemFilter = (item: FeatureItem, index?: number) => boolean;
type ExcludeFunction = (element: Element) => boolean;

type AutoBindControlOptions = {
  selectors?: string;
  attribute?: string;
  filter?: FeatureItemFilter;
  exclude?: ExcludeFunction;
  resolve?: Function;
  defaultResolverOptions?: ResolverOptions;
};

const defaultOptions: AutoBindControlOptions = {
  selectors: undefined,
  attribute: "data-alpaca-id",
  filter: defaultFilter,
};

class AutoBindControl extends Evented implements Control {
  private options: AutoBindControlOptions;

  constructor(options: AutoBindControlOptions = {}) {
    super();

    // Setup the options
    this.options = (<any>Object).assign({}, defaultOptions, options);
    assert(
      this.options.selectors,
      "Missing the options.selectors to select items with"
    );

    // Add in the exclude as a function
    if (!this.options.exclude) {
      this.options.exclude = (element: Element) => {
        if (!this.options.attribute) {
          return true;
        }
        if (element.hasAttribute(this.options.attribute)) {
          return false;
        }
        return true;
      };
    }

    // Bind the local evaluate
    this.evaluate = this.evaluate.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  evaluate(view: View) {
    // Obtain the points
    view.getItems().then((items) => {
      const filteredItems =
        (this.options.filter && items.filter(this.options.filter)) || items;
      // Query the document
      const { selectors, attribute, exclude } = this.options;
      if (!exclude || !selectors) {
        return;
      }
      const elements = document.querySelectorAll(selectors);
      const resolver =
        this.options.resolve ||
        createResolver(filteredItems, this.options.defaultResolverOptions);
      console.log(resolver);
      elements.forEach((element) => {
        try {
          if (!exclude(element)) {
            const id = resolver(element, filteredItems);
            console.log(id);
            if (id) {
              if (attribute) {
                element.setAttribute(attribute, id);
              } else {
                console.warn("No attribute specified");
              }
            }
          }
        } catch (e) {
          console.warn(e);
        }
      });
      this.emit("bind", this);
    });
  }

  add(view: View) {
    this.evaluate(view);
  }

  remove() {}
}

export default AutoBindControl;
