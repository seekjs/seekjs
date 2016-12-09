/*
    排序表格
    add by Li at 2016.4.12
    demo:
    {
        title: "kkkk",
        headData: ["a","b"],
        bodyData: [
            {a:1,b:2},
            {a:3,b:4}
        ]
    };
 */

define(function (req, exp) {
	"use strict";
    var linq = req("sys.lib.linq");

    exp.onInit = function(){
        exp.list = exp.parent[exp.dataset.list];
        exp.sortData();
    };

    //排序 
    exp.sort = function (key) {
        if (key==exp.key) {
            exp.dir = ({asc:"desc",desc:"asc"})[exp.dir];
        }else {
            exp.key = key;
            exp.dir = "desc";
        }
        exp.sortData();
        exp.render();
    };

    //数据排序
    exp.sortData = function(){
        if (exp.dir == "asc") {
            exp.list.data = linq.From(exp.list.data).OrderBy(function (item) {
                return item[exp.key];
            }).ToArray();
        } else {
            exp.list.data = linq.From(exp.list.data).OrderByDescending(function (item) {
                return item[exp.key];
            }).ToArray();
        }
    };

});