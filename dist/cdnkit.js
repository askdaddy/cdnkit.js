/*! cdnkit.js build:1.0.0, development. Copyright(c) 2015 Seven Chen <humen1@gmail.com> */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by seven on 15/6/21.
 */

module.exports.RTCSessionDescription = window.RTCSessionDescription ||
    window.mozRTCSessionDescription;
module.exports.RTCPeerConnection = window.RTCPeerConnection ||
    window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
module.exports.RTCIceCandidate = window.RTCIceCandidate ||
    window.mozRTCIceCandidate;

//module.exports.getUserMedia = navigator.getUserMedia || (navigator.getUserMedia = navigator.mozGetUserMedia ||  navigator.webkitGetUserMedia || navigator.msGetUserMedia);
},{}],2:[function(require,module,exports){
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
},{"./util":8,"eventemitter3":9}],3:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./util":8,"dup":2,"eventemitter3":9}],4:[function(require,module,exports){
/**
 * Created by seven on 15/6/21.
 */
var util = require('./util');
var EventEmitter = require('eventemitter3');
var DomActor = require('./dom');

function CdnKit(options) {
    if (!(this instanceof CdnKit)) return new CdnKit(options);

    EventEmitter.call(this);

    var self = this;
    this._conf = util.config;


    if (!util.isSupportedBrowser()) {
        document.addEventListener('DOMContentLoaded', function () {
            util.log("Unsupported browser");
            var els = document.querySelectorAll('[' + this._conf.kitTag + ']');
            for (var i = 0; i < els.length; i = i + 1) {
                var el = els[i];
                el.src = el.getAttribute(this._conf.kitTag);
            }
        }, false);
        util.setZeroTimeout(function () {
            self.emit('error', new Error('Browser not supported'));
        });
        return;
    }

    options = util.extend({
        debug: true,
        //host: 'localhost',
        //port: 8080,
        useCache: true,
        instrument: false,
        numConns: 1,
        fetcherTimeout: 2500,
        initCacheTimeout: 2500,
        defaultExpiry: new Date().getTime() + 500000
    }, options);
    this._options = options;
    util.debug = this._options.debug;

    // Make sure to fire if DOM already loaded
    document.addEventListener('DOMContentLoaded', function () {
        self._init();
    }, false);
}

util.inherits(CdnKit, EventEmitter);

CdnKit.prototype._init = function () {
    this._dom = new DomActor({});

    this._dom.init();
};

module.exports = CdnKit;
},{"./dom":5,"./util":8,"eventemitter3":9}],5:[function(require,module,exports){
/**
 * Created by seven on 15/6/21.
 */
var util = require('./util');
var EventEmitter = require('eventemitter3');
var BlobImage = require('./blobimage');
var Resources = require('./resources');

function DomActor(options) {
    if (!(this instanceof DomActor)) return new DomActor(options);
    EventEmitter.call(this);

    var self = this;
    this._conf = util.config;
    this._resources = new Resources();

    options = util.extend({
        types: ['img[' + this._conf.kitTag + ']']
    }, options);

    this._options = options;
}

util.inherits(DomActor, EventEmitter);

DomActor.prototype.init = function () {
    var self = this,
        els = document.querySelectorAll(this._options.types.join(','))

        //dlList = [];

    for (var i = 0; i < els.length; ++i) {
        var el = els[i];
        var res = new DomActor.handler[el.tagName](el);
        self._resources.push(res);
        //url = el.getAttribute(this._conf.kitTag);
        //el.src = url;
    }
};


DomActor.handler= {
    'IMG' : BlobImage
};





module.exports = DomActor;
},{"./blobimage":3,"./resources":7,"./util":8,"eventemitter3":9}],6:[function(require,module,exports){
/**
 * Created by seven on 15/6/21.
 */

window.RTCPeerConnection = require('./adapter').RTCPeerConnection;
window.RTCSessionDescription = require('./adapter').RTCSessionDescription;
window.RTCIceCandidate = require('./adapter').RTCIceCandidate;

window.DomActor = require('./dom');
window.CdnKit = require('./cdnkit');
window.util = require('./util');

window.Resources = require('./resources');
window.BlobImage = require('./blobImage');

},{"./adapter":1,"./blobImage":2,"./cdnkit":4,"./dom":5,"./resources":7,"./util":8}],7:[function(require,module,exports){
/**
 * Created by seven on 15/6/30.
 */
var util = require('./util');
var EventEmitter = require('eventemitter3');

function Resources() {
    if (!(this instanceof Resources)) return new Resources();
    EventEmitter.call(this);

    this._res = {};
};

util.inherits(Resources, EventEmitter);

Resources.prototype.push = function(res){
    var self = this;

    self._res[res.key()]=res;

};


module.exports = Resources;
},{"./util":8,"eventemitter3":9}],8:[function(require,module,exports){
/**
 * Created by seven on 15/6/21.
 */
var defaultConfig = {
    'kitTag': "data-cdnkit-src",
    'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]
};

var util = {
    config: defaultConfig,
    debug: false,
    logLevel: 0,
    setLogLevel: function (level) {
        var debugLevel = parseInt(level, 10);
        if (!isNaN(parseInt(level, 10))) {
            util.logLevel = debugLevel;
        } else {
            // If they are using truthy/falsy values for debug
            util.logLevel = level ? 3 : 0;
        }
        util.log = util.warn = util.error = util.noop;
        if (util.logLevel > 0) {
            util.error = util._printWith('ERROR');
        }
        if (util.logLevel > 1) {
            util.warn = util._printWith('WARNING');
        }
        if (util.logLevel > 2) {
            util.log = util._print;
        }
    },
    // Returns the current browser.
    browser: (function () {
        if (window.mozRTCPeerConnection) {
            return 'Firefox';
        } else if (window.webkitRTCPeerConnection) {
            return 'Chrome';
        } else if (window.RTCPeerConnection) {
            return 'Supported';
        } else {
            return 'Unsupported';
        }
    })(),

    inherits: function (ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    },
    extend: function (dest, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                dest[key] = source[key];
            }
        }
        return dest;
    },
    log: function () {
        if (util.debug) {
            var err = false;
            var copy = Array.prototype.slice.call(arguments);
            copy.unshift('CDNKit: ');
            for (var i = 0, l = copy.length; i < l; i++) {
                if (copy[i] instanceof Error) {
                    copy[i] = '(' + copy[i].name + ') ' + copy[i].message;
                    err = true;
                }
            }
            err ? console.error.apply(console, copy) : console.log.apply(console, copy);
        }
    },


    isSecure: function () {
        return location.protocol === 'https:';
    },
    isSupportedBrowser: function () {
        var N = navigator.appName, ua = navigator.userAgent, tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        var versions = M[1].split('.');
        var browserInfo = {name: M[0], versions: versions};
        if (browserInfo.name === 'Chrome') {
            var majorVersion = parseInt(browserInfo.versions[0], 10);
            if (majorVersion > 26) {
                return true;
            } else if ((majorVersion === 26) && (parseInt(browserInfo.versions[2], 10) > 1403)) {
                return true;
            } else {
                return false;
            }

        } else {
            return false;
        }
    }
};

module.exports = util;
},{}],9:[function(require,module,exports){
'use strict';

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} once Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Holds the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  if (!this._events || !this._events[event]) return [];
  if (this._events[event].fn) return [this._events[event].fn];

  for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
    ee[i] = this._events[event][i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  if (!this._events || !this._events[event]) return false;

  var listeners = this._events[event]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this);

  if (!this._events) this._events = {};
  if (!this._events[event]) this._events[event] = listener;
  else {
    if (!this._events[event].fn) this._events[event].push(listener);
    else this._events[event] = [
      this._events[event], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true);

  if (!this._events) this._events = {};
  if (!this._events[event]) this._events[event] = listener;
  else {
    if (!this._events[event].fn) this._events[event].push(listener);
    else this._events[event] = [
      this._events[event], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, once) {
  if (!this._events || !this._events[event]) return this;

  var listeners = this._events[event]
    , events = [];

  if (fn) {
    if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
      events.push(listeners);
    }
    if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
      if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
        events.push(listeners[i]);
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[event] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[event];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[event];
  else this._events = {};

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the module.
//
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.EventEmitter2 = EventEmitter;
EventEmitter.EventEmitter3 = EventEmitter;

//
// Expose the module.
//
module.exports = EventEmitter;

},{}]},{},[6]);
