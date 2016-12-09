/**
 * 货币处理
 * Created by likaituan on 15/7/27.
 */

define(function (req, exp) {
    "use strict";

    //相加
    exp.add = function(n1, n2){
        return ( Math.round(n1*100) + Math.round(n2*100) ) / 100;
    };

    //相减
    exp.sub = function(n1, n2){
        return ( Math.round(n1*100) - Math.round(n2*100) ) / 100;
    };

    //相乘
    exp.mul = function(n1, n2){
        return ( Math.round(n1*100) * Math.round(n2*100) ) / 10000;
    };

    //相除
    exp.div = function(n1, n2){
        return Math.round(n1*100) / Math.round(n2*100);
    };

});