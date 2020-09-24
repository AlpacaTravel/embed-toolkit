const JSDOM = require("jsdom").JSDOM;
const AutoBindControl = require("../../../src/controls/auto-bind-control");
const View = require("../../../src/view");

test("default export", () => {
  expect(AutoBindControl);
});

test("contructor()", () => {
  const autobind = new AutoBindControl({
    selectors: "p",
  });

  expect(autobind);
});

test("evaluate() prague", () => {
  const expectedMatches = [
    {
      id: "journeymapfeature:f4c823fb-9615-11e8-a4a7-024bc0398b11",
      text: "1. Start at the Old Town Square",
    },
    {
      id: "journeypointofinterest:601fba15-96a5-11e8-a4a7-024bc0398b11",
      text: "Astronomical Clock",
    },
    {
      id: "journeypointofinterest:d6165ea9-96a5-11e8-a4a7-024bc0398b11",
      text: "Havelské Tržiště Market",
    },
    {
      id: "journeymapfeature:7025dea5-9616-11e8-a4a7-024bc0398b11",
      text: "2. Beers and city views from the Prague Metronome",
    },
    {
      id: "journeymapfeature:b8bb2c3a-9617-11e8-a4a7-024bc0398b11",
      text: "3. Coffee and cake at Kavarna Novy Svet",
    },
    {
      id: "journeymapfeature:d1d6a8ff-969f-11e8-a4a7-024bc0398b11",
      text: "4. Look up at Strahov Library",
    },
    {
      id: "journeymapfeature:35f2a284-9616-11e8-a4a7-024bc0398b11",
      text: "5. Feel like a royal at Prague Castle",
    },
    {
      id: "journeymapfeature:5f8211be-9616-11e8-a4a7-024bc0398b11",
      text: "6. Linger at the Lennon Wall",
    },
    {
      id: "journeymapfeature:8a3e99ab-9616-11e8-a4a7-024bc0398b11",
      text: "7. Count the statues on Charles Bridge",
    },
    {
      id: "journeymapfeature:e7c52092-9616-11e8-a4a7-024bc0398b11",
      text: "8. Dinner at Kantyna",
    },
    {
      id: "journeymapfeature:356150a2-9617-11e8-a4a7-024bc0398b11",
      text: "9. Drinks at Cash Only",
    },
    {
      id: "journeypointofinterest:23b39a73-96b2-11e8-a4a7-024bc0398b11",
      text: "Hemingway Bar",
    },
  ];

  const match = `<ul>${expectedMatches.map(
    (i) => `<li id=${i.id}>${i.text}</li>`
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
  const autobind = new AutoBindControl({
    selectors: "li",
  });

  // autobind waits for the items event on view..
  autobind.evaluate(view);

  const items = require("./prague.json");

  // Emit the items on the view
  view.emit("items", { items });

  return new Promise((done) => {
    // The view receives a bind event once complete
    autobind.on("bind", () => {
      expectedMatches.forEach((i) => {
        expect(
          document.getElementById(i.id).getAttribute("data-alpaca-id")
        ).toEqual(i.id);
      });
      done();
    });
  });
});

test("evaluate()", () => {
  const match =
    "<ul>" +
    '<li id="melb">Melbourne Australia</li>' +
    '<li id="alpaca">Stop by Alpaca for lunch</li>' +
    '<li id="florida">Melbourne, USA</li>' +
    "</ul>";

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
  const autobind = new AutoBindControl({
    selectors: "li",
  });

  // autobind waits for the items event on view..
  autobind.evaluate(view);

  const melbourne = { id: "1", title: "Melbourne, Victoria, Australia" };
  const alpaca = { id: "2", title: "Alpaca Travel, Melbourne" };
  const florida = { id: "3", title: "Melbourne, Florida, USA" };

  const items = [melbourne, alpaca, florida];

  // Emit the items on the view
  view.emit("items", { items });

  return new Promise((done) => {
    // The view receives a bind event once complete
    autobind.on("bind", () => {
      expect(
        document.getElementById("melb").getAttribute("data-alpaca-id")
      ).toEqual(melbourne.id);
      expect(
        document.getElementById("alpaca").getAttribute("data-alpaca-id")
      ).toEqual(alpaca.id);
      expect(
        document.getElementById("florida").getAttribute("data-alpaca-id")
      ).toEqual(florida.id);
      done();
    });
  });
});
