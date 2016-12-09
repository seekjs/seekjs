/**
 * 字符串相关的函数
 * Created by likaituan on 15/7/27.
 */


define(function (req, exp) {
    "use strict";
    var filter = req("sys.filter");

    //字符串格式化
    exp.format = function (str, _obj) {
        if(arguments.length==1){
            return str;
        }else if(arguments.length==2 && filter.isPlainObject(_obj)){
            return str.replace(/\{(\w+)\}/g, function (_, key) {
                return _obj[key];
            });
        }else{
            var arr = [].slice.call(arguments, 1);
            return str.replace(/\{(\d+)\}/g, function (_, n) {
                return arr[n];
            });
        }
    };

    //取头几位
    exp.begin = function(str, n){
        return str.slice(0,n);
    };

    //取末几位
    exp.end = function(str, n){
        return str.slice(-n);
    };

});