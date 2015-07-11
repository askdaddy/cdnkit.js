/**
 * Created by seven on 15/6/21.
 */
var util = require('./util');
var BlobImage = require('./blobimage');
var Resources = require('./resources');
var ResourceFetcher = require('./fetcher');
var Cache = require('./cache');

function DomActor(options) {
    if (!(this instanceof DomActor)) return new DomActor(options);

    this._conf = util.config;
    this.log=util.log;
    this._cache = new Cache();
    this._resources = new Resources();
    this._fetcher = new ResourceFetcher(this._resources,this._cache);

    options = util.extend({
        types: ['img[' + this._conf.kitTag + ']']
    }, options);

    this._options = options;
}

DomActor.prototype.init = function () {
    var self = this,
        els = document.querySelectorAll(this._options.types.join(','));

    for (var i = 0; i < els.length; ++i) {
        var el = els[i];
        var res = new DomActor.handler[el.tagName](el);
        self._resources.push(res);
    }

    self.log('fetch resources!');
    this._fetcher.load();
};


DomActor.handler= {
    'IMG' : BlobImage
};


module.exports = DomActor;