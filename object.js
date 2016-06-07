/**
 * 对象扩展
 */

define(function (req, exp) {
    "use strict";

    //清空对象
    exp.clear = function (obj) {
        for (var k in obj) {
            var v = obj[k];
            if (typeof v == "string") {
                obj[k] = "";
            }
            else if (typeof v == "number") {
                obj[k] = 0;
            }
            else if (typeof v == "object") {
                if (Array.isArray(v)) {
                    obj[k] = [];
                }
                else {
                    obj[k] = {};
                }
            }
            else if (typeof v == "boolean") {
                obj[k] = false;
            }
        }
    };

    //过滤
    exp.filter = function (obj, fun) {
        if (typeof fun == "string") {
            fun = new Function("$key", "$item", "return " + fun);
        }
        var newObj = {};
        for (var k in obj) {
            fun(k, obj[k]) && (newObj[k] = obj[k]);
        }
        return newObj;
    };


    //对象转成类的实例化
    exp.instantiation = function (o) {
        o.Class.prototype = o;
        return function (ops) {
            return new o.Class(ops);
        };
    };

    //合并对象
    exp.merge = function (This, ops) {
        for (var k in ops) {
            This[k] = ops[k];
        }
        return This;
    };

    //只保留某些key
    exp.only = function(obj){
        var arr = [].slice.call(arguments,1);
        var o = {};
        arr.forEach(function(kk){
            kk = kk.split("->");
            var k1 = kk[0];
            var k2 = kk[1] || kk[0];
            o[k1] = obj[k2];
        });
        return o;
    };

    //排除某些key
    exp.except = function(obj){
        var arr = [].slice.call(arguments,1);
        var o = {};
        for (var k in obj) {
            if(arr.indexOf(k)==-1) {
                o[k] = obj[k];
            }
        }
        return o;
    };

    //系列化
    exp.serialize = function (jsonObj) {
        var a = [];
        for(var key in jsonObj){
            a.push(key);
            a.push(jsonObj[key]);
        }
        return a.join("/");
    };

    //反系列化
    exp.deserialize = function (jsonStr){
        var jsonArr = typeof(jsonStr)=="string" ? jsonStr.split("/") : jsonStr;
        var o = {};
        for(var i=0; i< jsonArr.length; i+=2){
            o[jsonArr[i]] = jsonArr[i+1];
        }
        return o;
    };

    //是否纯对象
    exp.isPlain = function(v){
        return typeof(v)=="object" && !Array.isArray(v);
    };


});