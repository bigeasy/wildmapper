var slice = [].slice

function Signal (ee, error) {
    if (!(this instanceof Signal)) return new Signal(ee, error)
    this.ee = ee
    this._wrapped = []
    this._error = error
}

Signal.prototype._createWrapper = function (event, listener, once) {
    var catcher = this._error.bind(this, event)
    var wrapped = function () {
        try {
            listener.apply(null, slice.call(arguments).concat(catcher))
        } catch (error) {
            catcher(error)
        }
    }
    return wrapped
}

Signal.prototype.addListener = function (event, listener) {
    var wrapped = this._createWrapper(event, listener)
    this._wrapped.push({ event: event, wrapped: wrapped, unwrapped: listener })
    this.ee.addListener(event, wrapped)
}

Signal.prototype.on = function (event, listener) {
    return this.addListener(event, listener)
}

Signal.prototype._removeWrapper = function (event, listener) {
    for (var array = this._wrapped, i = 0, I = array.length; i < I; i++) {
        if (array[i].event === event && array[i].wrapped === listener) {
            return array.slice(i, 1).shift().listener
        }
    }
    return null
}

Signal.prototype.removeListener = function (event, listener) {
    var listener = this._removeWrapper(event, listener)
    if (listener) {
        this.ee.removeListener(event, listener)
    }
    return this
}

Signal.prototype.removeAllListeners = function (event, listener) {
    for (var array = this._wrapped, i = 0, I = array.length; i < I; i++) {
        if (array[i].event === event) {
            array.slice(i--, 1)
        }
    }
    this.ee.removeAllListeners(event)
    return this
}

Signal.prototype.addErrorListener = function (listener) {
    this._errorListeners = listener
}

module.exports = Signal
