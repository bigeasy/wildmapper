#!/usr/bin/env node

require('proof')(1, function (step, ok) {
  var signal = require('../..'), fs = require('fs'), callback = step();

  var read = signal();

  fs.readFile(__filename, 'utf8', read());

  read(function (body) {
    ok(/signal/.test(body), 'read body');
    callback();
  });
});
