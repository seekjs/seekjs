/**
 * 提示框插件
 */

define(function (req, exp) {
	"use strict";

    exp.ops = {
        time: 3000
    };

    //设置Tip
    exp.setTip = function(ops){
        exp.ops = ops;
    };

    //警告框
    exp.showTip = function(ops){
        if(typeof ops=="string") {
            ops = {text: ops};
            exp.goPage = arguments[1];
        }
        for(var k in ops){
            exp.ops[k] = ops[k];
        }
        exp.render();
        exp.show();

        if(exp.ops.time){
            setTimeout(function(){
                exp.hide();
                exp.goPage && exp.go(exp.goPage);
            }, exp.ops.time);
        }
    };

});