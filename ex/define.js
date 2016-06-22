/**
 * 超轻量级模块化组件
 * Created by likaituan on 15/9/18.
 */

(function(window, undefined){
    "use strict";

    var seekjs = window.seekjs = {};
    var modules = seekjs.modules = {};

    //编译
    var req = seekjs.require = function(ids, callback){
        if(typeof ids=="string"){
            ids = [ids];
        }
        var arr = ids.map(function(id) {
            var mod = modules[id];
            if(mod.exports){
                return mod.exports;
            }
            if (typeof(mod.factory) == "function") {
                mod.exports = {};
                var ret = mod.factory(req, mod.exports, mod);
                mod.exports = ret || mod.exports;
            }else {
                mod.exports = mod.factory;
            }
            return mod.exports;
        });

        if(callback){
            return callback.apply(null,arr);
        }
        return arr[0];
    };
    /*
    window.define = function (id,factory) {
        var mod = modules[id] = {};
        mod.factory = factory;
    };
    window.define.amd = false;
    window.define.cmd = true;
    */
    seekjs.define = function (id,factory) {
        var mod = modules[id] = {};
        mod.factory = factory;
    };
    seekjs.define.amd = false;
    seekjs.define.cmd = true;

    //获取最后一个script对象
    var getLastScript = function () {
        var scripts = document.querySelectorAll("script");
        var script = scripts[scripts.length - 1];
        return script;
    };

    var mainPath = getLastScript().dataset.main;
    if(mainPath){
        window.onload = function() {
            req(mainPath);
        }
    }

})(this);
