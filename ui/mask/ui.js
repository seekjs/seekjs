/**
 * 遮罩层插件
 */

define(function (req, exp, module) {
	"use strict";
    var filter = req("sys.filter");

    //默认设置
    var mod = exp.model = {
        bg: "#000",				//背景色
        pic: "",				//图片
        color: "",				//文字颜色
        text: "",				//文字
        loading: false,			//是否loading
        opacity: 0.5,			//透明度
        time: 0				    //是否定时关闭
    };

    exp.pic = {
        loading: module.resolve("./loading.gif")
    };

	//显示遮罩
	exp.showMask = function (ops) {
		if(typeof ops=="string"){
			mod.text = ops;
		}
		filter.mergeObj(mod, ops);
        mod.pic = ops.loading ? exp.pic.loading : "";
		//this.text && obj.css("line-height", this.args.box.height()+"px");

		exp.show();
		exp.render();
		mod.time && setTimeout(exp.hide, mod.time);
	};

});