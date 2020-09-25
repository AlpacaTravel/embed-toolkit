## Installation

Alpaca provides a number of [distributions](?id=distributions) to match your
runtime environment, such as webpack/browserify packaging.

The Alpaca client library supports popular module systems:
[ECMAScript 6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import),
CommonJS ([browserify](http://browserify.org),
[webpack](http://webpack.github.io)),
and good old-fashioned [HTML script tags](https://developer.mozilla.org/en/docs/Web/HTML/Element/script).

?> _Note:_ Alpaca can be used without coding. See [no install options](no-install).

### NPM Installation

```shell
npm install @alpaca-travel/toolkit --save
```

### Client Distributions

Along with the client package, the `dist` folder contains various distributions
to support your intended use case.

| File           | Description                       |
| -------------- | --------------------------------- |
| `index.cjs.js` | CommonJS Module (no dependencies) |
| `index.es.js`  | ECMAScript 6 (no dependencies)    |

#### CDN Hosting

| Distribution                                            | Notes                                                 |
| ------------------------------------------------------- | ----------------------------------------------------- |
| https://cdn.alpacamaps.com/scripts/alpaca-toolkit@v2.js | **Default** Version 2 Default CDN containing polyfill |

### Examples including the library

Supporting a modern ES6/Transpiler environment.

```javascript
import alpaca from "@alpaca/client";
```

Directly in the browser window, using either a polyfilled babel environment,
or if you are providing a babel polyfill in your application, you can include
the **alpaca.babel.min.js** which relies on the babel runtime.

```html
<!-- Example HTML Page -->
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="content"></div>

    <script src="https://cdn.alpacamaps.com/scripts/alpaca-toolkit@v1.babel.polyfilled.min.js"></script>
    <script type="text/javascript">
      // Setup the embed options
      var options = {
        container: "content",
        url:
          "https://embed.alpacamaps.com/b8548d2e-e27f-11e6-a4a7-024bc0398b11/embed",
      };

      // Create the content viewer
      var view = new alpaca.View(options);
    </script>
  </body>
</html>
```
