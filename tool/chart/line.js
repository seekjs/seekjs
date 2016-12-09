/**
  线图插件
  add by Li at 2015.12.7
  */

define(function(req,exp){
	"use strict";
	var chart = req("sys.tool.chart.chart");

	exp.draw = function(ops){
		ops.type = "line";
		chart.draw(ops,exp);
	};

	exp.idraw = function(ctx,a){
		ctx.beginPath();
		for(var i=1; i<a.length; i++){
			ctx.moveTo(i*100-100+20,a[i-1]/4+10);
			ctx.lineTo(i*100+20,a[i]/4+10);
		}
		ctx.stroke();
	};


});
