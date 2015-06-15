require('proof')(10, prove)

function prove (assert) {
    var Funnel = require('../../funnel')
    var cadence = require('cadence/redux')
    var events = require('events')
    var ee = new events.EventEmitter
    var errored
    var funnel = new Funnel(ee, function (error, event) {
        errored(error, event)
    })
    assert(funnel.ee === ee, 'constructed')

    // arity
    var slice = [].slice
    var vargs
    funnel.on('packet', cadence(function () {
        vargs = slice.call(arguments, 1)
    }))
    funnel.on('raise', raise)
    funnel.on('error', Funnel.error)

    errored = function () {
        assert(false, 'should not be called')
    }
    funnel.ee.emit('packet')
    assert(vargs, [], 'zero arguments')

    // Assert that if the user wants to throw an error, we won't catch it; we'll
    // let it unwind the stack.
    var errored = function (error) { throw error }
    try {
        funnel.ee.emit('error', new Error('panic'))
    } catch (e) {
        assert(e.message, 'panic', 'can panic')
    }

    // Assert that `Funnel.error` does nothing when called with no arguments.
    Funnel.error()

    // Assert that we catch errors.
    errored = function (error, event) {
        assert(error.message, 'risen', 'catcher error')
        assert(event, 'raise', 'catcher event')
    }
    funnel.ee.emit('raise')

    errored = function () {
        assert(false, 'should not be called')
    }
    // Assert that we can remove an error listener.
    funnel.removeListener('raise', raise)
    funnel.ee.emit('raise')

    // Assert that when we set a callback to run once that it only runs once and
    // that we remove the wrapper function from the array of wrapper functions.
    errored = function (error, event) {
        assert(event, 'raise', 'invoked once')
    }
    funnel.once('raise', raise)
    funnel.ee.emit('raise')

    assert(funnel._wrapped.length, 2, 'raise removed')
    errored = function () {
        assert(false, 'should not be called')
    }
    funnel.ee.emit('raise')

    // Assert that we can invoke multiple listeners.
    errored = function (error, event) {
        assert(event, 'raise', 'invoked many one')
    }
    funnel.on('raise', raise)
    funnel.on('raise', function () {
        assert(true, 'invoked many two')
    })
    funnel.ee.emit('raise')
    funnel.removeAllListeners('raise')

    // Assert that we can remove all listeners.
    errored = function () {
        assert(false, 'should not be called')
    }
    funnel.ee.emit('raise')
    assert(funnel._wrapped.length, 2, 'all removed')

    // Assert that we can remove a listener that is not.
    funnel.removeListener('raise', raise)

    // Assert that `EventEmitter` behaves the same way when we remove a listener
    // that is not there.
    funnel.ee.removeListener('raise', function () {})

    function raise () {
        throw new Error('risen')
    }
}
