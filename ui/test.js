//排序表格
define(function (req, exp) {
	"use strict";
    var app = req("sys.app");
    var dialog = req("sys.ui.alert");

    exp.model = {
        name: "Li",

        table: {
            title: "2015年9742班同学录",
            headData: {
                name:"名字", sex:"性别", age: "年龄"
            },
            bodyData: [
                {name:"明明", sex:"男", age:20},
                {name:"静静", sex:"女", age:18}
            ],
            key: "age",
            dir: "asc"
        }
    };

    exp.onRender = function() {
        //window.setTimeout(function () {
            exp.alert("大家好, 我是超级无敌奥特曼,哈哈!", 3000, function(){
                alert("alert-ok");
            });
        //}, 1000);
    };


    exp.showAlert = function() {
        exp.alert("大家好, 我是超级无敌奥特曼,哈哈!");
    };

    exp.showAlert2 = function() {
        exp.alert({
            text: "大家好2, 我是超级无敌奥特曼,哈哈!",
            timeout:1000,
            onOk: function() {
                alert("alert-ok");
            }
        });
    };

    exp.showConfirm = function() {
         dialog.confirm(exp, "请问你确定要支付吗!", function () {
             alert("confirm-ok");
         }, function () {
             alert("confirm-cancel");
         });
    };

    exp.alert = function(text, timeout, onOk){
        dialog.alert(exp,text,timeout,onOk);
    };

    exp.confirm = function(text, onOk, onCancel){
        dialog.alert(exp,text,onOk,onCancel);
    };
});