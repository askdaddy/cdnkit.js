/**
 * Created by seven on 15/6/21.
 *
 * Image type of resource
 */
var util = require('./util');

function BlobImage(element) {
    if (!(this instanceof BlobImage)) return new BlobImage(element);

    this.log = util.log;
    this._conf = util.config;
    this.ele = element;
    this.url = this.ele.getAttribute(this._conf.kitTag);

    //一个辅助变量，快速获取渲染状态
    this.isRendered = false;
    //一个辅助变量，快速获得dataurl
    this.dataUrl = undefined;
}

BlobImage.prototype.render = function (url, data) {
    if (this.isRendered)
        return;

    if (url == this.url) {
        if (data.constructor == Blob) {
            util.blobToDataUrl(data, function (dataUrl) {
                this.log('BlobImage rander:' + url);
                this.dataUrl = dataUrl;
                this.ele.src = dataUrl;
                this.isRendered = true;
            });
        } else {
            this.dataUrl = data;
            this.ele.src = data;
            this.isRendered = true;
        }
    }
};


//BlobImage.
module.exports = BlobImage;