/**
  图表插件
  add by Li at 2015.12.7
  */

define(function(req,exp){
	"use strict";

	exp.draw = function(ops,chart){
		var box = document.querySelector(ops.box);
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		box.appendChild(canvas);

		var data = exp.cal(ops.data.data,"province","count");
		var ti = exp.showTitle(ops.data.title);
		ctx.fillText(ti,10,10);
		chart && chart.idraw(ctx, data.data);
		var labelText = exp.showLabel(data.label);
		ctx.fillText(labelText,10,50);
	};

	//数据重组
	exp.cal = function(_data,label,data){
		var o = {
			label:[],
			data:[],
		};
		_data.forEach(function(item){
			o.data.push(item[data]);
			o.label.push(item[label]);
		});
		return o; 
	};

	//显示标题
	exp.showTitle = function(title){
		return title;
	};

	//显示数据
	exp.showData = function(data){
		return data.join(" | ");
	};

	//显示标签
	exp.showLabel = function(label){
		return label.join(" | ");
	};


});
