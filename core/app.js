/**
 * seekApp - 前端轻量级MVC框架
 * Created by likaituan on 14/8/18.
 */

//针对seajs
define(function (req, app) {
    "use strict";
    var db = req("sys.data_bind");
    var event = req("sys.event");
    var env = req("sys.env");
    var tp = req("sys.template");
    var transfer = req("sys.transfer");
    var filter = req("sys.filter");
    var $ = req("sys.lib.zepto");

    var context = {};
    var subviewList = [];
    var pluginList = ["sys.ui.mask","sys.ui.dialog","sys.ui.tip"];
    var prevUri = null;

    app.lang = "zh-cn";
    app.useStyle = true;
    app.viewEx = {};
    app.formatEx = {};
    app.plugin = {};
    app.usegrid = true;
    app.useAnimate = false;
    app.aniDuration = 1000;
    app.aniIsPlaying = false;
    app.ext = {
        js: "",
        tp: ".html",
        st: ".css"
    };
    app.midLines = [];
    app.path = {};

    app.langList = {};
    app.langName = "";
    app.lang = {};

    //设置语言(默认中文)
    app.setLang = function (ops) {
        app.langList = filter.langList = ops.list;
        app.switchLang(ops.index);
    };

    //切换语言
    app.switchLang = function (key) {
        app.langName = filter.langName = key;
        app.lang = filter.lang = app.langList[key];
    };

    //设置路径(默认当前路径)
    app.setPath = function (key, path) {
        if(!path){
            path = key;
            key = "main";
        }
        //key = key.replace(/\{\w+\}/g,"-");
        var newPath = {};
		var pathAlias = {
			controller: "js",
			view: "tp",
            style: "st"
		};
		for(var k in path){
			newPath[pathAlias[k]||k] = path[k];
		}
		app.path[key] = newPath;
    };

    //获取路径
    app.getPath = function(ops, _type){
        var file = ops.path;
        if(/^sys\.ui\.\w+$/.test(file)){
            return file + app.ext[_type];
        }
        var a = app.midLines.slice();
        var path = app.path[ops.dir][_type];
        path = path.replace(/\/\-\//g, function(){return "/"+a.shift()+"/"});
        return path + file + app.ext[_type];
    };

    //加载样式
    app.loadStyle = function(cssFile){
        var head = document.querySelector("head");
        if(!dom) {
            var dom = document.createElement("link");
            dom.href = cssFile;
            dom.type = "text/css";
            dom.rel = "stylesheet";
            head.appendChild(dom);
        }
    };


    //程序初始化
    app.init = function (page, container) {
        app.inipage = page;
	    filter.mergeObj(filter, app.filterEx);

        if (container){
            app.container = document.querySelector(container);
        } else {
            app.container = document.createElement("div");
            document.body.appendChild(app.container);
        }
        app.boxWidth = (window.innerWidth > 0 && window.innerWidth<screen.width) ? window.innerWidth : screen.width;//document.body.offsetWidth;
        app.boxHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        app.$container = $(app.container);
        app.useAnimate && transfer.init(app);

        if(location.hash){
            page = location.hash.replace("#","");
        }

        if(!window.onhashchange) {
            window.onhashchange = function (o) {
                if(app.isTry){
                    app.isTry = false;
                }else {
                    app.nextUri = o.newURL.split("#")[1] || app.inipage;
                    !app.aniIsPlaying && app.go2(app.nextUri);
                }
            };
        }

        //增加错误处理
        if(app.errpage) {
            seekjs.onLoadErr = function (file) {
                if (/^ctrl\.\w+$/.test(file)) {
                    app.go(app.homepage);
                }
            };
        }

        app.loadPlugin(function(){

            //弹出提示框
            app.tip = function(){
                app.plugin.tip.showTip.apply(app.plugin.tip, [].slice.call(arguments));
            };

            //弹出框
            app.alert = function(){
                app.plugin.dialog.alert.apply(app.plugin.dialog, [].slice.call(arguments));
            };

            //确认框
            app.confirm = function(){
                app.plugin.dialog.confirm.apply(app.plugin.dialog, [].slice.call(arguments));
            };

            //显示遮罩层
            app.showMask = function(){
                app.plugin.mask.showMask.apply(app.plugin.mask, [].slice.call(arguments));
            };

            //隐藏遮罩层
            app.hideMask = function(){
                app.plugin.mask.hide();
            };

            app.go2(page);
        });
    };

    //主view之间的跳转
    //go 可传多个参数
    app.go = function (page) {
        page = filter.stringFormat.apply(filter, [].slice.call(arguments));
        prevUri = location.hash.replace("#","");
        //location.hash = "#" + page;
        app.isTry = true;
        app.go2(page);
    };

    //页面Hash改变的时候触发的
    var act = "";
    app.go2 = function (page) {
        app.nextUri = null;
        page = decodeURI(page)
        context = {};
        app.loadView({
            parent: null,
            box: app.container,
            type: "main",
            uri: page
        });
    };

    //返回上页
    app.back = function (step) {
        step = step || 1;
        if(step>1){
            history.go(-step);
        }else{
            history.back();
        }
    };

    //加载View
    app.loadView = function (ops) {
        var params = ops.uri.split("/");
        ops.dir = "main";
        app.midLines = [];
        for(var k in app.path){
            if(k!="main") {
                var ks = k.split("/");
                var ps = params.slice();
                //var pn = ops.pathname;
                for (var i = 0; i < ks.length; i++) {
                    var pn = ps.shift();
                    if (ks[i] == "-" || ks[i] == pn) {
                        ks[i] == "-" && app.midLines.push(pn);
                    } else {
                        break;
                    }
                }
                if (i == ks.length) {
                    ops.dir = k;
                    ops.path = ps.shift();
                    params = ps;
                    break;
                }
            }
        }
        if(ops.dir=="main") {
            ops.path = params.shift();
        }
        /*
        if(app.path[ops.pathname]){
            app.key = ops.pathname;
            ops.pathname = params.shift();
        }else if(app.path[ops.pathname+"/-"]){
            app.key = ops.pathname + "/-";
            app.val = params.shift();
            ops.pathname = params.shift();
        }
        */
        var jsFile = app.getPath(ops, "js");
        req(jsFile, function (view) {
            if (view) {
                filter.mergeObj(view, ops);
                filter.mergeObj(view, app.viewEx);
                view.id = ops.id || ops.pathname;
                view.dir = ops.dir;
				view.uri = ops.uri;

                view.tip = app.tip;
                view.alert = app.alert;
                view.confirm = app.confirm;
                view.showMask = app.showMask;
                view.hideMask = app.hideMask;

                view.switchLang = function(key){
                    app.switchLang(key);
                    view.render();
                };

                view.paramType = view.paramType || "double";

                if(view.paramType=="single"){
                    view.params = params;
                }
                else if(view.paramType=="double"){
                    if(params.length==1) {
                        view.params = {id: params[0]};
                    }
                    else{
                        view.params = filter.deserialize(params);
                    }
                }
                app.parseView(view);
            }
        });
    };

    //解析视图
    app.parseView = function (view) {
        if(view.type=="main"){
            app.rootView = view;
        }else if(view.type=="sub"){
            view.parent[view.id] = view;
        }else if (view.type=="plugin"){
            app.plugin[view.id] = view;
        }
		view.root = app.rootView;

        view.render = function () {
            act = "";
            app.parseTemplate(view);
        };
        view.up2model = function (index) {
            db.up2model(view.ui, view, index);
        };
        view.go = function (page) {
            var args = [].slice.call(arguments);
            return app.go.apply(app, args);
        };
        view.back = function (page) {
            var args = [].slice.call(arguments);
            app.back.apply(app, args);
        };
        view.show = function(){
            view.box.dataset.show = true;
            view.box.style.display = "block";
        };
        view.hide = function(){
            view.box.dataset.show = false;
            view.box.style.display = "none";
        };
        view.toggle = function(){
            view.box.toggle();
        };
        app.initView(view);
    };

    //统一初始化view
    app.initView = function(view){
        if (app.onViewInit) {
            if (app.onViewInit.length == 2) {
                app.onViewInit(view, function () {
                    app.initCurrentView(view);
                });
            } else {
                app.onViewInit(view) && app.initCurrentView(view);
            }
        } else {
            app.initCurrentView(view);
        }
    };

    //初始化当前view
    app.initCurrentView = function(view){
        view.from = prevUri;
        if (view.onInit) {
            if(view.onInit.length==0) {
                view.onInit();
                app.chkStyle(view);
            }else if(view.onInit.length==1) {
                view.onInit(function(){
                    app.chkStyle(view);
                });
            }
        } else {
            app.chkStyle(view);
        }
    };

    //检查样式
    app.chkStyle = function(view){
        if(view.cssFile!="none"){
			if(app.path[view.dir].st || /^sys\.ui\./i.test(view.id)){
				var cssFile = view.cssFile || app.getPath(view, "st");
				cssFile = seekjs.resolve(cssFile);
				app.loadStyle(cssFile, view.parent);
			}
        }
        app.chkTemplate(view);
    };

    //修复IOS下微信Title不更新的Bug
    app.repairTitle = function(){
        var $body = $('body');
        var $iframe = $('<iframe src = "/favicon.ico"></iframe>').on('load', function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0)
        }).appendTo($body);
    };

    //检查模板
    app.chkTemplate = function (view) {
        if(view.type=="main") {
            if(app.isTry) {
                location.hash = "#" + encodeURI(view.uri);
            }
            if(view.title){
                document.title = view.title;
                app.useRepair && app.repairTitle();
            }
            filter.view = view; //注意$.view只能用在主view上

            var ps = JSON.parse(sessionStorage.seekjs_app_pages || '[]');
            var index = ps.indexOf(view.uri);
            act = "forward";
            if (index > -1) {
                if(index==ps.length-2) {
                    act = "back";
                }
                ps = ps.slice(0, index);
            }
            ps.push(view.uri);
            sessionStorage.seekjs_app_pages = JSON.stringify(ps);
        }

        if (view.getTemplate || view.getHTML || view.templateHTML) {
            app.parseTemplate(view);
        } else {
            view.templateFile!="none" && app.loadTemplate(view);
        }
    };

    //加载模板
    app.loadTemplate = function (view) {
        var templateFile = view.templateFile || app.getPath(view, "tp");
        templateFile = seekjs.resolve(templateFile);
        $.ajax({
            type: "get",
            dataType: "text",
            url: templateFile,
            success: function (code) {
                view.templateHTML = code;
                view.getTemplate = null;
                view.getHTML = null;
                app.parseTemplate(view);
            },
            error: function (e) {
                throw templateFile + " is no exist";
            }
        });
    };


    //解析模板
    app.parseTemplate = function (view) {
        if (!view.getTemplate) {
            view.getTemplate = tp.getFun(view.templateHTML);
        }
        if (!view.getHTML) {
            view.getHTML = tp.compileFun(view.getTemplate);
        }

        var html = view.getHTML(view.model || view.root.model || view);
        var div = document.createElement("div");
        div.innerHTML = html;
        if (div.children.length == 1) {
            if (app.useAnimate && view.type == "main" && act && view.box.children.length > 0) {
                view.box.appendChild(div.children[0]);
                app.setUI(view, view.box.children[1]);
                transfer.move(view.box.children[0], view.ui, act, app.aniDuration, function(){
                    if(app.nextUri){
                        app.go2(nextUri);
                    }else {
                        app.parseTemplate2(view);
                    }
                });
            }else {
                view.box.innerHTML = html;
                app.setUI(view, view.box.children[0]);
                app.parseTemplate2(view);
            }
        }else{
            throw "模板有且仅有一个顶级元素";
        }
    };

    //设置UI
    app.setUI = function(view, ui){
        view.ui = ui;
        view.$ui = $(ui);
        view.$ui.css("overflow")=="hidden" && view.$ui.height(app.boxHeight);
        //app.usegrid && grid.use(view.ui); 暂时去掉
    };

    //解析模板2
    app.parseTemplate2 = function (view) {
        //新加功能
        view.box.dataset.show && view.box.dataset.show==="false" && view.hide();

        //解析el元素
        /*
        if (view.el) {
            for (var i in view.el) {
                var queryStr = typeof (view.el[i]) == "string" ? view.el[i] : view.el[i].selector;
                view.el[i] = view.ui.querySelector(queryStr);
            }
        }
        */

        view.pop = {};
        [].forEach.call(view.ui.querySelectorAll("[data-pop]"), function(obj){
            var o = view.pop[obj.dataset.pop] = {};
            o.box = obj;
            app.addCommon(o);
        });

        [].forEach.call(view.ui.querySelectorAll("[data-part]"), function(obj){
            app.setPart(obj, view);
        });

        event.parse(view.ui, view);
        db.parseBind(view.ui, view);

        app.onViewRender && app.onViewRender(view);
        view.onRender && view.onRender();

        //延时
        window.setTimeout(function () {
            //app.usegrid && grid.use(view.ui);
            app.onLoad && app.onLoad(view);
            view.onLoad && view.onLoad();

            [].forEach.call(view.ui.querySelectorAll("[data-view]"), function (obj) {
                subviewList.push([view,obj]);
            });
            app.loadSubView();
        }, 0);
    };

    //加载子页面
    app.loadSubView = function () {
        var a = subviewList.shift();
        if (a) {
            var parentView = a[0];
            var box = a[1];
            app.loadView({
                parent: parentView,
                box: box,
                type: "sub",
                id: box.id || box.dataset.view.split("/")[0], //有些不妥
                uri: box.dataset.view,
                dataset: box.dataset
            });
        }
    };

    //使用插件
    app.usePlugin = function(plugin){
        pluginList.push(plugin);
    };

    //加载插件
    app.loadPlugin = function (callback) {
        var plugin = pluginList.shift();
        if(plugin) {
            var pluginId = plugin.match(/\w+$/)[0];
            if (app.plugin[pluginId]) {
                return callback(app.plugin[pluginId]);
            }
            var jsFile = plugin;// + ".js";
            req(jsFile, function (o) {
                if(o.cssFile != "none") {
                    var cssFile = seekjs.resolve(plugin+".css");
                    if(o.mediaStyle){
                        cssFile = cssFile.replace(/\.css$/, "_"+env.mediaMode+".css");
                    }
                    app.loadStyle(cssFile);
                }
                app.addCommon(o);
                o.box = document.createElement("div");
                o.$box = $(o.box);
                o.box.style.cssText = "position:absolute; left:0; top:0; z-index:99999;";
                document.body.appendChild(o.box);
                o.render = function () {
                    o.box.innerHTML = o.getTemplate.call(o.model||o, $);
                    event.parse(o.box, o);
                    db.parseBind(o.box, o.model||o);
                };
                app.plugin[pluginId] = o;

                app.loadPlugin(callback);
            });
        }else{
            callback();
        }
    };

    //设置分段
    app.setPart = function (obj, view) {
        var partId = obj.dataset.part;
        var o = view[partId] = {};
        app.addCommon(o);
        o.id = partId;
        o.box = obj;
        o.parent = view;
        o.getHTML = function(){
            var html = view.getHTML(view.model||view);
            var div = document.createElement("div");
            div.innerHTML = html;
            html = div.querySelector('[data-part='+ o.id +']').innerHTML;
            div = null;
            return html;
        };
        o.render = function(){
            o.box.innerHTML = o.getHTML();
            event.parse(o.box, view);
            db.parseBind(o.box, view);
            view.onPartRender && view.onPartRender(o);

            /*新增功能:Part也能嵌入子View*/
            [].forEach.call(o.box.querySelectorAll("[data-view]"), function (obj) {
                subviewList.push([view,obj]);
            });
            app.loadSubView();

            return o;
        };
    };

    //继承公用属性和方法
    app.addCommon = function(o){
        o.root = app.rootView;

        //显示
        o.show = function(){
            o.box.style.display = "block";
            return o;
        };

        //隐藏
        o.hide = function(){
            o.box.style.display = "none";
            return o;
        };
    };

});
