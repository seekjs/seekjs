/**
  饼图插件
  add by Li at 2015.12.7
  */

define(function(req,exp){
	"use strict";
	var chart = req("sys.tool.chart.chart");

	exp.draw = function(ops){
		ops.type = "pie";
		chart.draw(ops);
	};


});
