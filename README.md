[![Build Status](https://travis-ci.org/bigeasy/signal.svg?branch=master)](https://travis-ci.org/bigeasy/signal) [![Coverage Status](https://coveralls.io/repos/bigeasy/signal/badge.svg?branch=master&service=github)](https://coveralls.io/github/bigeasy/signal?branch=master)

Fast in-process message conduit.

### Synopsis

Thoughts, really. Names are qualified by

```javascript
var signal = require('signal')


signal.subscribe('.bigeasy.paxos.log'.split('.'), function (level, message) {
    console.log({ level: level, message: message })
})

signal.subscribe('.bigeasy.paxos.log.error'.split('.'), function (level, message) {
    console.log({ level: level, message: message })
})

signal.subscribe('.*.*.log'.split('.'), function (level, message) {
    console.log({ level: level, message: message })
})
```

When you send a message you actually get an array of listeners and send the
message directly. This means you can call the listeners directly. There is no
wrapping, `slice`ing and `apply`ing of your arguments. They go directly to the
listener. This makes them all targets for compilation by the JIT compiler.

```javascript
var signal = require('signal')

funtion logInfo (message) {
    var subscribers = signal.subscribers('.bigeasy.paxos.log'.split('.'))

    for (var i = 0, I = subscribers.length; i < I, i++) {
        subscribers[i]('info', { key: 'value' })
    }
}
```

Signal is meant to be the least commitment for late binding. It is easy on the
subscriber, hard on the publisher. If you're not a fanatic about performance,
then you can use `emit`.

```javascript
var signal = require('signal')

funtion logInfo (message) {
    signal.subscribers('.bigeasy.paxos.log').emit('info', message)
}
```

But if you do care, for a high-volume message the performance is going to be
much better running through the loop yourself.

There are no error handling conventions as of yet. The naming convention is
based on your GitHub name and the project name.

#### `signal = require('signal')`

Signal has a single object to simplify service discovery. This means that all
your modules must use the same version of Signal.

#### `signal.subscribe(path, listener)`

Subscribe to a message with the given listener. The listener can be anything,
including an object or perhaps a connect string for a message queue. The type of
listener is publisher dependent.
