/**
 * 阿拉伯数字转其他语言的数字
 * Created by likaituan on 15/8/10.
 */


define(function(req, exp){
    "use strict";

    var Lang = {
        gbk: ["零","一","二","三","四","五","六","七","八","九","十","十一","十二","十三"],
        big: ["零","壹","贰","叁","肆","伍","陆","柒","捌","玖","拾","拾壹","拾贰","拾叁"],
        eng: ["zero", "one","two","three","four","five","six","seven","eight","nine","ten","eleven","tween","thirdteen"]
    };

    exp.lang = function(num, k){
        return Lang[k][num] || num;
    };

    exp.gbk = function(num){
        return ex.lang(num,"gbk");
    };

    exp.big = function(num){
        return ex.lang(num,"big");
    };

    exp.eng = function(num){
        return ex.lang(num,"eng");
    };

    //数字转中文(0-99之间)
    exp.num2cn = function (num) {
        var baseCnNums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
        var a = num.toString().split("");
        if (num < 11) {
            return baseCnNums[num];
        } else if (num < 20) {
            return "十" + baseCnNums[a[1]];
        } else if (num % 10 == 0) {
            return baseCnNums[a[0]] + "十";
        } else {
            return a.map(function (n) { return baseCnNums[n] }).join("十");
        }
    };


});