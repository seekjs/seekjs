/**
 * seekJs底层动画库
 * Created by likaituan on 15/10/15.
 */

define(function(req, exp, mod){
    "use strict";

    mod.exports = function(obj){
        return {
            cb: null,

            //设置动画时间
            duration: function(time){
                if(obj.style.transitionDuration!==undefined) {
                    obj.style.transitionDuration = time + "ms";
                }else{
                    obj.style.webkitTransitionDuration = time + "ms";
                }
                return this;
            },

            //设置位移
            translate: function(x,y){
                if(obj.style.transform!==undefined) {
                    obj.style.transform = "translate(" + x + "px," + y + "px)";
                }else{
                    obj.style.webkitTransform = "translate("+x+"px,"+y+"px)";
                }
                return this;
            },

            //设置横向滚动
            translateX: function(x){
                if(obj.style.transform!==undefined) {
                    obj.style.transform = "translateX("+x+"px)";
                }else{
                    obj.style.webkitTransform = "translateX("+x+"px)";
                }
                return this;
            },

            //设置纵向滚动
            translateY: function(y){
                if(obj.style.transform!==undefined) {
                    obj.style.transform = "translateY("+y+"px)";
                }else{
                    obj.style.webkitTransform = "translateY("+y+"px)";
                }
                return this;
            },

            //动画结束
            end: function(callback){
                var me = this;

                if(obj.style.transition!==undefined) {
                    this.cb && obj.removeEventListener("transitionend", this.cb, true);
                    obj.addEventListener("transitionend",callback);
                }else{
                    this.cb && obj.removeEventListener("webkitTransitionEnd", this.cb, true);
                    obj.addEventListener("webkitTransitionEnd",callback);
                }

                this.cb = callback;
                /*
                if(obj.style.transition!==undefined) {
                    !obj.onTransitionend && obj.addEventListener("transitionend", function(){
                        me.cb && me.cb();
                    });
                }else{
                    !obj.onWebkitTransitionEnd && obj.addEventListener("webkitTransitionEnd", function(){
                        me.cb && me.cb();
                    });
                }
                */
                return this;
            }
        };


        /*
        return {
            duration:function(){
                return this;
            },
            translateX: function(){
                return this;
            },
            end: function(cb){
                cb && cb();
            }
        };
        */

        /*
        var type = obj.style.transform!==undefined && obj.style.transition!==undefined ? "ecma" : "webkit";
        alert([obj.style.transform===undefined, obj.style.transition===undefined, type]);
        if(type=="ecma"){
            return {
                //设置动画时间
                duration: function(time){
                    obj.style.transitionDuration = time + "ms";
                    return this;
                },
                //设置位移
                translate: function(x,y){
                    obj.style.transform = "translate("+x+"px,"+y+"px)";
                    return this;
                },
                //设置横向滚动
                translateX: function(x){
                    obj.style.transform = "translateX("+x+"px)";
                    return this;
                },
                //设置纵向滚动
                translateY: function(y){
                    obj.style.transform = "translateY("+y+"px)";
                    return this;
                },
                //动画结束
                end: function(callback){
                    obj.addEventListener("transitionend",callback);
                    return this;
                }
            }
        }

        if(type=="webkit"){
            return {
                //设置动画时间
                duration: function(time){
                    obj.style.webkitTransitionDuration = time + "ms";
                    return this;
                },
                //设置位移
                translate: function(x,y){
                    obj.style.webkitTransform = "translate("+x+"px,"+y+"px)";
                    return this;
                },
                //设置横向滚动
                translateX: function(x){
                    obj.style.webkitTransform = "translateX("+x+"px)";
                    obj.style.WebkitTransform = "translateX("+x+"px)";
                    return this;
                },
                //设置纵向滚动
                translateY: function(y){
                    obj.style.webkitTransform = "translateY("+y+"px)";
                    return this;
                },
                //动画结束
                end: function(callback){
                    obj.addEventListener("webkitTransitionEnd",callback);
                    obj.addEventListener("WebkitTransitionEnd",callback);
                    return this;
                }
            }
        }

        throw "您的浏览器不支持CSS3动画";*/
    };

});
