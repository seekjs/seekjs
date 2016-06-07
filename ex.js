/**
 * 一些常用的功能
 */


define(function (req, exp) {
	"use strict";
    var $ = req("sys.query");

    exp.isPlainObject = function(v){
        return typeof(v)=="object" && !Array.isArray(v);
    };

    //清空对象
    exp.clearObj = function(obj){
        for(var k in obj){
            obj[k] = "";
        }
    };

    //比较两个日期的大小
    exp.diffDate = function(d1, d2){
        d1 = new Date(d1);
        d2 = d2 ? new Date(d2) : new Date();
        var t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
        var t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
        return t1>t2 ? "gt" : t1<t2 ? "lt" : "eq";
    };


    //万分位格式化
    exp.formatNum = function (num, bit) {
        //非正常值
        if (num === "" || num === null || num === NaN || num === undefined) {
            return "";
        }
        //非数字
        if (!/^\-?\d+(\.\d+)?$/.test(num)) {
            return num;
        }
        //不传bit参数
        if (bit === undefined) {
            bit = 0;
        }
        num = (+num).toFixed(bit).split(".");
        var re = new RegExp("\\d(?=(\\d{4})+$)", "g");
        return num[0].replace(re, "$&,") + (num[1] ? "." + num[1] : "");
    };

    //获取表单的值
    exp.getForm = function (form) {
        var o = {};
        form.find("select,input").each(function(i, obj){
            o[obj.name] = +obj.value;
        });
        return o;
    };

    //解析事件 add by Li at 2014-7-12
    exp.parseEvent = function (ui, scope) {
        var context = {};
        context.ui = $(ui);
        [].forEach.call(ui.querySelectorAll("[data-event]"), function (ele) {
            //var ema = ele.dataset.event.split(">");
            var ema = ele.getAttribute("data-event").split(">");  //为兼容IE10
            if (ema.length == 1) {
                ema = ["click", ema[0]];
            }
            var ma = ema[1].split(":");
            var e = ema[0];
            var m = ma[0];
            var a = ma[1] && ma[1].split(",") || [];
            $(ele).unbind(e).bind(e, function () {
                context.element = ele;
                context.$element = $(ele);
                scope[m].apply(scope, [context].concat(a));
            });
        });
    };


    //对象转成类的实例化
    exp.instantiation = function (o) {
        o.Class.prototype = o;
        return function (ops) {
            return new o.Class(ops);
        };
    };

    //合并对象
    exp.mergeObj = function (This, ops) {
        var defaults = This.ops || {};
        ops = ops || {};
        This.el = This.el || {};
        [defaults, ops].forEach(function (obj) {
            obj.el = obj.el || {};
            for (var k in obj) {
                if (k == "el") {
                    for (var name in obj.el) {
                        This.el[name] = $(obj.el[name]);
                    }
                }else if(/^el_(\w+)$/.test(k)){
                    This.el[Regexp.$1] = $(obj[k]);
                } else {
                    This[k] = obj[k];
                }
            }
        });
        return This;
    };


});