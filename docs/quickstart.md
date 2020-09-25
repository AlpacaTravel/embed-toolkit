# Quickstart

Alpaca offers a javascript toolkit for building rich interactions with the
alpaca client.

?> _Note:_ Alpaca can be used without coding. See [no install options](no-install).

To get started, you need to have the URL to the content you want to integrate
with.

Include the JavaScript in the `<head>` of your HTML file.

```html
<script src="https://cdn.alpacamaps.com/scripts/alpaca-toolkit@v2.js"></script>
```

Include the following code within your `<body>` of your HTML file.

```html
<div id="alpaca" style="width: 800px; height: 600px;"></div>

<script type="text/javascript">
  // Setup the embed options
  var options = {
    container: "alpaca",
    url:
      "https://embed.alpacamaps.com/b8548d2e-e27f-11e6-a4a7-024bc0398b11/embed",
  };

  // Create the content viewer
  var view = new alpaca.View(options);
</script>
```

?> Alpaca suggests that you set up the asset so that it is responsive, with a
minimum height value.
