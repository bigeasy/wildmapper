require('proof')(1, require('cadence/redux')(prove))

function prove (async, assert) {
    assert(require('../..'), 'require')
}
