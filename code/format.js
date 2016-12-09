/**
 @title 代码格式化插件
 @author Li
 @date 2016.4.8
 */
define(function (req, exp) {
    "use strict";

    //返回压缩后的代码
    exp.getCode = function(code){
        var re = /\w+|[\u4e00-\u9fa5]+|\/\/|\/\*|\*\/|\{\}|\[\]|\(\)|\(\{|\}\)|==|\r\n|\r|\n|\t+|\s+|./g;
        var codeArr = code.match(re);
	    var len = codeArr.length;
        //console.log(codeArr);

        var comment = 0;  //注释类型 0=关闭状态 1=单行注释 2=多行注释
        var re = 0;       //正则类型 0=关闭状态 1=打开状态
        var quote = 0;    //引号类型 0=关闭状态 1=单引号 2=双引号
        var escape = 0;   //转义类型 0=关闭状态 1=打开状态

        var bracket = 0;  //括弧类型 0=关闭状态 1=小括弧 2=中括弧
        var tabLevel = 0; //Tab层级

        var keywords = ["var", "return"];

        var o = {
            //换行
            br: function(){
                a.push("\n");
		        o.tab();
            },

            //缩进
            tab: function(){
                a.push("\t".repeat(tabLevel));
            },

            //上一个字符串
            get prev(){
                return codeArr[i-1] || false;
            },

            //下一个字符串
            get next(){
                return codeArr[i+1] || false;
            },

            //上一个非空字符串
            get prevS(){
                for(var j=i-1; j>=0; j--) {
                    if(/\S/.test(codeArr[j])){
                        return codeArr[j];
                    }
                }
                return false;
            },

            //下一个非空字符串
            get nextS(){
                for(var j=i+1; j<len; j++) {
                    if(/\S/.test(codeArr[j])){
                        return codeArr[j];
                    }
                }
                return false;
            },

            //查看是否要换行
            get chkBr(){
                for(var j=i+1; j<len; j++) {
                    if(/\S/.test(codeArr[j])){
                        return codeArr[j]!="//";
                    }else if(/\r|\n/.test(codeArr[j])){
                        return false;
                    }
                }
                return false;
            },

            //查看是否要换行(向前推）
            get chkBr2(){
                for(var j=i-1; j>=0; j--) {
                    if(/\S/.test(codeArr[j])){
                        return true;
                    }else if(/\r|\n/.test(codeArr[j])){
                        return false;
                    }
                }
                return false;
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
                }
                a.push(s);

                //单行结束
            }else if(/\r|\n/.test(s)){
                escape = 0;
                quote = 0;
                re = 0;
                if(comment==1){
                    comment = 0;
                }
		        o.br();

                //Tab缩进
            }else if(/\t+/.test(s)){
                re==0 && quote==0 && comment==0 && o.nextS=="//" && a.push(s);

                //多行注释开始
            }else if(s=="/*") {
                if(re==0&&quote==0) {
                    comment = 2;
                }
                a.push(s);

                //多行注释结束
            }else if(s=="*/") {
                if (comment == 2) {
                    comment = 0;
                }
                a.push(s);

            //赋值
            }else if(s=="=") {
                a.push(" = ");

            //小括弧开始
            }else if(s=="(") {
                a.push(s);
                if(re==0&&quote==0&&comment==0&&bracket==0){
                    bracket = 1;
                }

            //小括弧结束
            }else if(s==")") {
                a.push(s);
                if(re==0&&quote==0&&comment==0&&bracket==1){
                    bracket = 0;
                }

            //中括弧开始
            }else if(s=="[") {
                a.push(s);
                if(re==0&&quote==0&&comment==0&&bracket==0){
                    bracket = 2;
                }

            //中括弧结束
            }else if(s=="]") {
                a.push(s);
                if(re==0&&quote==0&&comment==0&&bracket==2){
                    bracket = 0;
                }

            //分号
            }else if(s==";"){
                a.push(s);
                if(re==0&&quote==0&&comment==0&&o.chkBr){
                    o.br();
                }

            //逗号
            }else if(s==","){
                a.push(s);
                if(re==0&&quote==0&&comment==0){
                    if(bracket==0&&o.chkBr) {
                        o.br();
                    }else{
                        a.push(" ");
                    }
                }

            //冒号
            }else if(s==":"){
                a.push(s);
                if(re==0&&quote==0&&comment==0){
                    a.push(" ");
                }

            //代码块开始
            }else if(s=="{"||s=="({") {
                a.push(s);
                if(re==0&&quote==0&&comment==0){
                    tabLevel++;
                    o.chkBr && o.br();
                }

            //代码块结束
            }else if(s=="}"||s=="})"){
                if(tabLevel>0){/*
                    if(o.prevS==";"){
                        a.pop();
                        a.pop();
                    }*/
                    tabLevel--;
		            a.pop();
		            o.tab();
                    o.chkBr2 && o.br();
                }
                a.push(s);

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
