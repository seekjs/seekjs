/**
 * 简单DOM操作
 */

define(function (req, exp, mod) {
	"use strict";

	//类
	var Class = function (queryString, container) {
        queryString = queryString || [];
        container = container || document.body;
		if (typeof queryString == "object") {
            if(queryString.is_seek_obj){
                return queryString;
            }
            this.obj = queryString.length>-1 ? queryString : [queryString];
        }else if(typeof queryString == "string") {
            this.obj = container.querySelectorAll(queryString);
        }else{
            throw "queryString 类型只能是object和string";
        }
        this.is_seek_obj = true;
		return this;
	};
	exp = Class.prototype = {};

    //第几个
    exp.eq = function (index) {
        return new Class(this.obj[index]);
    };

    //追加
    exp.append = function (obj) {
        for(var i=0; i<this.obj.length; i++) {
            this.obj[i].append(obj);
        }
        return this;
    };

	//追加到
	exp.appendTo = function (obj) {
        for(var i=0; i<this.obj.length; i++) {
            obj.append(this.obj[i]);
        }
        return new Class(obj);
	};

    //删除
    exp.remove = function(){
        for(var i=0; i<this.obj.length; i++) {
            this.obj[i].parentNode.removeChild(this.obj[i]);
        }
        return this;
    };

	//内容
	exp.html = function (htm) {
        if (arguments.length == 0) {
            return this.obj[0] && this.obj[0].innerHTML || "";
        } else if (arguments.length == 1) {
            for(var i=0; i<this.obj.length; i++) {
                this.obj[i].innerHTML = htm;
            }
        }
        return this;
	};

    //属性
    exp.attr = function (key, val) {
        if(arguments.length==1) {
            return this.obj[0] && this.obj[0][key] || "";
        }else if(arguments.length==2) {
            for(var i=0; i<this.obj.length; i++) {
                this.obj[i][key] = val;
            }
        }
        return this;
    };

    //设置dataset属性
    exp.dataset = function (key, val) {
        for(var i=0; i<this.obj.length; i++) {
            this.obj[i].dataset[key] = val;
        }
        return this;
    };

    //样式
	exp.css = function (key, val) {
        if(arguments.length==1) {
            return this.obj[0] && getComputedStyle(this.obj[0])[key] || "";
        }else if(arguments.length==2) {
            for(var i=0; i<this.obj.length; i++) {
                this.obj[i].style[key] = val;
            }
        }
        return this;
	};

	//像素
	exp.px = function (key, val) {
        if(arguments.length==1) {
            return +this.css(key).replace("px","");
        }else if(arguments.length==2) {
            return this.css(key, val+"px");
        }
	};

    //显示
    exp.show = function () {
        return this.css("display", "block");
    };

    //隐藏
    exp.hide = function () {
        return this.css("display", "none");
    };

    //设置X坐标
    exp.left = function (x) {
        return arguments.length==1 && this.px("left", x) || this.px("left");
    };

    //设置Y坐标
    exp.top = function (y) {
        return arguments.length==1 && this.px("top", y) || this.px("top");
    };

    //设置宽度
    exp.width = function (w) {
        return arguments.length==1 && this.px("width", w) || this.px("width");
    };

    //设置高度
    exp.height = function (h) {
        return arguments.length==1 && this.px("height", h) || this.px("height");
    };

    //实例
    mod.exports = function(obj){
        return new Class(obj);
    };

});