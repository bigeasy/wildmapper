var Funnel = require('./funnel')
var slice = [].slice

function Reactor (ee, object, rescue) {
    this.ee = ee
    this.object = object
    this._wrapped = {}
    this._funnel = new Funnel(ee, function (error, event) {
        object[rescue](error, event)
    })
}

Reactor.prototype._createWrapper = function (method, once) {
    var object = this.object
    return typeof method === 'function' ? function () {
        method.apply(object, slice.call(arguments))
    } : function () {
        object[method].apply(object, slice.call(arguments))
    }
}

Reactor.prototype.addListener = function (event, method) {
    var wrapped
    if (wrapped = this._wrapped[event]) {
        this._funnel.removeListener(event, wrapped.wrapper)
    }
    if (method == null) {
        method = event
    }
    this._wrapped[event] = wrapped = {
        method: method,
        wrapper: this._createWrapper(method)
    }
    this._funnel.addListener(event, wrapped.wrapper)
    return this
}

Reactor.prototype.on = function (event, method) {
    return this.addListener(event, method)
}

Reactor.prototype.once = function (event, method) {
    var wrapped = this._wrapped[event]
    if (wrapped) {
        this._funnel.removeListener(event, wrapped.wrapper)
    }
    if (method == null) {
        method = event
    }
    var wrapper = this._createWrapper(method)
    this._wrapped[event] = wrapped = {
        method: method,
        wrapper: function () {
            delete this._wrapped[event]
            wrapper.apply(null, slice.call(arguments))
        }.bind(this)
    }
    this._funnel.once(event, wrapped.wrapper)
    return this
}

Reactor.prototype.removeListener = function (event, method) {
    if (method == null) {
        method = event
    }
    var wrapped = this._wrapped[event]
    if (wrapped && wrapped.method === method) {
        this._funnel.removeListener(event, wrapped.wrapper)
    }
    return this
}

Reactor.prototype.removeAllListeners = function (event) {
    var wrapped = this._wrapped[event]
    if (wrapped) {
        this._funnel.removeListener(event, wrapped.wrapper)
    }
    return this
}

Reactor.raise = Reactor.prototype.raise = function (error) {
    if (error) throw error
}

module.exports = Reactor
