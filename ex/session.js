<<<<<<< HEAD
/**
 * session
 */

define(function (req, exp) {
	"use strict";

    //设置值
	exp.setKey = function(name, val){
        var o = JSON.parse(sessionStorage[name]||'{}');
        for(var k in val) {
            o[k] = val[k];
        }
        sessionStorage[name] = JSON.stringify(o);
        return o;
    };

    //添加项
	exp.addItem = function(name, val){
        var a = JSON.parse(sessionStorage[name]||'[]');
        a.push(val);
        sessionStorage[name] = JSON.stringify(a);
        return a;
    };

=======
/**
 * session
 */

define(function (req, exp) {
	"use strict";

    //设置值
	exp.setKey = function(name, val){
        var o = JSON.parse(sessionStorage[name]||'{}');
        for(var k in val) {
            o[k] = val[k];
        }
        sessionStorage[name] = JSON.stringify(o);
        return o;
    };

    //添加项
	exp.addItem = function(name, val){
        var a = JSON.parse(sessionStorage[name]||'[]');
        a.push(val);
        sessionStorage[name] = JSON.stringify(a);
        return a;
    };

>>>>>>> 6382325fea1fe1d8e6bef0179fd4fe255bd1d004
});