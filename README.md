# bselect

The select decorator component that was missing for Twitter Bootstrap.

## Demo
Access [http://gustavohenke.github.com/bselect](http://gustavohenke.github.com/bselect) to see demos.

## Usage

```javascript
// Create the component
$("select").bselect();

// Create the component without an search input
$("select").bselect({ searchInput : false });

// Update the component - make the animation slower
$("select").bselect("option", "animationDuration", 600);
```