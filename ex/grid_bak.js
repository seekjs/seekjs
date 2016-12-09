define(function (req, exp) {
	"use strict";
	var filterTags = [];

	/*
	@title 获取像素值
	@param pxstr 像素字符串 [string]
	@return [number]
	*/
    var px = function (pxstr) {
        return +pxstr.replace(/\D/g, "");
    };

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

	/**
	@title 过滤元素
	@param tags 标签 [string]
	*/
    exp.filter = function (tags) {
    	filterTags = tags.split(",");
    };

    //设置每一项grid
    exp.setItem = function (gridBox) {
    	var ds = gridBox.dataset;
    	var boxW = gridBox.offsetWidth + (ds.offsetX ? +ds.offsetX : 0);
    	var boxH = gridBox.offsetHeight + (ds.offsetY ? +ds.offsetY : 0);
    	var bs = getComputedStyle(gridBox, false);
    	//ui\-pintu$/.start(gridBox.className) && alert(bs.boxSizing);
    	if (bs.boxSizing=="box-border"){
    		boxW -= px(bs.borderRightWidth) + px(bs.borderLeftWidth) + px(bs.paddingLeft) + px(bs.paddingRight);
    		boxH -= px(bs.borderTopWidth) + px(bs.borderBottomWidth) + px(bs.paddingTop) + px(bs.paddingBottom);
    	}
    	var rowCount = 1;
    	var colCount = 1;
    	var gridExp = ds.grid.split(":");
    	if (/^(\d+)r$/i.test(gridExp[0])) {
    		rowCount = +RegExp.$1;
    	} else if (/^(\d+)c$/i.test(gridExp[0])) {
    		colCount = +RegExp.$1;
    	} else if (/^(\d+)\*(\d+)$/i.test(gridExp[0])) {
    		rowCount = +RegExp.$1;
    		colCount = +RegExp.$2;
    	}
    	var gridCount = rowCount * colCount;
        
    	var _childs = $gridBox.children();
    	var childs = [];
    	_childs.each(function (i) {
    		filterTags.indexOf(this.tagName.toLowerCase()) == -1 && childs.push(_childs.eq(i));
    	});

    	//去除外间距、边框、内边距
    	if (rowCount > 1 && colCount > 1) {
    		for (var i = 0; i < gridCount; i++) {
    			childs[i].css("float", "left");
    		}
    		var s = getComputedStyle(childs[0][0], null);
    		boxW -= (px(s.marginLeft) + px(s.marginRight))*colCount;
    		boxH -= (px(s.marginTop) + px(s.marginBottom))*rowCount;
    		if (s.boxSizing != "border-box") {
    			boxW -= (px(s.borderRightWidth) + px(s.borderLeftWidth) + px(s.paddingLeft) + px(s.paddingRight))*colCount;
    			boxH -= (px(s.borderTopWidth) + px(s.borderBottomWidth) + px(s.paddingTop) + px(s.paddingBottom))*rowCount;
    		}
    	} else {
    		for (var i = 0; i < gridCount; i++) {
    			childs[i].css("float","left");
    			var s = getComputedStyle(childs[i][0], null);
    			boxW -= px(s.marginLeft) + px(s.marginRight);
    			boxH -= px(s.marginTop) + px(s.marginBottom);
    			if (s.boxSizing != "border-box") {
    				boxW -= px(s.borderRightWidth) + px(s.borderLeftWidth) + px(s.paddingLeft) + px(s.paddingRight);
    				boxH -= px(s.borderTopWidth) + px(s.borderBottomWidth) + px(s.paddingTop) + px(s.paddingBottom);
    			}
    		}
    	}

    	var widths = this.getPartLen(boxW, colCount, gridExp[1]);
    	var heights = this.getPartLen(boxH, rowCount, gridExp[1]);
        var r, c;
        for (var i = 1; i <= gridCount; i++) {
            r = Math.ceil( i / colCount) - 1;
            c = Math.ceil(i / rowCount) - 1;
			childs[i - 1].width(widths[c]);
			childs[i - 1].height(heights[r]);
        }
    };

    /**
        @title 获取每一段的长度
        @param totalLen 总长度 number
        @param partCount 分段数 number
        @param splitExp 分度表达式 string
		@return array[number]
    */
    exp.getPartLen = function (totalLen, partCount, splitExp) {
        if (partCount>1 && splitExp) {
            var startCount = 0;
            var remainLen = totalLen;
            var a = splitExp.split(",").map(function (n, i) {
                if (n == "*") {
                    startCount++;
                } else {
                    if (/(\d+)\%/.test(n)) {
                        n = totalLen * (RegExp.$1 / 100);
                    }
                    remainLen -= n;
                }
                return n;
            });
            var startVal = remainLen / startCount;
            return a.map(function (n) {
                return n == "*" ? startVal : n;
            });
        } else {
            var val = totalLen / partCount;
            var a = [];
            for (var i = 0; i < partCount; i++) {
                a.push(val);
            }
            return a;
        }
    };
});