/**
 * 页面切换效果
 */

//针对seajs
define(function (req, exp) {
    "use strict";
    var $ = req("sys.query_new");
    var move = req("sys.lib.move");

    //初始化
    exp.init = function (app) {
        exp.$box = app.$container;
        exp.box = app.container;
        exp.boxWidth = app.boxWidth;
        exp.boxHeight = app.boxHeight;

        exp.$box.css("position","relative").css("minHeight","100%").width(exp.boxWidth);
        //exp.setPanelStyle(exp.box.children[0]);
        exp.box.children[0] && exp.setPanelStyle(exp.box.children[0]);
    };

    //设置面板样式
    exp.setPanelStyle = function (obj) {
        $(obj).css("position","absolute").css("minHeight","100%").left(0).top(0).width(exp.boxWidth);
    };

    //移动
    exp.move = function (oldPanel, newPanel, dir, aniDuration, callback) {
        var $oldPanel = $(oldPanel);
        var $newPanel = $(newPanel);
        exp.setPanelStyle(oldPanel); //新增,防止花屏
        exp.setPanelStyle(newPanel);

        if(dir=="forward") {
            $oldPanel.left(0);
            $newPanel.left(exp.boxWidth);
        }else if(dir=="back") {
            $oldPanel.left(exp.boxWidth);
            $newPanel.left(0);
        }

        var startX = ({forward: 0, back: -exp.boxWidth})[dir];
        var endX = ({forward: -exp.boxWidth, back: 0})[dir];

        exp.$box.width(exp.boxWidth * 2).attr("scrollTop",0)//.height(exp.boxHeight);
        //app.usegrid && grid.use(view.ui);
        move(exp.box).duration(0).x(startX).end(function () {
            move(exp.box).duration(aniDuration).x(endX).end(function () {
                /*
                $oldPanel.remove();
                */
                //为避免操作过快引起的bug,改为批量删除
                $(exp.box.children).dataset("status","del");
                $newPanel.dataset("status","old");
                $("[data-status=del]",exp.box).remove();

                $newPanel.left(0);
                move(exp.box).duration(0).x(0).end();
                exp.$box.width(exp.boxWidth);
                if(newPanel.style.height!="100%"){
                    //exp.$box.height(newPanel.scrollHeight);
                }
                callback && callback();
            });
        });
    };
});