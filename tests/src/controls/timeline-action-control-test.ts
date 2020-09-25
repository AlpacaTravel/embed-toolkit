import TimelineActionControl from "../../../src/controls/timeline-action-control";
import View from "../../../src/view";

test("default export", () => {
  expect(TimelineActionControl);
});

test("evaluate()", () => {
  // Setup the container
  const text = `<div id="container"></div>`;
  document.body.innerHTML = text;

  const iframe = document.createElement("iframe");
  iframe.src = "https://embed.alpacamaps.com/example";
  document.body.appendChild(iframe);

  // Create the view
  const view = new View({
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
      { id: "1", title: "Melbourne", start: 0, end: 5, onEnter, onLeave },
      { id: "2", title: "Alpaca", start: 5, end: 10, onEnter, onLeave },
      {
        id: "3",
        title: "Great Ocean Road",
        start: 15,
        end: 20,
        onEnter,
        onLeave,
      },
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
