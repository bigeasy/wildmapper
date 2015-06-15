var Funnel = require('./funnel')
var slice = [].slice

function Reactor (ee, object, rescue) {
    var vargs = slice.call(arguments)
    this.ee = vargs.shift()
    this.object = vargs.shift()
    this._wrapped = {}
    this._funnel = new Funnel(ee, function (error, event) {
        object[rescue](error, event)
    })
}

Reactor.prototype._createWrapper = function (method) {
    var object = this._object
    var wrapper = typeof method === 'function' ? function () {
        method.apply(object, slice.call(arguments))
    } : function () {
        object[method].apply(object, slice.call(arguments))
    }
    return {
        method: method,
        wrapper: wrapper
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
    this._wrapped[event] = wrapped = this._createWrapper(method)
    this._funnel.addListener(event, wrapped.wrapper)
    return this
}

Reactor.prototype.on = function (event, method) {
    return this.on(event, method)
}

Reactor.prototype.once = function (event, method) {
    var wrapped = this._wrapped[event]
    if (wrapped) {
        this._funnel.removeListener(event, wrapped.wrapper)
    }
    if (method == null) {
        method = event
    }
    this._wrapped[event] = wrapped = this._createWrapper(method)
    this._funnel.once(event, wrapped.wrapper)
    return this
}

Reactor.prototype.removeListener = function (event, method) {
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
