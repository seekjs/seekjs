
define(function(req, exp, mod){
    "use strict";
    var move = req("sys.lib.move");
    var $ = req("sys.lib.zepto");

    //上下折叠
    mod.exports = function(ops){
        var box = $(ops.box);
        var tab = $(ops.tab||ops.icon, box);
        var panel = $(ops.panel, box)[0];
        var icon = $(ops.icon, box)[0];

        var minH = 0;
        var maxH = ops.h || 0;
        [].forEach.call(panel.children, function(obj){
            var sty = getComputedStyle(obj);
            maxH += +sty.marginTop.replace("px","");
            maxH += +sty.borderTopWidth.replace("px","");
            maxH += +sty.paddingTop.replace("px","");
            maxH += +sty.height.replace("px","");
            maxH += +sty.paddingBottom.replace("px","");
            maxH += +sty.borderBottomWidth.replace("px","");
            maxH += +sty.marginBottom.replace("px","");
        });

        if(icon && ops.state=="open"){
            icon.style.transform = "rotate(90deg)";
            icon.style.webkitTransform = "rotate(90deg)";
        }

        $(tab).off().on("click", function(){
            var h = +getComputedStyle(panel).height.replace("px","");
            if(Math.ceil(h)==Math.ceil(maxH)){
                move(panel).set("height", minH).end();
                icon && move(icon).rotate(0).end();
            }else{
                move(panel).set("height", maxH).end();
                icon && move(icon).rotate(90).end();
            }
        });
    };

});
