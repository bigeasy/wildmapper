Fast in-process message conduit.

### Synopsis

Thoughts, really. Names are qualified by

```javascript
var signal = require('signal')


signal.on('.bigeasy.paxos.log', function (level, message) {
    console.log({ level: level, message: message })
})

signal.on('.bigeasy.paxos.log.error', function (level, message) {
    console.log({ level: level, message: message })
})

signal.on('.*.*.log', function (level, message) {
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
    var subscribers = signal.subscribers('bigeasy.paxos.log')

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

But if you do care, for a high-volume message the performace is going to be much
better running through the loop yourself.

There are no error handling conventions as of yet. The naming convention is
based on your GitHub name and the project name.

#### `signal = new Signal`

Create a signal object.

#### `signal.get(path)`

Get a branch for the given path
