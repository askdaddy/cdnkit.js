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

    this._resources = resources;
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
    var self = this,
        res = self._resources;
    //
    //for (var i in self.resources) {
    //    self._loadFromLocal(self._loadQueue[i]);
    //}

    // 从本地的缓冲里先获取资源
    res.iterator();
    while (res.hasNext()) {
        var next = res.next();
        // 如果本地查找缓冲失败
        if (!this._loadFromLocal(next)) {
            // 去远程下载
            this._mixLoad(next);
        }
    }
};


ResourceFetcher.prototype._loadFromLocal = function (resource) {
    var self = this,
        hashKey = resource.key;

    self.log('load from local cache!');

    if (self._cache.hasItem(hashKey)) {
        var localItem = self._cache.getItem(hashKey);
        //TODO 校验缓存失效
        resource.render(localItem.dataUrl);
        return true;
    }
    return false;
};

ResourceFetcher.prototype._mixLoad = function (resource) {
    var self = this;
    // TODO p2p 下载

    // 从CDN下载
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', resource.url, true);
    xhr.onload = function (evt) {
        var arrayBuffer = new Uint8Array(xhr.response);
        var mime = xhr.getResponseHeader('Content-Type');
        mime = mime ? mime.split(';')[0] : 'image/jpeg';

        var blob = new Blob([arrayBuffer], {type: mime});
        resource.render(blob);
        self._cache.write();
    };
    xhr.onerror = function (evt) {
        self.log('load from cdn: ', evt.error);
    };
    xhr.send();

};


module.exports = ResourceFetcher;