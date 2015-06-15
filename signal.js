var cadence = require('cadence/redux')
var slice = [].slice

function Signal (ee, error) {
    if (!(this instanceof Signal)) return new Signal(ee, error)
    this.ee = ee
    this._wrapped = []
    this._error = error
}

// We use Cadence because of it's superior error handling logic. If the user
// provides us with an error handler that wants to panic by throwing an
// exception, we know that Cadence is not going to catch that exception, because
// our callback will be invoked outside of Cadence's try/catch stack. A naive
// implementation would swallow panics. It's hard to get right, hard to test,
// and Cadence has it all figured out, so we use Cadence.

// TODO: Go into the Cadence documentation and write about this feature.

//
Signal.prototype._createWrapper = function (event, listener, once) {
    var catcher = this._catch.bind(this, event)
    var catchable = cadence(function (async, vargs) {
        listener.apply(null, vargs.concat(async()))
    })
    var wrapper = once ? function () {
        this._removeWrapper(event, listener)
        catchable(slice.call(arguments), catcher)
    }.bind(this) : function () {
        catchable(slice.call(arguments), catcher)
    }
    return wrapper
}

Signal.prototype._catch = function (event, error) {
    if (error) this._error(error, event)
}

Signal.prototype.addListener = function (event, listener) {
    var wrapper = this._createWrapper(event, listener, false)
    this._wrapped.push({ event: event, wrapper: wrapper, listener: listener })
    this.ee.addListener(event, wrapper)
    return this
}

Signal.prototype.on = function (event, listener) {
    return this.addListener(event, listener)
}

Signal.prototype.once = function (event, listener) {
    var wrapper = this._createWrapper(event, listener, true)
    this._wrapped.push({ event: event, wrapper: wrapper, listener: listener })
    this.ee.once(event, wrapper)
    return this
}

Signal.prototype._removeWrapper = function (event, listener) {
    for (var array = this._wrapped, i = 0, I = array.length; i < I; i++) {
        if (array[i].event === event && array[i].listener === listener) {
            return array.splice(i, 1).shift().wrapper
        }
    }
    return null
}

Signal.prototype.removeListener = function (event, listener) {
    var wrapper = this._removeWrapper(event, listener)
    if (wrapper) {
        this.ee.removeListener(event, wrapper)
    }
    return this
}

Signal.prototype.removeAllListeners = function (event, listener) {
    for (var array = this._wrapped, i = 0, I = array.length; i < I; i++) {
        if (array[i].event === event) {
            array.splice(i--, 1)
            I--
        }
    }
    this.ee.removeAllListeners(event)
    return this
}

Signal.error = Signal.prototype.error = function (error) {
    if (error) throw error
}

module.exports = Signal
