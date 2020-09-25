import MouseActionControl from "../../../src/controls/mouse-action-control";
import View from "../../../src/view";

test("default export", () => {
  expect(MouseActionControl);
});

test("contructor()", () => {
  const mouseAction = new MouseActionControl({
    selectors: "li",
  });

  expect(mouseAction);
});

test("add()", () => {
  const expectedMatches = [
    {
      id: "journeymapfeature:f4c823fb-9615-11e8-a4a7-024bc0398b11",
      text: "1. Start at the Old Town Square",
    },
    {
      id: "journeypointofinterest:601fba15-96a5-11e8-a4a7-024bc0398b11",
      text: "Astronomical Clock",
    },
  ];

  const match = `<ul>${expectedMatches.map(
    (i) => `<li id="${i.id}" data-alpaca-id="${i.id}">${i.text}</li>`
  )}</ul>`;

  // Setup the container
  const text = `${match}<div id="container"></div>`;
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

  const onMouseOver = jest
    .fn()
    .mockImplementationOnce((id, view, e) => {
      expect(id).toEqual(expectedMatches[0].id);
      expect(view).toEqual(view);
      expect(e.target.id).toEqual(expectedMatches[0].id);
    })
    .mockImplementationOnce((id, view, e) => {
      expect(id).toEqual(expectedMatches[1].id);
      expect(view).toEqual(view);
      expect(e.target.id).toEqual(expectedMatches[1].id);
    });

  const mouse = new MouseActionControl({
    selectors: "li",
    onMouseOver,
  });
  view.addControl(mouse);

  // Dispatch mouse over events
  expectedMatches.forEach((e) => {
    const element = document.getElementById(e.id);
    const mouseEvent1 = new MouseEvent("mouseover");
    element.dispatchEvent(mouseEvent1);
  });

  expect(onMouseOver.mock.calls.length).toBe(2);
});
