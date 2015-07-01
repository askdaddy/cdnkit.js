/**
 * Created by seven on 15/6/21.
 */
var util = require('./util');
var EventEmitter = require('eventemitter3');

var Blob = window.Blob || window.WebkitBlob;
var URL = window.URL || window.webkitURL;

function BlobImage(element) {
    if (!(this instanceof BlobImage)) return new BlobImage(element);
    EventEmitter.call(this);

    this.log = util.log;
    this._conf = util.config;
    this.ele = element;
    this.url= this.ele.getAttribute(this._conf.kitTag);
    this.blob = null;
    this.blobURL=null
    this.onload= function(){};


    this.load();
}

util.inherits(BlobImage, EventEmitter);

BlobImage.prototype.key = function(){
    return this.url;
};

BlobImage.prototype.load = function () {
    var self=this;

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'arraybuffer';
    xhr.open('GET', self.url, true);

    xhr.onload = function(evt){
        self.log(evt);
        var arrayBuffer = new Uint8Array(xhr.response);
        var mime = xhr.getResponseHeader('Content-Type');
        mime = mime ? mime.split(';')[0] : 'image/jpeg';

        self.blob = new Blob([ arrayBuffer ], { type: mime });
        self.log(self.blob);
        var url = URL.createObjectURL(self.blob);
        self.blobURL = self.ele.src = url;

        self.onload();//a hook
    };
    xhr.onerror = function(evt) {
        self.log(evt.error,err);
    };
    xhr.send();

};
BlobImage.prototype.release = function() {
    URL.revokeObjectURL(this.blobURL);
};

//BlobImage.



module.exports = BlobImage;