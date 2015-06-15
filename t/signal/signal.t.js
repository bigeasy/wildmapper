require('proof')(10, prove)

function prove (assert) {
    var cadence = require('cadence/redux')
    var Signal = require('../..')
    var events = require('events')
    var ee = new events.EventEmitter
    var errored
    var signal = Signal(ee, function (error, event) {
        errored(error, event)
    })
    assert(signal.ee === ee, 'constructed')

    // arity
    var slice = [].slice
    var vargs
    signal.on('packet', cadence(function () {
        vargs = slice.call(arguments, 1)
    }))
    signal.on('raise', raise)
    signal.on('error', Signal.error)

    errored = function () {
        assert(false, 'should not be called')
    }
    signal.ee.emit('packet')
    assert(vargs, [], 'zero arguments')

    // Assert that if the user wants to throw an error, we won't catch it; we'll
    // let it unwind the stack.
    var errored = function (error) { throw error }
    try {
        signal.ee.emit('error', new Error('panic'))
    } catch (e) {
        assert(e.message, 'panic', 'can panic')
    }

    // Assert that `Signal.error` does nothing when called with no arguments.
    Signal.error()

    // Assert that we catch errors.
    errored = function (error, event) {
        assert(error.message, 'risen', 'catcher error')
        assert(event, 'raise', 'catcher event')
    }
    signal.ee.emit('raise')

    errored = function () {
        assert(false, 'should not be called')
    }
    // Assert that we can remove an error listener.
    signal.removeListener('raise', raise)
    signal.ee.emit('raise')

    // Assert that when we set a callback to run once that it only runs once and
    // that we remove the wrapper function from the array of wrapper functions.
    errored = function (error, event) {
        assert(event, 'raise', 'invoked once')
    }
    signal.once('raise', raise)
    signal.ee.emit('raise')

    assert(signal._wrapped.length, 2, 'raise removed')
    errored = function () {
        assert(false, 'should not be called')
    }
    signal.ee.emit('raise')

    // Assert that we can invoke multiple listeners.
    errored = function (error, event) {
        assert(event, 'raise', 'invoked many one')
    }
    signal.on('raise', raise)
    signal.on('raise', function () {
        assert(true, 'invoked many two')
    })
    signal.ee.emit('raise')
    signal.removeAllListeners('raise')

    // Assert that we can remove all listeners.
    errored = function () {
        assert(false, 'should not be called')
    }
    signal.ee.emit('raise')
    assert(signal._wrapped.length, 2, 'all removed')

    // Assert that we can remove a listener that is not.
    signal.removeListener('raise', raise)

    // Assert that `EventEmitter` behaves the same way when we remove a listener
    // that is not there.
    signal.ee.removeListener('raise', function () {})

    function raise () {
        throw new Error('risen')
    }
}
