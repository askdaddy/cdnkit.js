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