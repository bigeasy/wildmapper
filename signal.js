var WildMap = require('wildmap')

function Signal () {
    this._wildmap = new WildMap
}

Signal.prototype.subscribe = function (path, subscription) {
    this._wildmap.add(path, subscription)
}

Signal.prototype.unsubscribe = function (path, subscription) {
    this._wildmap.remove(path, subscription)
}

Signal.prototype.subscribers = function (path) {
    return this._wildmap.match(path)
}

module.exports = new Signal
