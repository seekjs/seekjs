/**
 * 兼容代码
 */

define(function (req, exp) {
	"use strict";

	if (!Function.prototype.bind) {
		Function.prototype.bind = function (context) {
			var fun = this;
			var args = [].slice.call(arguments, 1);
			return function () {
				var args2 = [].slice.call(arguments);
				return fun.apply(context, args.concat(args2));
			}
		};
	}


	if (!Array.prototype.map) {
		Array.prototype.map = function (fun) {
			var a = [];
			for (var i in this) {
				a[i] = fun(this[i],i,this);
			}
			return a;
		}
	}

	if (!Function.prototype.bind) {
		Function.prototype.bind = function () {
			var args = [].slice.call(arguments);
			var scope = args.shift();
			var fun = this;
			return function () {
				fun.apply(scope, args);
			}
		}
	}

});