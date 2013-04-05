# Signal Design

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
