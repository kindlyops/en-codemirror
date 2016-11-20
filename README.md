# en-codemirror

A simple CodeMirror component for ember.js.

## Installation

`ember install en-codemirror`

You can use it like so:

```
  {{en-codemirror
    value=value
    onChange=(action (mut value))
    }}
```
When the content is changed, the component sends the `onChange` action with the new value. You can use that however you want.

You can also pass a `readOnly` flag that will disable the editor.

## Loading Modes

`en-codemirror` loads with the JavaScript mode as default. There's a select input at the top which the user can use to switch to a different mode.

This addon does *not* bundle the modes with itself. Instead, it lazy loads modes using CodeMirror's `autoLoadMode` function. This keeps your `vendor.js` file's size down.

## Contributing

Please report any issues or bugs you find. Feel free to send in PRs too.
