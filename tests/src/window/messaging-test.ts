import * as messaging from "../../../src/window/messaging";
import { window } from "./window";

test("default export", () => {
  expect(messaging);
  expect(typeof messaging.init).toBe("function");
});

test("register()", () => {
  const url = "https://embed.alpacamaps.com/example";
  const host = "*";

  const sendData = { foo: "bar" };
  const receiveData = { bar: "foo" };
  const message = {
    origin: host,
    data: receiveData,
  };

  const callback = jest.fn().mockImplementation((data) => {
    expect(data).toEqual(receiveData);
  });

  const targetPostMessage = jest.fn().mockImplementation((data, h) => {
    expect(h).toEqual(host);
    expect(data).toEqual(sendData);
  });

  jest.mock("./window", () => ({
    window: {
      postMessage: targetPostMessage,
    },
  }));

  const m = messaging.init(null, { url, callback, host });

  expect(m.url).toEqual(url);
  expect(m.host).toEqual(host);
  expect(typeof m.remove).toEqual("function");
  expect(typeof m.dispatch).toEqual("function");

  m.dispatch(window, sendData);
  // const event = new Event('message', message);
  // window.dispatchEvent(event);
  m.remove();

  // expect(callback.mock.calls.length).toBe(1);
  expect(targetPostMessage.mock.calls.length).toBe(1);
});
