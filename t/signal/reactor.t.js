require('proof')(7, prove)

function prove (assert) {
    var Reactor = require('../../reactor')
    var cadence = require('cadence/redux')

    function Service (ee) {
        this.packets = []
        this.reactor = new Reactor(ee, this, 'error')
                               .on('connect')
                               .on('packet')
                               .on('error', Reactor.raise)
    }

    Service.prototype.connect = cadence(function (async) {
        this.connected = true
    })

    Service.prototype.packet = cadence(function (async, packet) {
        this.packets.push(packet)
    })

    Service.prototype.error = function (error, event) {
        this.caught = { error: error, event: event }
    }

    var events = require('events')
    var object = {}
    var reactor = new Reactor(new events.EventEmitter, object, 'error')

    object.packet = function (packet, callback) {
        assert(packet, {}, 'method called')
        callback()
    }
    reactor.on('packet')
    reactor.ee.emit('packet', {})

    reactor.on('error', Reactor.raise)
    object.error = function (error, event) {
        assert(error.message, 'emitted', 'funneled error')
        assert(event, 'error', 'funneled event')
    }
    reactor.ee.emit('error', new Error('emitted'))

    delete object.packet
    reactor.on('packet', 'reassign')
    object.reassign = function (packet, callback) {
        assert(packet, {}, 'method reassigned')
        callback()
    }
    reactor.ee.emit('packet', {})

    delete object.reassign
    reactor.once('packet')
    object.packet = function (packet, callback) {
        assert(packet, {}, 'method once')
        callback()
    }
    reactor.ee.emit('packet', {})
    delete object.packet
    reactor.ee.emit('packet', {})

    reactor.once('packet', function (packet) {
        assert(packet, {}, 'once assigned')
    })
    reactor.ee.emit('packet', {})

    // Test assigning a once handler when there is none there.
    reactor.once('packet')
    object.packet = function (packet, callback) {
        assert(packet, {}, 'method once again')
        callback()
    }
    reactor.ee.emit('packet', {})

    object.packet = function () {
        assert(false, 'should not be called')
    }
    reactor.once('packet')

    // Test removing when the method does not match.
    reactor.removeListener('packet', 'named')

    // Test removing a specific listener.
    reactor.removeListener('packet')
    reactor.ee.emit('packet', {})

    // Test remove all listeners when the listener does not exist.
    reactor.removeAllListeners('connect')

    // Test removing all isteners.
    reactor.once('packet')
    reactor.removeAllListeners('packet')
    reactor.ee.emit('packet', {})

    Reactor.raise()
}
