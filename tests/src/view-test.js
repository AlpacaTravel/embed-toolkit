import nock from "nock";
import { JSDOM } from "jsdom";
import View from "../../src/view";

test("default export", () => {
  expect(typeof View).toBe("function");
});

const mock = () => {
  // Setup the container
  const text =
    '<!doctype html><html><body><div id="container"></div></body></html>';
  const jsdom = new JSDOM(text, {
    url: "http://localhost",
  });
  const { window } = jsdom;
  const doc = window.document;
  const container = doc.getElementById("container");
  const iframe = doc.createElement("iframe");

  // Create the view
  const url = "https://embed.alpacamaps.com/example";
  const view = new View({
    url,
    container,
    iframe,
  });
  return view;
};

test("Instantiates object correctly", () => {
  const view = mock();

  expect(view);
  expect(typeof view).toBe("object");

  // Internals
  expect(typeof view.container).toBe("object");
  // expect(typeof view.messaging).toBe('object');
  expect(typeof view.emitter).toBe("object");

  // Test the contract requirements
  expect(typeof view.setIndicatedFeature).toBe("function");
  expect(typeof view.setSelectedFeature).toBe("function");
  expect(typeof view.getItems).toBe("function");
  expect(typeof view.addControl).toBe("function");
  expect(typeof view.removeControl).toBe("function");
  expect(typeof view.on).toBe("function");
  expect(typeof view.off).toBe("function");
  expect(typeof view.once).toBe("function");
  expect(typeof view.emit).toBe("function");
  expect(typeof view.init).toBe("function");

  return new Promise((done) => {
    view.init().then(() => {
      expect(typeof view.target).toBe("object");
      return done();
    });
  });
});

test("receiveMessage()", () => {
  const view = mock();

  return new Promise((done) => {
    const emit = jest.fn().mockImplementation((...args) => {
      expect(args);
    });
    view.emit = emit.bind(view);

    view.receiveMessage({ type: "test", payload: { foo: "bar" } });
    expect(emit.mock.calls.length).toBe(1);
    done();
  });
});

test("dispatch()", () => {
  const view = mock();

  return new Promise((done) => {
    view.init().then(() => {
      expect(view.messaging);

      const dispatch = jest.fn().mockImplementation((...args) => {
        expect(args[0]).toEqual(view.target);
        expect(args[1]).toEqual({ prop: "foo", args: "bar" });
      });
      view.messaging.dispatch = dispatch.bind(view);

      view.dispatch("foo", "bar");
      expect(dispatch.mock.calls.length).toBe(1);
      done();
    });
  });
});

test("setIndicatedFeature()", () => {
  const view = mock();

  return new Promise((done) => {
    view.init().then(() => {
      const dispatch = jest.fn().mockImplementation((...args) => {
        expect(args[1]).toEqual({
          prop: "setIndicatedFeature",
          args: [1],
        });
      });
      view.messaging.dispatch = dispatch.bind(view);

      view.setIndicatedFeature(1);
      expect(dispatch.mock.calls.length).toBe(1);
      done();
    });
  });
});

test("setSelectedFeature()", () => {
  const view = mock();

  return new Promise((done) => {
    view.init().then(() => {
      const dispatch = jest.fn().mockImplementation((...args) => {
        expect(args[1]).toEqual({
          prop: "setSelectedFeature",
          args: [1],
        });
      });
      view.messaging.dispatch = dispatch.bind(view);

      view.setSelectedFeature(1);
      expect(dispatch.mock.calls.length).toBe(1);
      done();
    });
  });
});

test("getItems()", () => {
  const view = mock();

  return new Promise((done) => {
    const items = [{ foo: "bar" }];
    view.getItems().then((result) => {
      expect(result).toEqual(items);
      done();
    });

    view.emit("items", { items });
  });
});

test("addControl()", () => {
  const view = mock();

  const mocked = jest.fn().mockImplementation((v) => {
    expect(v).toBe(view);
  });
  const control = {
    add: mocked,
  };

  view.addControl(control);
  expect(mocked.mock.calls.length).toBe(1);
});

test("removeControl()", () => {
  const view = mock();

  const mocked = jest.fn().mockImplementation((v) => {
    expect(v).toBe(view);
  });
  const control = {
    remove: mocked,
  };

  view.removeControl(control);
  expect(mocked.mock.calls.length).toBe(1);
});
