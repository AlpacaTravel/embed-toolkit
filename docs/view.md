# View

The View API assists you to manage and create enhanced integrations with your
website.

The initial release of the View component provides basic API interactions and
event handling in order to create seamless transitions for interactions that
occur outside of the Alpaca content window.

Underlying, the View uses the oEmbed specification to discover the best way to
display your content and automatically receives updates.

## Constructor

```javascript
// See options for what constructor options are possible
var view = new alpaca.View(options);
```

### Options

There are several options that you can use to customise the View component.

| Parameter | Description |
|-----------|-------------|
| url* | The URL that can load the Alpaca content |
| container* | The ID of the HTML element (obtainable using document.getElementById) or the element directly |
| height | Optional height parameter |
| width | Optional width parameter |
| iframe | If you already have the iframe element created. Avoids oEmbed discovery |
| viewMode | Specify either "mobile" to force mobile layout or "map" to use only the map layout |

## Exposed Actions

### setSelectedFeature(id?)

| Argument | Description |
|----------|-------------|
| id | The id of the feature to select |

### setIndicatedFeature(id?)

| Argument | Description |
|----------|-------------|
| id | The id of the feature to indicate |

### setTargetViewport(viewport, move?)

You can provide the view a temporary viewport which will animate the map to the
desired location.

```javascript
var specificLocation = {
  // Longitude and Latitude
  longitude: 123,
  latitude: 234,
  // Zoom level
  zoom: 10,
};

var boundsLocation = {
  // Bounds [[s,w], [n,e]]
  bounds: [[12, 13], []]
};

// Move the View to a specific viewport
view.setViewportTemporaryTarget(boundsLocation);
```

| Argument | Description |
|----------|-------------|
| viewport | The viewport to move the map content to |

?> Note: This does not lock the viewport.

?> Move enables more advanced animation controls and ease behaviours.

### clearTargetViewport()

Clears the target viewport

## Events

You can also register your own event listeners to events that occur within the
Alapca View component.

### on(event, handler)

On every matching event, call the supplied handler function.

| Argument | Description |
|----------|-------------|
| event | The event string, such as 'load' |
| handler | The callback function |

### once(event, handler)

Take one matching event and call the supplied handler function.

| Argument | Description |
|----------|-------------|
| event | The event string, such as 'load' |
| handler | The callback function |

### off(handler)

Remove the registered handler from receiving events

| Argument | Description |
|----------|-------------|
| handler | The callback function |

### load

Occurs when the content finishes loading

### indicatedFeature

Occurs when a feature is indicated to the user

### selectedFeature

Occurs when a feature is selected

## Interaction Controls

Alpaca provide a series of controls that are available for you to add
interactions to your page.

These controls are used to create integration points between the view and your
application, and are a proposed pattern for you to follow in developing your
own reusable components.

### addControl(control)

Adds a control element to the view.

### removeControl(control)

Removes a control element from the view.

### Scroll Action Control

The Scroll Action Control can be use to create behaviours that occur in response
to the user scrolling article content.

This is useful to setup syncing between content the user is reading, and
automatically triggering actions on the View.

```javascript
// Construct a view
var view = new alpaca.View({ ... });

// Configure the scroll behaviour
var options = {
  selectors: 'h1,h2', // Select the h1/h2 elements
  action: 'setSelectedFeature', // Call setSelectedFeature
  offsetY: 50, // The offset to apply to the scroll Y position
};
var headerScrollInteraction = new alpaca.controls.ScrollActionControl(options);

// Add the control to the view
view.addControl(headerScrollInteraction);
```

| Parameter | Overview |
|-----------|----------|
| selectors* | The selectors to obtain the HTML elements that should be attached to the action, queried using document.querySelectorAll |
| action* | The View API call (e.g. 'setIndicatedFeature') or your own function call back (e.g. (id) => console.log(id)) |
| attribute | The data attribute ID for the feature (defaults to 'data-alpaca-id') |
| offsetY | The offset to add to the current user scroll position in order (defaults: 50) |
| offsetTop | A function the takes the matched HTML Element and calculated the offset from the top of the page |
| throttle | The scroll sample rate (defaults: 50 ms) |

### Mouse Action Control

The Mouse Action control is provided to create interactions such as hovering
with the user on page elements that are outside of the main view.

```javascript
// Construct a view
var view = new alpaca.View({ ... });

// Configure the mouse behaviour
var options = {
  selectors: 'a', // Select the anchor elements for interactions
  onMouseOver: function(id, view, e) {
    // Indicate the feature to the user
    view.setIndicatedFeature(id);
  },
  onMouseOut: function(id, view, e) {
    // Clear the indication
    view.setIndicatedFeature(null);
  }
};
var mouseInteraction = new alpaca.controls.MouseActionControl(options);

// Add the control to the view
view.addControl(mouseInteraction);
```

?> The Alpaca library also supports the mouseleave and mouseenter events.

| Parameter | Overview |
|-----------|----------|
| selectors* | The selectors to obtain the HTML elements that should be attached to the action, queried using document.querySelectorAll |
| attribute | The data attribute ID for the feature (defaults to 'data-alpaca-id') |
| onMouseOver, onMouseOut, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onClick, onDblClick | Your function to perform when the event occurs, supplied ```id, view, event``` |

### Timeline Action Control

The Timeline Action control assists with the development of engagements that
are driven based on a timeline, such as based on Video.

Under the hood, the timeline control uses a resolve function to translate the
human readable keyframe titles into your place locations.

```javascript
// Construct a view
var view = new alpaca.View({ ... });

// Perform an action, like indicating the user the location
function onKeyframeEnter(keyframe, view, options) {
  view.setIndicatedFeature(keyframe.id); // ID is resolved
}

// Configure the mouse behaviour
var options = {
  keyframes: [
    { title: 'Melbourne', start: 5, onEnter: onKeyframeEnter }
  ]
};
var timeline = new alpaca.controls.TimelineActionControl(options);

// Add the control to the view
view.addControl(mouseInteraction);

// Seek a position...
timeline.seek(5);
```

| Parameter | Overview |
|-----------|----------|
| keyframes* | The collection of keyframes that are seekable |

#### Keyframe Properties

The keyframe object takes props that can assist with the seek behaviour.

```javascript
const keyframe = {
  // Resolved automatically..
  title: 'Human friendly map location',
  // Otherwise, if you want to manage ID's:
  // id: abc,
  start: 5,
  end: 10,
  onEnter: function() {
    // When becomes active
  },
  onLeave: function() {
    // If the keyframe was active, and now is not..
  }
}
```
?> You can also overload the keyframe with your own properties that are passed
back when the keyframe becomes active.

#### Seek Behaviour

The seek assists in managing which keyframes should become active, and will
optionally manage lifecycle of the keyframe once it needs to be removed.

This behaviour makes it safe to setup lifecycle around entering and exiting
keyframes, and also makes it possible to jump ahead of keyframes.

### Auto Bind Control

Using this control, HTML elements will be matched against items
in the content and assigned a "data-alpaca-id" attribute with
the matched ID.

This control can be used to automatically map the HTML document
to the content, without the need to specify the ID's manually.

```javascript
// Construct a view
var view = new alpaca.View({ ... });

// Auto bind the page to elements
view.addControl(new alpaca.controls.AutoBindControl({
  selectors: 'h1, a',
}));

// Wait for the bind to complete
view.once('bind', function() {
  // Add other controls that expect elements to be bind
});
```

| Parameter | Overview |
|-----------|----------|
| selectors* | The selectors to obtain the HTML elements that should be attached to the action, queried using document.querySelectorAll |
| resolve | Alternative resolve function that takes the element and the collection of items and returns an ID if the element matches an item (element, items, options) => id (defaults to 'best match' from element text to item item title with minimum similarity) |
| attribute | The attribute that will be populated with the ID when matched (defaults: 'data-alpaca-id') |
| exclude | Exclude method which takes an element and will return true/false on whether bind should perform (default excludes elements with an attribute already set) |
| threshold | Threshold for matching, 0 being exact match, 1 being match anything (default: 0.2) |
| tokenize | Tokenize, ignoring distance, location and threshold (default: true) |
| minMatchCharLength | Minimum characters to match against (default: 3) |
| maxPatternLength | Maximum pattern length to match against (default: 60) |
| location | Approximately where in the text the pattern is to be found (default: 0) |
| distance | Determins how close the match must be to the fuzzy location (default: 100) |

?> **Note:** This performs a fuzzy search to match your
content, which does a 'best match' model. For performance and
accuracy, you could consider implementing your own resolve
function.

```javascript
var customResolve(element, items) {
  // items: [{ id: .. title: .. tags: [..] }, ...]
  // From the element, return the item ID that best matches
}
```

?> You can also call on the AutoBindControl .evaluate() to re-evaluate elements

### Custom Controls

We encourage developers to create their own control interactions that enhance
the interaction with their content.

```
// Basic Handler
var myHandler = {
  on: function(view) {},
  off: function() {}
};
// Add to the view..
view.addControl(myHandler);

// ES6 Classes
class MyControl {
  on(view) {
    // Build your own controls to interact with the view
  }
  off() {
    // Remove the control from the View
  }
}
// Add an instance to the view..
view.addControl(new MyControl());
```

?> The above control structure encourages the reuse and exchange of controls
by establishing an agreed API. You can use any of your own preferred methods to
control interaction with the API as you chose.
