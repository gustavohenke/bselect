# bselect

The select decorator component that was missing for Twitter Bootstrap.

## Demo
Access [http://gustavohenke.github.com/bselect](http://gustavohenke.github.com/bselect) to see demos.

## Developing bselect
Do you want to help developing bselect? If so, I'll be pleased if you fork this project :)

__Don't forget:__ you have to work on the __development__ branch and run every test before commiting!

## Usage

```javascript
// Create the component
$("select").bselect();

// Create the component without an search input
$("select").bselect({ searchInput : false });

// Update the component - make the animation slower
$("select").bselect("option", "animationDuration", 600);
```
