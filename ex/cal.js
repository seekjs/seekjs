/**
 * 精确计算
 * Created by likaituan on 16/6/30.
 */


define(function(req, exp, mod){
    "use strict";

    //转化成整数后精确运算
    var cal = function(num1,ops,num2){
        var str_num1 = "" + num1;
        var str_num2 = "" + num2;
        var arr_num1 = str_num1.split(".");
        var arr_num2 = str_num2.split(".");
        var bit1 = (arr_num1[1]||"").length;
        var bit2 = (arr_num2[1]||"").length;
        var bit = Math.max(bit1, bit2);
        num1 = str_num1.replace(".", "") * Math.pow(10,bit-bit1);
        num2 = str_num2.replace(".", "") * Math.pow(10,bit-bit2);

        if(ops=="add"){
            exp.num = (num1+num2) / Math.pow(10,bit);
        }else if(ops=="sub"){
            exp.num = (num1-num2) / Math.pow(10,bit);
        }else if(ops=="mul"){
            exp.num = num1 * num2 / Math.pow(10,bit+bit);
        }else if(ops=="div"){
            exp.num = num1 / num2;
        }else{
            throw "不支持的运算类型";
        }
        return exp;
    };

    //加法
    exp.add = function(num){
        cal(exp.num,"add",num);
        return exp;
    };

    //减法
    exp.sub = function(num){
        cal(exp.num,"sub",num);
        return exp;
    };

    //乘法
    exp.mul = function(num){
        cal(exp.num,"mul",num);
        return exp;
    };

    //除法
    exp.div = function(num){
        cal(exp.num,"div",num);
        return exp;
    };

    //输出接口
    mod.exports = function(num){
        exp.num = num;
        return exp;
    };


});

