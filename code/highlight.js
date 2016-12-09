/**
	@title 代码高亮组件
	@author Li
	@date 2015.1.14
*/
define(function (req, exp, mod) {
	"use strict";
	var str = req("sys.string");
    var re = /\w+|[\u4e00-\u9fa5]+|\\\/\/|\/\/|\/\*|\*\/|\{\}|\[\]|\(\)|\(\{|\}\)|.|\n|\t/g;

	//着色
	exp.getColor = function (code) {
		var colors = {
			"blue": /\b(var|new|function|return|typeof|if|else|switch|case|default|for|in|break|continue|do|while|try|catch|this|true|false)\b/g
		};
		for (var k in colors) {
			code = code.replace(colors[k], str.format('<font color="{0}">{1}</font>', k, "$1"));
		}
		return code;
	};

    //获取高亮后的代码
	exp.getHTML = function (code) {
		code = code.replace(/\r\n|\r/g, "\n");
		var codeArr = code.match(re);

		var escapeType = 0;   //转义类型 0=关闭状态 1=打开状态
		var reType = 0;       //正则类型 0=关闭状态 1=打开状态
		var quoteType = 0;    //引号类型 0=关闭状态 1=单引号 2=双引号
		var commentType = 0;  //注释类型 0=关闭状态 1=单行注释 2=多行注释
		var i;
        var a = [];

		var o = {
            //换行
			get br() {
				return '<br/>';
			},
            //缩进
			get tab(){
				return '&#12288;&#12288;';
			},
            //空格
			get blank(){
				return '&nbsp;';
			},
            //上一个
			get prev() {
				return codeArr[i - 1] || "";
			},
            //下一个
			get next() {
				return codeArr[i + 1] || "";
			},
            //下一个非空字符串
			get nextS() {
				for (var j = i + 1; j < codeArr.length; j++) {
					if (/\S/.test(codeArr[j])) {
						return codeArr[j];
					}
				}
				return "";
			}
		};


		for (i = 0; i < codeArr.length; i++) {
			var len = a.length;
			var s = codeArr[i];
			//console.log(s, "reType="+reType, "commentType="+commentType, "quoteType="+quoteType);

            //当 正则或引号 打开的状态
			if (reType == 1 || quoteType > 0) {
                //处理转义
				if(escapeType == 0 && s=="\\"){
					escapeType = 1;
					a.push(s);
                    continue;
				} else if (escapeType == 1 && o.prev == "\\") {
					escapeType = 0;
					a.push(s);
                    continue;
				}
			}

			//当 正则+注释+引号 都关闭的状态
			if (reType == 0 && quoteType == 0 && commentType == 0) {
				//处理关键字
				if (/\w+/.test(s)) {
					a.push(exp.getColor(s));
                    continue;
				}
			}

			//当 正则+注释 都关闭的状态 处理字符串
			if (reType == 0 && commentType == 0) {
				var oldQuoteType = quoteType;
				if(s == "'") {
					quoteType = quoteType == 0 ? 1 : quoteType==1 ? 0 : 2;
				} else if (s == '"') {
					quoteType = quoteType == 0 ? 2 : quoteType==2 ? 0 : 1;
				}
				if (oldQuoteType != quoteType) {
					quoteType>0 && a.push('<font style="color:rgb(163,21,21)">');
					a.push(s);
					quoteType==0 && a.push('</font>');
                    continue;
				}
			}

			//当 引号+注释 都关闭的状态 处理正则
			if (quoteType == 0 && commentType == 0) {
				var oldReType = reType;

				if(s == "/" || s == "\\//" || s=="*/"){
					reType = reType==1 ? 0 : 1;
					if (oldReType != reType) {
						reType==1 && a.push('<font style="color:rgb(163,21,21)">');
						a.push(s);
						if (reType==0) {
							if(/[img]+/.test(o.next)){
								a.push(o.next);
								++i;
							}
							a.push('</font>');
						}
                        continue;
					}
				}
			}

			//当 正则+引号 都关闭的状态 处理注释
			if (reType == 0 && quoteType == 0) {
				var oldCommentType = commentType;

				if (s == "//") {
					commentType = commentType == 0 ? 1 : commentType;
				} else if (s == "/*") {
					commentType = commentType == 0 ? 2 : commentType;
				} else if (s == "*/") {
					commentType = commentType == 2 ? 0 : commentType;
				}
				if(oldCommentType!=commentType){
					commentType>0 && a.push('<font color="green">');
					a.push(s);
					commentType==0 && a.push('</font>');
                    continue;
				}
			}

			//回车
			if (s == "\n") {
				a.push(o.br);
				if (commentType == 1) {
					commentType = 0;
					a.push('</font>');
				}
                continue;
			}else if (s == "\t") {
				a.push(o.tab);
                continue;
			} else if (s == " ") {
				a.push(o.blank);
                continue;
			}

			a.length == len && a.push(s); //如果没加就直接加
		}
		return a.join("");
	};
});