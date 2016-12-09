//html5drag add by Li at 2014-9-9
define(function (req, exp, mod) {
	"use strict";
	var $ = req("sys.query");
	
	var DragClass = function(box, handler){
	    box = $(box);
	    if (box.css("position") == "static") {
	        box.css("position", "relative");
	    }
		handler = $(handler).length>0 ? $(handler) : box;
		handler.attr("dragable", true).css("cursor", "move");
		
		var iX, iY;		
		var dragstart = function(ctx) {
			//ctx.preventDefault();
			console.log(box[0].offsetLeft, box[0].offsetTop);
			iX = ctx.originalEvent.pageX - box[0].offsetLeft;
			iY = ctx.originalEvent.pageY - box[0].offsetTop;
			handler.bind("mousemove", drag);
			handler.bind("mouseup", dragend);
		};
		
		var drag = function(ctx) {
			ctx.preventDefault();
			var oX = ctx.originalEvent.pageX - iX;
			var oY = ctx.originalEvent.pageY - iY;
			box.css({"left":oX + "px", "top":oY + "px"});
		};
		
		var dragend = function(ctx) {
			ctx.preventDefault();
			handler.unbind("mousemove", drag);
			handler.unbind("mouseup", dragend);
		};
		
		handler.bind("mousedown", dragstart);
		//handler.bind("mousemove", drag);
		//handler.bind("mouseup", dragend);		
		
	};
	
	mod.exports = function(box, handler){
		return new DragClass(box, handler);
	}
});