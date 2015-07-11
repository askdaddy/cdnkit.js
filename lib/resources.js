/**
 * Created by seven on 15/6/30.
 *
 * 管理所有的资源列表
 */
var util = require('./util');

function Resources() {
    if (!(this instanceof Resources)) return new Resources();

    this.log = util.log;
    this._res = [];
    this.urls = [];
};

Resources.prototype.push = function (res) {
    var self = this;

    self._res.push(res);
    self.urls.push(res.url);
};
/**
 * {@link ResourceFetcher#_cdnLoaded} 下载完资源会调用此方法
 *
 * @param url
 * @param data
 */
Resources.prototype.onloaded = function (url, data) {
    var self = this;

    self.log('Resources onload...');
    for (var k in self._res) {
        var res = self._res[k];
        res.rander(url, data);
    }
};


module.exports = Resources;