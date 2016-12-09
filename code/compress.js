/**
	@title 代码压缩插件
	@author Li
	@date 2016.4.8
*/
define(function (req, exp) {
	"use strict";

    //返回压缩后的代码
    exp.getCode = function(code){
        var re = /\w+|[\u4e00-\u9fa5]+|\/\/|\/\*|\*\/|\{\}|\[\]|\(\)|\(\{|\}\)|\r\n|\r|\n|\t|\s+|./g;
        var codeArr = code.match(re);

        var comment = 0;  //注释类型 0=关闭状态 1=单行注释 2=多行注释
        var re = 0;       //正则类型 0=关闭状态 1=打开状态
        var quote = 0;    //引号类型 0=关闭状态 1=单引号 2=双引号
        var escape = 0;   //转义类型 0=关闭状态 1=打开状态

        var keywords = ["var", "return"];

        var o = {
            get prev(){
                return codeArr[i-1] || false;
            }
        };

        var a = [];

        for(var i=0; i<codeArr.length; i++) {
            var s = codeArr[i];

            //转义状态
            if(escape==1) {
                escape = 0;
                a.push(s);

            //转义
            }else if(s=="\\") {
                if(quote>0) {
                    escape = 1;
                }
                a.push(s);

            //正则
            }else if(s=="/"){
                if(re){
                    re = 0;
                }else if(comment==0&&quote==0){
                    re = 1;
                }
                a.push(s);

            //单引号
            }else if(s=="'"){
                if(quote==1){
                    quote = 0;
                }else if(comment==0&&re==0&&quote==0){
                    quote = 1;
                }
                a.push(s);

            //双引号
            }else if(s=='"'){
                if(quote==2){
                    quote = 0;
                }else if(comment==0&&re==0&&quote==0){
                    quote = 2;
                }
                a.push(s);

            //单行注释
            }else if(s=="//") {
                if(re==0&&quote==0) {
                    comment = 1;
                }else{
                    a.push(s);
                }

            //单行结束
            }else if(/\r|\n/.test(s)){
                escape = 0;
                if(comment==1){
                    comment = 0;
                }
                if(quote==1){
                    throw "单引号未结束";
                }else if(quote==2){
                    throw "双引号未结束";
                }else if(re==1){
                    throw "正则未结束";
                }

            //Tab缩进
            }else if(/\t/.test(s)){


            //多行注释开始
            }else if(s=="/*") {
                if(re==0&&quote==0) {
                    comment = 2;
                }else{
                    a.push(s);
                }

            //多行注释结束
            }else if(s=="*/"){
                if (comment == 2) {
                    comment = 0;
                } else {
                    a.push(s);
                }

            //非空字符
            }else if(/\S/.test(s)){
                a.push(s);

            //空字符前+var
            }else if(keywords.indexOf(o.prev)>-1){
                a.push(" ");
            }
        }

        return a.join("");
    };

});