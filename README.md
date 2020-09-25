<div align="center">
  <a href="https://developer.alpacamaps.com" style="border:0">
    <img alt="Developer Documentation" src="https://developer.alpacamaps.com/_media/logo.svg" height="75" width=75 />
  </a>
</div>

# [About](https://alpaca.travel)

Alpaca Travel provides rich interactive travel media content for users.

This toolkit is provided to assist integration of your Alpaca (https://alpaca.travel)
content within your website through JavaScript that can communicate with oembed or your
iframe.

- Exposes events such as when content is indicated or selected
- Can allow you to send actions to the iframe, such as selecting features so you can build interactions outside the iframe
- Looks up the embed code using OEmbed protocol

# [Toolkit Documentation](https://developer.alpacamaps.com/)

Documentation is available for developers, including on how to use this
library, as well as the various 'no-install' options that can ensure content
is integrated immediately with your website or blog.

https://developer.alpacamaps.com/

## No-install Options

Alpaca content is supported already using standard iframe, oEmbed or embed.ly
approaches which will allow you to start using Alpaca content without install.

## NPM Install

```shell
npm install @alpaca-travel/toolkit --save
```

## Packaged Files

| File                | Description               |
| ------------------- | ------------------------- |
| `alpaca-toolkit.js` | Library for target window |
| `index.cjs.js`      | Common JS                 |
| `index.es.js`       | ES Module                 |

#### CDN Hosting

| Distribution                                            | Notes                                                 |
| ------------------------------------------------------- | ----------------------------------------------------- |
| https://cdn.alpacamaps.com/scripts/alpaca-toolkit@v2.js | **Default** Version 2 Default CDN containing polyfill |

### Examples including the library

Supporting a modern ES6/Transpiler environment.

```javascript
import alpaca from "@alpaca-travel/toolkit";
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
