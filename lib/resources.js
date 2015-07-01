/**
 * Created by seven on 15/6/30.
 */
var util = require('./util');
var EventEmitter = require('eventemitter3');

function Resources() {
    if (!(this instanceof Resources)) return new Resources();
    EventEmitter.call(this);

    this._res = {};
};

util.inherits(Resources, EventEmitter);

Resources.prototype.push = function(res){
    var self = this;

    self._res[res.key()]=res;

};


module.exports = Resources;