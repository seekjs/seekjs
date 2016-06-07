/**
 * 日期相关的函数
 * Created by likaituan on 15/7/27.
 */

define(function (req, exp) {
	"use strict";

    //解析日期
    exp.parseDate = function (date) {
        if (arguments.length == 3) {
            date = new Date(date, arguments[1], arguments[2]);
        } else if (typeof (date) == "string") {
            date = new Date(date.replace(/\-/g, "/"));
        } else if (typeof (date) == "number") {
            date = new Date(date);
        }
        return date;
    };

    //日期格式化
    exp.format = function (date, fmtString, flag) {
        date = exp.parseDate(date);
        if (!date) {
            return "";
        }
        if (flag) {
            var s = new Date().getTime() / 1000 - date.getTime() / 1000;
            if (s > 0 && s < 3600) {
                return Math.ceil(s / 60) + "分钟前";
            } else if (s > 0 && s < 86400) {
                return Math.round(s / 3600) + "小时前";
            }
        }
        var e = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmtString)) {
            fmtString = fmtString.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var d in e) {
            if (new RegExp("(" + d + ")").test(fmtString)) {
                fmtString = fmtString.replace(RegExp.$1, RegExp.$1.length == 1 ? e[d] : ("00" + e[d]).substr(("" + e[d]).length));
            }
        }
        return fmtString;
    };

    //获取相差天数
    exp.getDiffDay = function(startDate, endDate){
        if(arguments.length==1){
            endDate = startDate;
            startDate = new Date();
        }
        var d1 = exp.parseDate(startDate);
        var d2 = exp.parseDate(endDate);
        d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
        d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
        return (d2-d1)/86400000;
    };

    //获取某年某月的天数
    exp.getDayCount = function (y,m) {
        return new Date(y, m + 1, 0).getDate();
    };

    //获取周岁(严谨模式)
    exp.getRealFullYear = function (date) {
        if (/string|number/.test(typeof date)) {
            date = new Date(date);
        }
        var curDate = new Date();
        var y1 = date.getFullYear();
        var m1 = date.getMonth();
        var d1 = date.getDate();
        var n1 = this.getDayCount(y1,m1);
        var y2 = curDate.getFullYear();
        var m2 = curDate.getMonth();
        var d2 = curDate.getDate();
        var n2 = this.getDayCount(y2, m2);
        if (m1==1 && d1 == n1 && m2==1 && d2 == n2) {
            d1 = d2;
        }
        var year = y2 - y1;
        if(m2-m1<0 || m2-m1==0&&d2-d1<0){
            year--;
        }
        return year;
    };

    //获取周岁
    exp.getFullYear = function (date) {
        date = this.parseDate.apply(null,arguments);
        var curDate = new Date();
        var y1 = date.getFullYear();
        var m1 = date.getMonth();
        var d1 = date.getDate();
        var y2 = curDate.getFullYear();
        var m2 = curDate.getMonth();
        var d2 = curDate.getDate();
        var year = y2 - y1;
        if(m2-m1<0 || m2-m1==0&&d2-d1<0){
            year--;
        }
        return year;
    };

    //获取当前时间
    exp.now = function(date) {
        return formatTime(new Date());DD
    };

    //格式化时间（YYYY-MM-DD hh:mm:ss形式）
    exp.formatTime = function(date) {
        return date.toISOString().replace("T"," ").replace(/\..+$/,"");
    };

});