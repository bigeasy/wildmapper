# Signal Design

## Incoming

Maybe it is a function builder, like cadence, but with a helper that builds on
promises, and you have a function like `step` that gathers, but you name your
steps, etc, etc.

```
var deleteIf = signal(function (vow, file) {
  fs.stat(file, vow());

  vow(function (stat) {
  });


  vow(function (stat) {
  });
});
```

Actually, the overhead, the ugliness comes from building that one...

I like promises for control flow, but not for APIs.

Note how the Promises in JavaScript are some sort of API to promises, API first,
specification first, uh, isn't that what you call your waterfall design there?

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

```
var file, connection; 

fs.readFile(__filename, 'utf8', file = signal());
db.connect(connection = signal());
window.click(clicked = signal());

signal(clicked, file, connection, function (file, connection) {
});
signal(clicked)();

signal(file, function (step, body) {
});

fs.readFile(__filename, 'utf8', step());

step(function (file) {
});

when((fs.readFile(__filename, 'utf8', $s())), function (file) {
});
#!/usr/bin/env node

require('proof')(2, function (equal) {
  var signal = require('../..'), count = 0;

  var loaded = signal();

  fs.readFile(__filename, 'utf8', loaded());
  fs.stat(__filename, loaded());

  var click = loaded()(Error);

  loaded(function (file, stat, event) {

  });

  function list (directory, callback) {
    var readdir = signal();

    fs.readdir(__dirname, readdir());

    readdir(signal(callback), function (dirs, listing) {
      listing.filter(function (file) {
        return /\.js$/.test(file);
      }).map(function (file) {
        var file = path.join(__dirname, file), data = signal();
        fs.stat(file, data());
        fs.readFile(file, 'utf8', data());
        data()(null, file);
        return data;
      }).forEach(function (data, index, array) {
        // Confusing bit, how to get it back into a callback. Need to either
        // terminate the array, or else 
        data(function (stat, body, file) {
          dirs(null, { stat: stat, body: body, file: file });
        });
      });
      return dirs;
    });
  }
});

#!/usr/bin/env node

require('proof')(2, function (equal) {
  var signal = require('../..'), count = 0;

  var loaded = signal();

  fs.readFile(__filename, 'utf8', loaded());
  fs.stat(__filename, loaded());

  var click = loaded()(Error);

  loaded(function (file, stat, event) {

  });

  function list (directory, callback) {
    var readdir = signal();

    fs.readdir(__dirname, readdir());

    readdir(function (listing) {
      var files = listing.filter(function (file) {
        return /\.js$/.test(file);
      }).map(function (file) {
        var file = path.join(__dirname, file), data = signal();
        fs.stat(file, data());
        fs.readFile(file, 'utf8', data());
        data()(null, file);
        return data;
      })
      var list = signal([files.length])(Error);
      files.forEach(function (data, index, array) {
        // Confusing bit, how to get it back into a callback. Need to either
        // terminate the array, or else 
        data(function (stat, body, file) {
          list({ stat: stat, body: body, file: file }, index);
        });
      });
      return list;
    })(function (files) {
      callback(null, files);
    });
  }
});

function list (directory, callback) {
  var readdir = signal(callback);

  fs.readdir(__dirname, readdir());

  readdir(function (listing) {
    var files = listing.filter(function (file) {
      return /\.js$/.test(file);
    }).map(function (file) {
      var file = path.join(__dirname, file), data = signal(callback);
      fs.stat(file, data());
      fs.readFile(file, 'utf8', data());
      data(Error)(file);
      return data;
    })
    var list = signal(Error, [files.length], callback);
    files.forEach(function (data) {
      // Confusing bit, how to get it back into a callback. Need to either
      // terminate the array, or else 
      data(function (stat, body, file) {
        list({ stat: stat, body: body, file: file }, index);
      });
    });
    return list;
  })(callback);
}
```
