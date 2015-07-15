/**
 * Created by seven on 15/7/3.
 */

var util = require('./util');

function Cache(options) {
    if (!(this instanceof Cache)) return new Cache(options);

    options = util.extend({
        useCache: true,
        defaultExpiry: new Date().getTime() + 500000,
        storageTag: 'cdnkit_cache'
    }, options);
    this._options = options;
    this.log = util.log;

    this._localStorage = window.localStorage;
    this._ship = {};

    this.read();
}

Cache.prototype.read = function () {
    this._ship = JSON.parse(this._localStorage.getItem(this._options.storageTag)) || {};

};

Cache.prototype.write = function () {
    try {
        this._localStorage.setItem(this._options.storageTag, JSON.stringify(this._ship));
    }
    catch (e) {
        this.log("Cache write to localStorage failed:", e);
    }
};

Cache.prototype.hasItem = function (hashKey) {
    return this._ship.hasOwnProperty(hashKey);
};

Cache.prototype.getItem = function (hashKey) {
    var self = this;

    if (self.hasItem(hashKey)) {
        self.log("local HIT: " + hashKey);
        return self._ship[hashKey];
    }
    self.log("local MISS: " + hashKey);
    return undefined;
};

Cache.prototype.setItem = function (hashKey, dataUrl, options) {
    var cacheObj = {};
    if (this.hasItem(hashKey)) {
        // 覆盖
        cacheObj = this._cache[hashKey];
        cacheObj.co = dataUrl;
    }
    else {
        // 创建
        cacheObj = {
            co: dataUrl,// content
            ex: undefined,// expires: TODO
            lm: util.now(),//last-modified: TODO
            cc: undefined,//cahe-control: TODO
            da: util.now()//date
        };
    }

    cacheObj = util.extend(cacheObj, options);

    this._ship[hashKey] = cacheObj;
    this.log("Cached in: " + hashKey);

}


module.exports = Cache;