require('proof')(4, function (assert) {
    var signal = require('../..'), star, expected

    signal.subscribe('.bigeasy.signal.*'.split('.'), star = function (message) {
        assert(message, expected, 'star ' + message)
    })

    signal.subscribe('.bigeasy.signal.info'.split('.'), function (message) {
        assert(message, expected, 'specific ' + message)
    })

    expected = 'info'
    signal.subscribers('.bigeasy.signal.info'.split('.')).forEach(function (subscriber) {
        subscriber('info')
    })

    expected = 'debug'
    signal.subscribers('.bigeasy.signal.debug'.split('.')).forEach(function (subscriber) {
        subscriber('debug')
    })

    expected = 'info'
    signal.unsubscribe('.bigeasy.signal.*'.split('.'), star)

    expected = 'info'
    signal.subscribers('.bigeasy.signal.info'.split('.')).forEach(function (subscriber) {
        subscriber('info')
    })
})
