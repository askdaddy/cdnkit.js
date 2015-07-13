/**
 * Created by seven on 15/6/30.
 *
 * 管理所有的资源列表
 */
var util = require('./util');
/**
 * {@link BlobImage}的管理者
 *
 * @returns {Resources}
 * @constructor
 */
function Resources() {
    if (!(this instanceof Resources)) return new Resources();

    this.log = util.log;
    this._container = [];

    // 用于迭代
    this._current = 0;

};

Resources.prototype.push = function (res) {
    this._container.push(res);
};

// 可迭代
Resources.prototype.iterator = function () {
    this._current = 0;
};
Resources.prototype.next = function () {
    if (this._current >= this._container.length)
        throw StopIteration;
    else
        return this._container[this._current++];
};
Resources.prototype.hasNext = function () {
    return this._current < this._container.length;
};


module.exports = Resources;