# Conduit

A minimalist event library for web applications.

```javascript
var conduit = require('conduit').createConduit(),
    equal = require('assert').equal;

var source = conduit.publish('namespace.name');
conduit.subscribe('namespace.name', sink);

source(1);

function sink (number) {
  equal(number, 1, 'got a number');
}
```

## Change Log

Changes for each release.

### Version 0.0.0 &mdash;

 * Create facility to subscribe to only one event. #6.
 * Create publish and subscribe. #5.
 * Build on Travis CI. #3.
