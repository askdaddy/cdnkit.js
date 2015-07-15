/**
 * Created by seven on 15/6/21.
 */
var util = require('./util');
var DomActor = require('./dom');

/**
 * 总控制端
 * 1.初始化接手Dom，将所有要CDN加速的资源纳入到管理范畴
 * 2.从本地cache中加载图片 或 从p2p加载 或 从CDN加载
 *
 * @param options
 * @returns {CdnKit}
 * @constructor
 */
function CdnKit(options) {
    if (!(this instanceof CdnKit)) return new CdnKit(options);

    var self = this;
    this._conf = util.config;
    this._cache = new Cache({});

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

CdnKit.prototype._init = function () {
    this._dom = new DomActor({});
    this._dom.init();
};

module.exports = CdnKit;