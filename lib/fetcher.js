/**
 * Created by seven on 15/6/30.
 */

var util = require('./util');

/**
 *
 * @param {Resources} resources
 * @param {Cache} cache
 * @returns {ResourceFetcher}
 * @constructor
 */
function ResourceFetcher(resources, cache) {
    if (!(this instanceof ResourceFetcher)) return new ResourceFetcher(resources, cache);

    this.log = util.log;
    this._conf = util.config;
    this.resources = resources;
    this._cache = cache;

    this.log('ResourceFetcher instantiated.');

    // load local cached resource
    this._cache.read();

}
/**
 * 加载资源顺序
 * 1. 本地
 * 2. p2p @TODO
 * 3. CND
 */
ResourceFetcher.prototype.load = function () {
    var self = this;

    for (var i in self.resources) {
        self._loadFromLocal(self._loadQueue[i]);
    }

    for (var i in self._loadQueue) {
        self._loadFromCdn(self._loadQueue[i]);
    }
};


ResourceFetcher.prototype._loadFromLocal = function (url) {
    var self = this;
    self.log('load from local cache!');
    //TODO
    if (self._cache.hasItem(url)){
        var it = self._cache.getItem(url);
        //TODO 校验缓存失效
        self.resources.onloaded(url,it.dataUrl);
        util.removeFromArray(url,self._loadQueue);
    };
};

ResourceFetcher.prototype._loadFromCdn = function (url) {
    var self = this;

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url, true);

    xhr.onload = function (evt) {
        self.log(evt);
        var arrayBuffer = new Uint8Array(xhr.response);

        var mime = xhr.getResponseHeader('Content-Type');
        mime = mime ? mime.split(';')[0] : 'image/jpeg';

        var blob = new Blob([arrayBuffer], {type: mime});
        self.log(blob);

        self._cdnLoaded(url, blob);
    };
    xhr.onerror = function (evt) {
        self.log(evt.error, err);
    };
    xhr.send();

};

ResourceFetcher.prototype._cdnLoaded = function (url, blob) {
    var self = this;

    //self._loadedResource[url] = blob;
    self.resources.onloaded(url, blob);

};


module.exports = ResourceFetcher;