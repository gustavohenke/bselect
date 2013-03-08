# bselect

The select decorator component that was missing for Twitter Bootstrap.

### Features
* Bootstrap-like dropdown decorator for `<select>` elements
* Easy to use, a simple jQuery call and you're done!
* Doesn't require any Bootstrap CSS or JS to work
* Tested via [QUnit](http://qunitjs.com/)
* Support for internationalization
* __Lightweight__
 * `.js`: only 1.1 KB minified and gzipped, 10.5 KB uncompressed
 * `.css`: 1.3 KB minified and gzipped, 6.3 KB uncompressed 

## Installation
* Installation via Bower: `bower install bselect`
* Download zip/tarball - https://github.com/gustavohenke/bselect/archive/master.zip
* git clone this repo: `git clone git@github.com:gustavohenke/bselect.git`

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

## License
MIT
