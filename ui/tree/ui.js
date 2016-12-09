define(function (req, exp) {
	"use strict";
    req("./ui.css");
    var $ = req("sys.jquery");

    var treeClass = function (ops) {
        this.data = ops.data;
        this.el = {};
        this.el.box = $(ops.container);
        this.speed = ops.speed || 500;
        this.init();

        if (ops.onItemClick) {
            this.el.box.find("span.item").css("cursor","pointer").click(function(){
                ops.onItemClick(this.innerHTML, this);
            });
        }
    };

    exports = treeClass.prototype = {};

    //初始化菜单
    exp.init = function () {
        this.htm = [];
        this.data.map(this.addItem.bind(this));
        this.htm = this.htm.join("");
        this.el.box.html(this.htm);

        var btns = ".sk-tree-group-first-add,.sk-tree-group-mid-add,.sk-tree-group-end-add";
        this.el.box.find(btns).click(this.chg.bind(this));
    };

    //添加项
    exp.addItem = function (item,i,a) {
        this.htm.push('<li>');
        this.htm.push('<div>');
        var pos, status;
        if (i == a.length - 1) {
            pos = "end";
        } else if (!this.isLoaded && i == 0) {
            this.isLoaded = true;
            pos = "first";
        } else {
            pos = "mid";
        }
        if (item.type == "group") {
            this.htm.push('<i class="sk-tree-group-'+pos+'-add"></i>');
        } else if (item.type == "item") {
            this.htm.push('<i class="sk-tree-item-'+pos+'"></i>');
        }
        this.htm.push('<b class="sk-tree-'+item.type+'"></b>');
        this.htm.push('<span class='+item.type+'>' + item.title + '</span>');
        this.htm.push('</div>');
        if (item.items && item.items.length > 0) {
            var cls = i<a.length-1 ? ' class="line"': '';
            this.htm.push('<ul'+cls+' data-open="0">');
            item.items.map(this.addItem.bind(this));
            this.htm.push('</ul>');
        }
        this.htm.push('</li>');
    };

    //切换状态
    exp.chg = function (xEvent) {
        var i = $(xEvent.target);
        var ul = i.parent().next();
        var isopen = +ul.data("open");
        if (isopen == 0) {
            i.attr("class", i.attr("class").replace("add", "sub"));
            ul.slideDown(this.speed, function () {
                ul.data("open", 1);
            });
        } else if (isopen == 1) {
            i.attr("class", i.attr("class").replace("sub", "add"));
            ul.slideUp(this.speed, function () {
                ul.data("open", 0);
            });
        }
    };

    module.exports = function (ops) {
        return new treeClass(ops);
    };

});