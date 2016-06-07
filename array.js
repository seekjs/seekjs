/**
 * 数组扩展
 */


define(function (req, exp) {
	"use strict";

    //获取某一项
    exp.item = function(arr, index){
        if(index<0) {
            index += arr.length;
        }
        return arr[index];
    };

    //数组求和
    exp.sum = function (arr) {
        return arr.length>0 ? arr.reduce(function (a, b) {
            return a + b;
        }) : 0;
    };

    //数组去重
    exp.unique = function(arr){
        var uniqueArr = [];
        for(var i=0; i<arr.length; i++){
            arr.indexOf(arr[i])==i && uniqueArr.push(arr[i]);
        }
        return uniqueArr;
    };

});