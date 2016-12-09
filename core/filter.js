/**
    @title 模板格式化
*/
define(function (req, exp) {
	"use strict";

    /*=====================处理字符串======================*/

    //字符串格式化
    exp.stringFormat = exp.SF = function (str, _obj) {
        if(arguments.length==1){
            return str;
        }else if(arguments.length==2 && exp.isPlainObject(_obj)){
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

    //字符格式化
    exp.strFormat = function () {
        var args = [].slice.call(arguments);
        var str = args.shift();
        args.forEach(function (arg,i) {
            str = str.replace("{"+i+"}", arg);
        });
        return str;
    };

    //取头几位
    exp.begin = function(str, n){
        return str.slice(0,n);
    };

    //取末几位
    exp.end = function(str, n){
        return str.slice(-n);
    };

    //转大写字母
    exp.upper = function(str){
        return str.toUpperCase();
    };

    //转小写字母
    exp.lower = function(str){
        return str.toLowerCase();
    };

    //根据指定的分隔符截成两半
    exp.split2 = function (str, flag) {
        var a = str.split(flag);
        var ret = [a.shift()];
        a.length > 0 && ret.push(a.join(flag));
        return ret;
    };


    /*=====================处理数字======================*/


    //分隔符
    exp.separator = exp.sep = function(num, n){
        n = n || 3;
        num = (+num).toString().split(".");
        var re = new RegExp("\\d(?=(\\d{"+n+"})+$)", "g");
        return num[0].replace(re, "$&,") + (num[1] ? "." + num[1] : "");
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

    /**
     @title 千分位格式化
     @param num 数字 number
     @param bit 保留小数点位数 number 2
     @return [string]
     */
    exp.number_format = function (num, bit) {
        //非正常值
        if (num==="" || num===null || num===NaN || num===undefined) {
            return "";
        }
        //非数字
        if (!/^\-?\d+(\.\d+)?$/.test(num)) {
            return num;
        }
        //不传bit参数
        if (bit === undefined) {
            bit = 2;
        }
        num = (+num).toFixed(bit).split(".");
        var re = new RegExp("\\d(?=(\\d{3})+$)", "g");
        return num[0].replace(re, "$&,") + (num[1] ? "." + num[1] : "");
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

    //分隔符
    exp.separator = exp.sep = function(num, n){
        n = n || 3;
        num = (+num).toString().split(".");
        var re = new RegExp("\\d(?=(\\d{"+n+"})+$)", "g");
        return num[0].replace(re, "$&,") + (num[1] ? "." + num[1] : "");
    };

    //货币格式化
    exp.currency = function(num, n){
        if(n!==undefined && n>0){
            return exp.separator(num.toFixed(2),n);
        }
        return (+num).toFixed(2);
    };

    //人民币格式化
    exp.rmb = function(num){
        if(typeof(num)!="number" && !num){
            //throw "rmb格式化数字为空";
            return "";
        }else if(/^\-?\d+(\.\d+)?$/.test(num)==false){
            throw "rmb格式化数字无效";
        }
        return parseInt(num).toString().replace(/\d(?=(\d{3})+$)/g, "$&,") + "." + (+num).toFixed(2).split(".")[1];
    };

    exp.bit = function(num, n){
        return (+num).toFixed(n);
    };

    //求百分比
    exp.percent = function (num1, num2, bit) {
        num1 = +num1;
        num2 = +num2;
        return ( num2===0 ? 0 : num1 / (num2||1) *100 ).toFixed(bit || 0) + "%";
    };

    /*=====================处理日期======================*/

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

    //日期解析
    exp.parseDate_bak = function (date) {
        if (typeof date == "string") {
            date = date.split('.')[0].replace(/\-/g,"/").replace('T', ' ');
        }
        if (typeof date != "object") {
            date = new Date(date);
        }
        return date;
    };

    //时间格式化（YYYY-MM-DD hh:mm:ss形式）
    exp.timeFormat = function(date) {
        return date.toISOString().replace("T"," ").replace(/\..+$/,"");
    };

    //比较两个日期的大小
    exp.diffDate = function(d1, d2){
        d1 = new Date(d1);
        d2 = d2 ? new Date(d2) : new Date();
        var t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
        var t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
        return t1>t2 ? "gt" : t1<t2 ? "lt" : "eq";
    };

    //日期格式化
    exp.dateFormat = function (date, fmtString, flag) {
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

    //日期格式化
    exp.date_format = exp.df = function (date, fmtString, flag) {
        date = this.parseDate(date);
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
        return formatTime(new Date());
    };


    /*=====================处理数组======================*/

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

    //数组求和并格式化
    exp.SF = function (arr, bit) {
        return this.F(this.sum(arr).toFixed(2),bit);
    };

    //数组下多个key求和
    exp.sumList = function (arr) {
        var o = {};
        [].slice.call(argments,1).forEach(function (key) {
            o[key] = 0;
            arr.forEach(function (item) {
                o[key] += +item[key];
            });
        });
        return o;
    };


    /*=====================处理对象======================*/

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

    //清空对象
    exp.clearObj = function(obj){
        for(var k in obj){
            obj[k] = "";
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



    //合并对象
    exp.mergeObj = function (This, ops) {
        for (var k in ops) {
            This[k] = ops[k];
        }
        return This;
    };

    //合并对象
    exp.mergeObj_deep = function (This, ops) {
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
    exp.isPlainObject = function(v){
        return typeof(v)=="object" && !Array.isArray(v);
    };


    /*=====================处理其他======================*/

    //获取表单的值
    exp.getForm = function (form) {
        var o = {};
        form.find("select,input").each(function(i, obj){
            o[obj.name] = +obj.value;
        });
        return o;
    };

    //对象转成类的实例化
    exp.instantiation = function (o) {
        o.Class.prototype = o;
        return function (ops) {
            return new o.Class(ops);
        };
    };




});