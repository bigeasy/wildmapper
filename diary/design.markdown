# Signal Design

## Message Bus

Not sure if Signal includes a message bus. There is a notion that I'm trying to
capture, that I've yet to capture, of wiring push to pull, which is a message
bus. When I have a message bus, Signal seems less like a misnomer.

Which is in part funneling, wait until everything is ready, that is a part of
it, but do this time and again. We do want wiring that declarative, this does
that, that does this, and so on, etc. That probably doesn't belong here.

This is probably going to be internal promises.

## Arrays

What if, when values gathered in an array,  we await on all elements in the
array? What if we reiterate?

```
var data = signal(function (body, stat, path) {
  return { body: body, stat: stat, path: path };
}, callback);

var data = signal('body', 'stat', 'path');

fs.readFile(__filename, 'utf8', data());
fs.stat(__filename, data());
data(null, __filename);

data(function (record) {
});
```
