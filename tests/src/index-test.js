const alpaca = require("../../src/index");

test("default export", () => {
  expect(typeof alpaca).toBe("object");
  expect(alpaca.View);
  expect(alpaca.controls.ScrollActionControl);
  expect(alpaca.controls.AutoBindControl);
  expect(alpaca.controls.MouseActionControl);
});
