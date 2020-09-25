import TimelineActionControl from "../../../src/controls/timeline-action-control";
import View from "../../../src/view";

test("default export", () => {
  expect(TimelineActionControl);
});

test("contructor()", () => {
  const timeline = new TimelineActionControl();

  expect(timeline);
});

test("evaluate()", () => {
  // Setup the container
  const text = `<div id="container"></div>`;
  document.body.innerHTML = text;

  const container = document.getElementById("container");
  const iframe = document.createElement("iframe");

  // Create the view
  const url = "https://embed.alpacamaps.com/example";
  const view = new View({
    url,
    container,
    iframe,
  });

  // Index..
  const melbourne = { id: "1", title: "Melbourne" };
  const alpaca = { id: "2", title: "Alpaca" };
  const gor = { id: "3", title: "Great Ocean Road" };
  const items = [melbourne, alpaca, gor];

  // Entry..
  const onEnter = jest
    .fn()
    .mockImplementationOnce((k, v, options) => {
      expect(k.id).toEqual(melbourne.id);
      expect(v).toBe(view);
    })
    .mockImplementationOnce((k, v, options) => {
      expect(k.id).toEqual(gor.id);
    });

  const onLeave = jest
    .fn()
    .mockImplementationOnce((k, v, options) => {
      expect(k.id).toEqual(melbourne.id);
    })
    .mockImplementationOnce((k, v, options) => {
      expect(k.id).toEqual(gor.id);
    });

  const timeline = new TimelineActionControl({
    keyframes: [
      { title: "Melbourne", start: 0, end: 5, onEnter, onLeave },
      { title: "Alpaca", start: 5, end: 10, onEnter, onLeave },
      { title: "Great Ocean Road", start: 15, end: 20, onEnter, onLeave },
    ],
  });

  // timeline waits for the items event on view..
  view.addControl(timeline);

  // Emit the items on the view
  view.emit("items", { items });

  return new Promise((done) => {
    // The view receives a bind event once complete
    timeline.on("ready", () => {
      timeline.seek(0);
      timeline.seek(18);
      timeline.seek(20);
      expect(onEnter.mock.calls.length).toBe(2);
      expect(onLeave.mock.calls.length).toBe(2);
      done();
    });
  });
});
