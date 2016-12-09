define(function (req, exp) {
	"use strict";
    req("ui.css");

    exp.pageIndex = 0;      //当前页码
    exp.pageCount = 0;      //总页数
    exp.prevTitle = " < ";  //上一页标题
    exp.nextTitle = " > ";  //下一页标题
    exp.hasJump = true;
    exp.jumpPage = "";      //跳到第几页

    exp.onInit = function(){
        exp.pageIndex = exp.dataset.index * 1;
        exp.pageCount = exp.dataset.count * 1;

        if(exp.dataset.prev) {
            exp.prevTitle = exp.dataset.prev;
        }
        if(exp.dataset.next){
            exp.nextTitle = exp.dataset.next;
        }
    };

    exp.goto = function(pageIndex){
        exp.pageIndex = pageIndex;
        var fun = exp.parent[exp.dataset.change];
        fun && fun(pageIndex);
    };

    exp.justNum = function(){
        exp.element.value = exp.element.value.replace(/[^a-z0-9_]/g,'');
    };

    //跳转页面
    exp.jumpPag = function(){
        if(exp.jumpPage=="") {
            return exp.alert("请输入页码");
        }else if(exp.jumpPage<1||exp.jumpPage>exp.pageCount) {
            return exp.alert("超出范围,请重新输入");
        }
        exp.goto(exp.jumpPage);
        exp.jumpPage = "";
    };

});