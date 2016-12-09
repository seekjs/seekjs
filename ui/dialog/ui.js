/**
 * 弹框插件
 */

define(function (req, exp) {
	"use strict";
    var filter = req("sys.filter");

	var mod = exp.model = {
        title: "提示",
        text: "内容",
        url: "",
        okText: "确定",
        cancelText: "取消",
        hasClose: false,
        hasOk: true,
        hasCancel : false,
        onOk: null,
        onCancel: null,
        onButton: null
    };

    exp.mediaStyle = true;
    exp.timer = null;

    //点击确定按钮
    exp.pickOk = function(){
        exp.timer && window.clearTimeout(exp.timer);
        exp.hide();
        mod.onOk && mod.onOk();
    };

    //点击取消按钮
    exp.pickCancel = function(){
        exp.hide();
        mod.onCancel && mod.onCancel();
    };

    //点击其他按钮
    exp.pickButton = function(index){
        exp.hide();
        mod.onButton && mod.onButton(index);
    };


    //警告框
    exp.alert = function(ops){
        if(typeof ops!="object") {
            ops = {text: ops};
            for(var i=1; i<arguments.length; i++){
               var v = arguments[i];
               typeof v == "number" && (ops.timeout = v);
               typeof v == "function" && (ops.onOk = v);
            }
        }
        ops.hasCancel = false;
        exp.showDialog(ops);
    };

    //确认框
    exp.confirm = function(ops){
        if(typeof ops!="object"){
            ops = {
                text: arguments[0],
                onOk: arguments[1],
                onCancel: arguments[2]
            };
        }
        ops.hasCancel = true;
        exp.showDialog(ops);
    };

    //显示对话框
    exp.showDialog = function(ops){
        filter.mergeObj(mod, ops);
        mod.onOk = ops.onOk || null;
        mod.onCancel = ops.onCancel || null;
        exp.show();
        exp.render();

        if(ops.timeout>0){
            exp.timer = window.setTimeout(exp.pickOk, ops.timeout);
        }
    };


});