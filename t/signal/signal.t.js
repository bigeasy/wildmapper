require('proof')(1, prove)

function prove (assert) {
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
    signal.on('packet', function () {
        vargs = slice.call(arguments)
    })
    signal.ee.emit('packet')
    assert(vargs, [], 'zero arguments')
}
