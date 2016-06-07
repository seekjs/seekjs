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
});