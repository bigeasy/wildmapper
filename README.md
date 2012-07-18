# Conduit [![Build Status](https://secure.travis-ci.org/bigeasy/conduit.png?branch=master)](http://travis-ci.org/bigeasy/conduit)

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

### Version 0.0.0 &mdash; Wed Jul 18 06:22:28 UTC 2012

 * Add Travis CI chicklet to `README.md`. #7.
 * Create facility to subscribe to only one event. #6.
 * Create publish and subscribe. #5.
 * Build on Travis CI. #3.
