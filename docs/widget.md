# Widget

<h2 style="font-weight:300; font-size:1.5rem; text-align: center;">
Alpaca offers a 'widget' style script tag, that can be used for basic inclusion
of assets on the webpage.
</h2>

The widget style script tag provides an alternative method of including the
Alpaca on your site. This is an alternative method to OEmbed for a 'no install'
option but gives more configuration options that the typical iframe/oembed
method.

## Minimal JavaScript

The below snippet shows the minimum requirements to place on your webpage the
Alpaca widget. This snippet will include the latest version of the
`alpaca-widget` JavaScript and load the selected journey by ID.

```javascript
<script
  data-id="journey/2181f781-95f5-11e8-a4a7-024bc0398b11"
  src="https://cdn.alpacamaps.com/scripts/alpaca-widget@v2.js"
></script>
```

### Additional Configuration

| Script Element Attribute | Description                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| data-view-mode           | The specific view mode (these are various templates alpaca can advise to customise the presentation) |
| data-inline              | Set to "true" to load the widget directly on page without an iframe                                  |
| data-container-id        | An alternative div container ID to embed within. This can be your own styled DIV                     |
| data-content-path\*      | A sub-path for content                                                                               |
| data-query-params\*      | Optional query parameters to supply the template, to refine the state of the embed                   |

- Note: The query params section is only supported for inline script tags
