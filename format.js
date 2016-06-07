/**
    @title 模板格式化
*/
define(function (req, exp) {
	"use strict";

    var num_lang = req("sys.num_lang");

    exp.gbk = function(num){
        return num_lang.lang(num,"gbk");
    };

    exp.big = function(num){
        return num_lang.lang(num,"big");
    };

    exp.eng = function(num){
        return num_lang.lang(num,"eng");
    };


    //日期解析
	exp.parseDate = function (date) {
        if (typeof date == "string") {
        	date = date.split('.')[0].replace(/\-/g,"/").replace('T', ' ');
        }
        if (typeof date != "object") {
        	date = new Date(date);
        }
        return date;
	};

    //语言
    //exp.lang = re2q("sys.num_lang").lang;

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

    //字符格式化
	exp.strFormat = function () {
		var args = [].slice.call(arguments);
		var str = args.shift();
		args.forEach(function (arg,i) {
			str = str.replace("{"+i+"}", arg);
		});
		return str;
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

	//根据指定的分隔符截成两半
    exp.split2 = function (str, flag) {
    	var a = str.split(flag);
    	var ret = [a.shift()];
    	a.length > 0 && ret.push(a.join(flag));
    	return ret;
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
            throw "rmb格式化数字为空";
        }else if(/^\d+(\.\d+)?$/.test(num)==false){
            throw "rmb格式化数字无效";
        }
        return parseInt(num).toString().replace(/\d(?=(\d{3})+$)/g, "$&,") + "." + (+num).toFixed(2).split(".")[1];
    };

    exp.bit = function(num, n){
        return (+num).toFixed(n);
    };

    //数组求和
    exp.sum = function (arr) {
        return arr.length>0 ? arr.reduce(function (a, b) {
            return a + b;
        }) : 0;
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

    //求百分比
    exp.percent = function (num1, num2, bit) {
        num1 = +num1;
        num2 = +num2;
        return ( num2===0 ? 0 : num1 / (num2||1) *100 ).toFixed(bit || 0) + "%";
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

    exp.now = exp.date_format(new Date(), "yyyy年MM月dd日 hh:mm:ss");

});