import { View, controls, resolver } from "../../src/index";

test("default export", () => {
  expect(View);
  expect(controls.ScrollActionControl);
  expect(controls.AutoBindControl);
  expect(controls.MouseActionControl);
  expect(resolver);
});
