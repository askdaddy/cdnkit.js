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
    this.key = new util.sha1().b64(this.url);//util.SHA1().b64(this.url);

    //一个辅助变量，快速获取渲染状态
    this.isRendered = false;
    //一个辅助变量，快速获得dataurl
    this.dataUrl = undefined;
}

BlobImage.prototype.render = function (data) {
    var self = this;
    if (this.isRendered)
        return;

    if (data.constructor == Blob) {
        util.blobToDataUrl(data, function (dataUrl) {

            self.dataUrl = dataUrl;
            self.ele.src = dataUrl;
            self.isRendered = true;
            self.log(this.key + ' rander:' + dataUrl);
        });
    } else {
        self.dataUrl = data;
        self.ele.src = data;
        self.isRendered = true;
        self.log(this.key + ' rander:' + dataUrl);
    }
};


//BlobImage.
module.exports = BlobImage;