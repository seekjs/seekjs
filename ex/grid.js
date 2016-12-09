define(function (req, exp) {
	"use strict";
    var $ = req("sys.query_new");

	/**
	@title 启用布局
	@des 可以多个对象
	@param box 盒子 [string,dom]
	*/
    exp.use = function (box) {
        if (typeof box == "string") {
            box = document.querySelector(box);
        }
        box.dataset.grid && exp.setItem(box);
        [].forEach.call(box.querySelectorAll("[data-grid]"), exp.setItem);
    };

    //设置单个data-grid项
    exp.setItem = function(obj){
        var $obj = $(obj);
        var grid = obj.dataset.grid.split(":");
        var flag = grid[0];
        var parts = grid[1].split(",");
        if(flag=="r"){
            var objH = $obj.height();
            //console.log(objH);
            var starCount = 0;
            var heights = parts.map(function(item,i){
                var h;
                if(item=="*"){
                    h = "";
                    ++starCount;
                    $(obj.children[i]).css("overflow","scroll");//.css("overflowScrolling","touch").css("webkitOverflowScrolling","touch");
                }
                else if(item=="-"){
                    h = $(obj.children[i]).height();
                    objH -= h;
                }else{
                    h = +item;
                    objH -= h;
                }
                return h;
            });
            var starH = objH / starCount;

            heights.forEach(function(h, i){
                h = h || starH;
                //console.log(parts[i],h);
                parts[i]!="-" && $(obj.children[i]).height(h);
            });
        }
    };


});