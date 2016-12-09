define(function (req, exp) {
	"use strict";
	var $ = req("sys.jquery");
	var event = req("sys.event");

	
	var dt = new Date();
	var today = exp.today = {
		year: dt.getFullYear(),
		month: dt.getMonth() + 1,
		date: dt.getDate()
	};

	exp.ops = {
		box: ".sk-calendar-box",
		year: today.year,
		month: today.month,
		date: today.date,
		effect: "scroll-x",
		onItemClick: null
	};

	exp.el = {
		container: ".sk-calendar",
		ylist: ".sk-calendar-ylist",
		mlist: ".sk-calendar-mlist",
		dlist: ".sk-calendar-dlist",
		left: ".sk-calendar-left",
		right: ".sk-calendar-right"
	};

	//日历控件
	exp.Class = function (ops) {
		uibase.init(this, ops);
		this.ym = [this.year, this.month];
		this.box = $(this.box);
		this.draw();
	};
	
	//设置年份
	exp.setYear = function(ctx){
		this.year = +ctx.element.value;
		this.ym = [this.year, this.month];
		this.date = 0;
		this.draw();
	};

	//设置月份
	exp.setMonth = function (ctx, flag) {
		//上一月/下一月
		if (flag) {
			this.ym = this.getYm(this.year, this.month, +flag);
			this.year = this.ym[0];
			this.month = this.ym[1];
			/*
			this.month = +flag + this.month;
			if(this.month==0){
				this.month = 12;
				this.year--;
			}else if(this.month==13){
				this.month = 1;
				this.year++;
			}
			*/
		}else{
			this.month = +ctx.element.value;
		}

		this.date = 0;
		this.draw();
	};

	//获取上/下个年月
	exp.getYm = function (y,m,flag) {
		var y = this.year;
		var m = this.month;
		m += flag;
		if(m==0){
			m = 12;
			y--;
		}else if(m==13){
			m = 1;
			y++;
		}
		return [y, m];
	};


	//绘制
	exp.draw = function () {
		this.prevYm = this.getYm(this.year, this.month, -1);
		this.nextYm = this.getYm(this.year, this.month, +1);

		this.day = new Date(this.year, this.month - 1, 1).getDay();
		this.days = new Date(this.year, this.month, 0).getDate();
		this.box.html(this.getHTML(this));
		seekjs.mergeObj(this, { el: {}}, {el:el}, $);
		this.box = $(this.box);
		this.render(this.box);


		if (this.onItemClick) {
			var me = this;
			this.el.dlist.find("li").each(function (i,obj) {
				var n = +obj.innerHTML;
				n && obj.addEventListener("click", function () {
					me.onItemClick(me.year, me.month, n);
				}, false);
			});
		}
	};
	
});