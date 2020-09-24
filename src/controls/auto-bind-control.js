const assert = require("assert");

const Evented = require("../evented");
const resolver = require("../resolver").resolver;

const createResolver = (items, options) => {
  const r = resolver(items, options);
  return (element) => {
    // Extract the element text to match against
    let text = element.textContent;
    switch (element.tagName.toLowerCase()) {
      case "img":
        text = element.alt;
        break;

      default:
        break;
    }

    // Use the resolver
    return r(text);
  };
};

const defaultFilter = (i) => i.title;

const defaultOptions = {
  selectors: null,
  attribute: "data-alpaca-id",
  filter: defaultFilter,
};

class AutoBindControl extends Evented {
  constructor(options) {
    super();

    // Setup the options
    this.options = Object.assign({}, defaultOptions, options);
    assert(
      this.options.selectors,
      "Missing the options.selectors to select items with"
    );

    // Add in the exclude as a function
    if (!this.options.exclude) {
      this.options.exclude = (element) =>
        element.hasAttribute(this.options.attribute);
    }

    // Bind the local evaluate
    this.evaluate = this.evaluate.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  evaluate(view) {
    // Obtain the points
    view.getItems().then((items) => {
      const filteredItems = items.filter(this.options.filter);
      // Query the document
      const { selectors, attribute, exclude } = this.options;
      const elements = document.querySelectorAll(selectors);
      const resolver =
        this.options.resolve || createResolver(filteredItems, this.options);
      elements.forEach((element) => {
        try {
          if (!exclude(element)) {
            const id = resolver(element, filteredItems);
            if (id) {
              element.setAttribute(attribute, id, this.options);
            }
          }
        } catch (e) {
          console.warn(e);
        }
      });
      this.emit("bind", this);
    });
  }

  add(view) {
    this.evaluate(view);
  }

  remove() {}
}

module.exports = AutoBindControl;
