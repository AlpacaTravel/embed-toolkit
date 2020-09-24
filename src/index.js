// FIXME: Remove this requirement
require("nodelist-foreach-polyfill");

const View = require("./view");
const controls = require("./controls/index");
const resolver = require("./resolver");

// Export the access
module.exports = {
  View,
  controls,
  resolver,
};
