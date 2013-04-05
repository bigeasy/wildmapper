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
