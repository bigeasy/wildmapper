! function (definition) {
  if (typeof module == "object" && module.exports) module.exports = definition();
  else if (typeof define == "function") define(definition);
  else this.signal = definition();
} (function () {
  var __slice = [].slice, published = {}, subscriptions = {}, samples = {};

  function Signal () {
    function publish (path) {
      var source = published[path];
      if (!source) {
        source = function () {
          var subscribers = subscriptions[path],
              once = samples[path] || [],
              i, I;
          for (i = 0, I = subscribers.length; i < I; i++) 
            subscribers[i].apply(this, arguments);
          for (i = once.length - 1; i != -1; i--)
            subscribers.splice(once[1], 1);
        }
        published[path] = source;
        source.path = path;
        source.count = 0;
      }
      source.count++;
      return source;
    }

    function subscribe (path, sink) {
      if (!subscriptions[path]) subscriptions[path] = [];
      subscriptions[path].push(sink);
    }

    function sample (path, sink) {
      if (!samples[path]) samples[path] = [];
      subscribe(path, sink);
      samples[path].push(subscriptions.length - 1);
    }

    this.publish = publish;
    this.subscribe = subscribe;
    this.sample = sample;
  }

  function signal () {
    var callbacks = [], called = 0, latch, action;

    function callback () {
      var vargs = __slice.call(arguments);
      if (vargs.length) {
        action = vargs.shift();
        latch();
      } else {
        var callback = {}, parameters = [];
        callbacks.push(callback);
        return function () {
          var vargs = __slice.call(arguments);
          if (vargs[0]) {
            throw new Error();
          } else {
            callback.vargs = vargs; 
          }
          if (++called == callbacks.length) {
            callbacks.forEach(function (callback) {
              parameters.push.apply(parameters, callback.vargs.slice(1));
            });
            action.apply(null, parameters);
          }
        }
      }
    }

    latch = callback();

    return callback;
  }

  signal.createSignal = function () { return new Signal() };

  return signal;
});
