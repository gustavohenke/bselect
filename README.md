# bselect

The select decorator component that was missing for Twitter Bootstrap.

## Usage

```javascript
// Create the component
$("select").bselect();

// Create the component without an search input
$("select").bselect({ searchInput : false });

// Update the component - make the animation slower
$("select").bselect("option", "animationDuration", 600);
```