import nock from "nock";
import { JSDOM } from "jsdom";
import View from "../../src/view";

test("default export", () => {
  expect(typeof View).toBe("function");
});

const mock = () => {
  nock("https://embed.alpacamaps.com:443", { encodedQueryParams: true })
    .get("/oembed")
    .query({
      url: "https%3A%2F%2Fembed.alpacamaps.com%2Fexample",
      baseUrl: "https%3A%2F%2Fembed.alpacamaps.com",
    })
    .reply(
      200,
      { html: '<iframe src="https://embed.alpacamaps.com/example" />' },
      [
        "Access-Control-Allow-Origin",
        "*",
        "Content-Type",
        "application/json; charset=utf-8",
      ]
    );

  // Setup the container
  const text =
    '<!doctype html><html><body><div id="container"></div></body></html>';
  const jsdom = new JSDOM(text, {
    url: "http://localhost",
  });
  const { window } = jsdom;
  const doc = window.document;
  const container = doc.getElementById("container");

  // Create the view
  const url = "https://embed.alpacamaps.com/example";
  const view = new View({
    url,
    container,
  });
  return view;
};

test("Instantiates object correctly", () => {
  const view = mock();

  expect(view);
  expect(typeof view).toBe("object");

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

    view.receiveMessage({ type: "state", payload: { foo: "bar" } });
    expect(emit.mock.calls.length).toBe(1);
    done();
  });
});

test("dispatch()", () => {
  const view = mock();

  return new Promise((done) => {
    view.init().then(() => {
      const dispatch = jest.fn().mockImplementation((...args) => {
        expect(args[1]).toEqual({ prop: "state", args: ["bar"] });
      });
      view.getMessaging().dispatch = dispatch.bind(view);

      view.dispatch("state", ["bar"]);
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
          args: ["1"],
        });
      });
      view.getMessaging().dispatch = dispatch.bind(view);

      view.setIndicatedFeature("1");
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
          args: ["1"],
        });
      });
      view.getMessaging().dispatch = dispatch.bind(view);

      view.setSelectedFeature("1");
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
    remove: mocked,
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
    add: mocked,
    remove: mocked,
  };

  view.removeControl(control);
  expect(mocked.mock.calls.length).toBe(1);
});
