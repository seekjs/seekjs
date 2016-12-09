define(function (req, exp) {
	"use strict";
	req("./ui.css");
    var $ = req("sys.jquery");

	//默认值
    var defaults = {
    	box: ".ui-slides",
    	left: ".ui-slides-left",
    	right: ".ui-slides-right",
    	up: ".ui-slides-up",
    	down: ".ui-slides-down",
    	tab: ".ui-slides-tab",
    	panel: ".ui-slides-panel",
    	panelInner: ".ui-slides-panelInner",

    	dir: "h",
    	speed: 1000,		//每次滚动的时间
    	delay: 3000,		//滚动间隔时间
    	loop: false,		//是否无间断
    	autoplay: false,	//是否自动播放
    	hover: false		//是否鼠标悬停
    };

    var slidesClass = function (ops) {
    	var me = this;
    	ops = ops || defaults;
    	this.isplaying = false;
    	this.speed = ops.speed || defaults.speed;
    	this.delay = ops.delay || defaults.delay;
    	this.loop = ops.loop || defaults.loop;
    	this.dir = ops.dir || defaults.dir;
    	this.autoplay = ops.autoplay || defaults.autoplay;
    	this.hover = ops.hover || defaults.hover;
    	this.box = $(ops.box || defaults.box);
    	this.btn = {
    		left: this.box.find(ops.left || defaults.left),
    		right: this.box.find(ops.right || defaults.right),
    		up: this.box.find(ops.up || defaults.up),
    		down: this.box.find(ops.down || defaults.down)
    	};
    	this.tab = this.box.find(ops.tab || defaults.tab);
    	this.panel = this.box.find(ops.panel || defaults.panel);
    	this.panelInner = this.box.find(ops.panelInner || defaults.panelInner);
    	this.panel.css("position", "relative");
    	this.panelInner.css("position", "absolute");
    	var childs = this.panelInner.children("li");
    	var item = childs.eq(0);
    	var count = childs.length;
    	var icount = count;
    	if (this.loop) {
    		childs.each(function () {
    			me.panelInner.append(this.cloneNode());
    		});
    		icount *= 2;
    	}
    	if (this.dir == "h") {
    		this.stepX = item.outerWidth() + item.css("margin-left").replace("px", "") * 1 + item.css("margin-right").replace("px", "") * 1;
    		this.boxLen = this.panel.width();
    		this.len = this.stepX * icount;
    		this.panelInner.width(this.len).css("left", 0);
    		this.x = +this.panelInner.css("left").replace("px", "");
    		this.minX = Math.min(0, this.boxLen - this.len);
    		this.midX = this.stepX * count * -1;
    	} else {
    		this.stepY = item.outerHeight() + item.css("margin-top").replace("px", "") * 1 + item.css("margin-bottom").replace("px", "") * 1;
    		this.boxLen = this.panel.height();
    		this.len = this.stepY * icount;
    		this.panelInner.height(this.len).css("top", 0);
    		this.y = +this.panelInner.css("top").replace("px", "");
    		this.maxY = Math.min(0, this.boxLen - this.len);
    		this.midY = this.stepY * count * -1;
    	}
    	for (var k in this.btn) {
    		(function (dir) {
    			if (me.btn[dir].length > 0) {
    				me.btn[dir].click(function () {
    					me["scroll2" + dir]();
    				});
    			}
    		})(k);
    	}
    	this.hover && this.panel.hover(function () { me.state = "over"; }, function () { me.state = "out"; });
    	this.timer = null;
    	this.state = "out";

    	if (this.autoplay && this.len > this.boxLen) {
    		this.timer = window.setInterval(function () {
    			me.state == "out" && me.scroll2next();
    		}, this.delay + this.speed);
    		this.scroll2next();
    	}
    };

    slidesClass.prototype = {
    	//向前滚动
    	scroll2prev: function () {
    		this.dir == "h" ? this.scroll2left() : this.scroll2up();
    	},
    	//向后滚动
    	scroll2next: function () {
    		this.dir == "h" ? this.scroll2right() : this.scroll2down();
    	},
    	//向左滚动
    	scroll2left: function () {
    		var me = this;
    		if (!this.isplaying) {
    			if (this.loop || this.x < 0) {
    				if (this.x == 0) {
    					this.x = this.midX;
    					this.panelInner.css("left", this.midX + "px");
    				}
    				this.x += this.stepX;
    				this.isplaying = true;
    				this.panelInner.animate({ left: this.x + 'px' }, this.speed, function () { me.isplaying = false; });
    			}
    		}
    	},
    	//向右滚动
    	scroll2right: function () {
    		var me = this;
    		if (!this.isplaying) {
    			if (this.loop || this.x > this.minX) {
    				if (this.x == this.midX) {
    					this.x = 0;
    					this.panelInner.css("left", 0);
    				}
    				this.x -= this.stepX;
    				this.isplaying = true;
    				this.panelInner.animate({ left: this.x + 'px' }, this.speed, function () { me.isplaying = false; });
    			}
    		}
    	},
    	//向上滚动
    	scroll2up: function () {
    		var me = this;
    		if (!this.isplaying && this.y > 0) {
    			this.y += this.stepY;
    			this.panelInner.animate({ top: this.y + 'px' }, this.speed, function () { me.isplaying = false; });
    		}
    	},
    	//向下滚动
    	scroll2down: function () {
    		var me = this;
    		if (!this.isplaying && this.y < this.maxY) {
    			this.y -= this.stepY;
    			this.panelInner.animate({ top: this.y + 'px' }, this.speed, function () { me.isplaying = false; });
    		}
    	}
    };

    module.exports = function (ops) {
    	return new slidesClass(ops);
    };

});