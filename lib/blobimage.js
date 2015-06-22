/**
 * Created by seven on 15/6/21.
 */
var EventEmitter = require('eventemitter3');

var Blob = window.Blob || window.WebkitBlob;
var URL = window.URL || window.webkitURL;

function BlobImage(src) {
    if (!(this instanceof BlobImage)) return new BlobImage(src);
    EventEmitter.call(this);


    this.load();
}


BlobImage.prototype.load = function () {

};

module.exports = BlobImage;