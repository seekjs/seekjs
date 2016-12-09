define(function (req, exp) {
	"use strict";
	var format = req("sys.format");

    var Class = function (args) {
    	this.list = [];
    	this.results = [];
    	this.count = 0;
    	if (args.length > 0) {
    		this.list.push([].slice.call(args));
    	}
    };
	var _exports = Class.prototype;

	//添加
    _exp.add = function (scope, method) {
    	this.list.push([].slice.call(arguments));
    	return this;
    };

	//结束
    _exp.end = function (callback) {
    	this.callback = callback;
    	this.count = this.list.length;
    	this.run(0);
    	return this;
    };

	//运行
    _exp.run = function (index) {
    	var args = this.list[index];
    	var scope = args.shift();
    	var method = args.shift();

    	var me = this;
    	var fun = function () {
    		me.results = me.results.concat([].slice.call(arguments));
    		++index >= me.count ? me.callback.apply(me,me.results) : me.run(index);
    	};
    	if (!scope[method]) {
    		throw format.strFormat("{0}: method {1} is no define",index,method);
    	}
    	scope[method].apply(scope, args.concat(fun));
    	return this;
    };

	module.exports = function(){
		return new Class(arguments);
	}
});