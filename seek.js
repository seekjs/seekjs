/**
 * seekJs - 前端轻量级模块化组件
 * Created by likaituan on 14/8/18.
 */

~function (window, undefined) {
	"use strict";
	var seekjs = window.seekjs = {};

	seekjs.ns = {};
	seekjs.paths = {};
	seekjs.alias = {};

	seekjs.config = function (ops) {
		seekjs.paths = ops.paths || {};
		seekjs.alias = ops.alias || {};
		seekjs.ns = ops.ns || {};
		if(ops.packages){
			ops.packages.forEach(function(item){
				seekjs.paths[item.name] = item.location;
				seekjs.alias[item.name] = item.location + "/" + (item.main||"main");
			});
		}
	};

    //是否纯对象
    seekjs.isPlain = function(v){
        return typeof(v)=="object" && !Array.isArray(v);
    };

    //字符串格式化
    seekjs.format = function (str, _obj) {
        if(arguments.length==1){
            return str;
        }else if(arguments.length==2 && seekjs.isPlain(_obj)){
            return str.replace(/\{(\w+)\}/g, function (_, key) {
                return _obj[key];
            });
        }else{
            var arr = [].slice.call(arguments, 1);
            return str.replace(/\{(\d+)\}/g, function (_, n) {
                return arr[n];
            });
        }
    };

	//获取相对于当前页面的绝对路径
	seekjs.resolve = function (file, path) {
		return parsePath(file, path || seekjs.rootPath);
	};

	//编译
	/*
		url 绝对路径
	 */
	var compile = function (mod) {
        if (!mod.exports) {
            if (typeof mod.factory == "function") {
                var ret = mod.factory(mod.require.bind(mod), mod.exports = {}, mod);
                mod.exports = ret || mod.exports;
            } else {
                mod.exports = mod.factory;
            }
        }
        return mod.exports;
	};

	//定义模块函数
	var modules = seekjs.modules = {};
	var waitings = [];
	var currentUri = "";
	var callers = {};
	window.define = function (id, deps, factory) {
        if (arguments.length == 2){
            factory = deps;
            deps = [];
            id = id;
        }else if (arguments.length == 1) {
            factory = id;
            deps = [];
            id = currentUri;
        }
        if(arguments.length>1){
            id = seekjs.resolve(id); //可能不太严谨, 先这样吧
        }
        var mod = modules[id];
        mod.id = id || mod.uri;
        mod.factory = factory;

        factory.toString().replace(/(?:require|req)\(["'](.+?)["']\)/g, function (_, uri) {
            uri = mod.resolve(uri);
            var _mod = iniModule(uri, mod.uri);
            mod.deps.push(_mod);
        });
        waitings = waitings.concat(mod.deps);
	};
	window.define.amd = false;
	window.define.cmd = true;

	//从头开始剪除队列
	var cutQueue = function () {
		var mod = waitings.shift();
		if (mod) {
			loadModule(mod);
		} else {
			loadEnd();
		}
	};

	//加载结束
	var loadEnd = function () {
        var sourceExports = sourceModules.map(function (mod) {
            var exp = compile(mod);
            if(!exp) {
                throw seekjs.format("模块{id} 返回值不对", mod);
            }
            return exp;
        });
        /*
        for (var u in modules) {
            modules[u].callers = callers[u];
        }
        */
        var callbackFun = callbacks[timestamp];
        typeof(callbackFun)=="function" && callbackFun.apply(null, sourceExports);
	};

    //加载模块
    var loadModule = function (mod) {
        if (mod.exports) {
            return cutQueue();
        }

        //成功回调
        var onSuccess = function (rs) {
            if(rs && rs.type=="text") {
                if (/\.json$/i.test(mod.uri)) {
                    rs.text = JSON.parse(rs.text);
                }
                mod.exports = rs.text;
            }
            cutQueue();
        };

        //失败回调
        var onError = function (rs) {
            var id = mod.id;
            /*
            var message = "未找到模块 " + id;
            if (callers[id]) {
                message = id + " is no found, the caller is : \n" + callers[id].join("\n");
            }
            */
            var message = id + " is no found, the caller is : \n" + mod.parentUri;

            if(seekjs.onLoadErr) {
                console.warn(message);
                seekjs.onLoadErr(id);
            }else{
                throw message;
            }
        };

        var url = mod.uri;
        if (/\.css$/.test(url)) {
			seekjs.loadCss(url, onSuccess, onError);
        }
        else if (/\.(?:htm|html|txt|json)$/.test(url)) {
            seekjs.loadText(url, onSuccess, onError);
        }
        else {
            currentUri = url;
            seekjs.loadJs(url, onSuccess, onError);
        }
    };

	//加载JS文件(不重复加载)
	var isLoadedJs = {};
	seekjs.loadJs = function (url, onSuccess, onError) {
        var rs = {
            type: "js",
            url: url
        };
        if (isLoadedJs[url]) {
            return onSuccess && onSuccess(rs);
        }
        isLoadedJs[url] = true;
		var dom = document.createElement("script");
		dom.src = url;
        dom.onload = function(){
            onSuccess && onSuccess(rs);
        };
        dom.onerror = function (e) {
            if(onError){
                rs.error = e;
                return onError(rs);
            }
            throw css + " is no found";
        };
        head.appendChild(dom);
	};

    //加载CSS文件(不重复加载)
    var isLoadedCss = {};
    seekjs.loadCss = function (url, onSuccess, onError) {
        if (isLoadedCss[url]) {
            return onSuccess && onSuccess();
        }
        isLoadedCss[url] = true;
        var dom = document.createElement("link");
        dom.href = url;
        dom.rel = "stylesheet";
        dom["type"] = "text/css";
        head.appendChild(dom);
        var rs = {
            type: "css",
            url: url
        };
        dom.onload = function(){
            onSuccess && onSuccess(rs);
        };
        dom.onerror = function (e) {
            if(onError){
                rs.error = e;
                return onError(rs);
            }
            throw url + " is no found";
        }
    };

    //加载文本文件
    seekjs.loadText = function (url, onSuccess, onError) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var rs = {
                    type: "text",
                    url: url,
                    error: "",
                    status: xhr.status,
                    text: xhr.responseText
                };
                if (xhr.status == 200 || xhr.status == 0) {
                    onSuccess && onSuccess(rs);
                } else {
                    if(onError){
                        return onError(rs);
                    }
                    throw url + " is load error, status:" + xhr.status;
                }
            }
        };
        xhr.send("");
    };

    //初始化模块
    var iniModule = function(uri, parentUri) {
        /*
         callers[uri] = callers[uri] || [];
         callers[uri].push(id);
         */
        var mod = modules[uri];
        if (!mod){
            mod = modules[uri] = {
                uri: uri,
                parentUri: parentUri,
                resolve: function (uri) {
                    return parsePath(uri, this.uri);
                },
                require: function (uri, callback) {
                    if (callback) {
                        seekjs.require(uri, callback);
                    } else {
                        var fullUri = this.resolve(uri);
                        var _mod = modules[fullUri];
                        return compile(_mod);
                    }
                },
                deps: [],
                callers: []
            };
            mod.id = mod.uri;
        }
        return mod;
    };

	//路径解析
	var fullUriList = {};
	var parsePath = function (uri, path) {
        path = path || "";
        if(path) {
            path = path.replace(/#.+$/, "").replace(/[^\/]+$/, "");
        }
		var fullUri;
		//远程路径
		if (/^(?:https?|file):\/\//i.test(uri)) {
			fullUri = uri;
			//别名路径
		} else if (seekjs.alias[uri]) {
			fullUri = seekjs.alias[uri];
			//当前路径
		} else if (/^\.\//.test(uri)) {
			fullUri = path + uri.replace("./", "");
			//上层路径
		} else if (/^\.\.\//.test(uri)) {
			var newUri = uri.replace(/\.\.\//g, function () {
				path = path.replace(/\w+\/$/, "");
				return "";
			});
			fullUri = path + newUri;
			//绝对路径
		} else if (/^\//.test(uri)) {
			fullUri = path.replace("", "") + uri; //未完成
            //页面路径
        } else if (/^root\.(\w+)$/.test(uri)) {
            fullUri = seekjs.rootPath + RegExp.$1;
			//系统路径
		} else if (/^sys\.(\w+)$/.test(uri)) {
			fullUri = seekjs.sysPath + "core/" + RegExp.$1;
            //系统UI路径
		} else if (/^sys\.ui\.(\w+)\.?([\w\.]+)?$/.test(uri)) {
			var uiExt = RegExp.$2 || "js";
            var uiFile = uiExt=="js" && "ui.min.js" || "ui." + uiExt;
			fullUri = seekjs.sysPath + "ui/" + RegExp.$1 + "/" + uiFile;
			//系统其它路径
		} else if (/^sys\.(\w+(?:\.\w+)+)$/.test(uri)) {
			fullUri = seekjs.sysPath + RegExp.$1.replace(/\./g,"/");
		} else {
			var p = uri.split(".");
            var p1 = p[0];
            var p2 = p[1];
            var p3 = p[2];
            var p4 = p[3];
            var p12 = p1 + "." + p2;
			//命名空间的路径
            //一层命名空间
			if (p.length>1 && seekjs.ns[p1]){
                fullUri = seekjs.ns[p1] + p2 + (p3?"."+p3:"");
            //两层命名空间
            }else if(p.length>2 && seekjs.ns[p12]){
                fullUri = seekjs.ns[p12] + p3 + (p4?"."+p4:"");
			} else {
				var p0 = uri.split("/")[0];
				//配置的路径
				if (seekjs.paths[p0]) {
					fullUri = uri.replace(/^\w+/, seekjs.paths[p0]);
				} else {
					fullUri = path + uri;
				}
			}
		}
        if (/#$/.test(fullUri)){
            fullUri = fullUri.slice(0,-1);
        }else if (!/(?:\.\w+|\/)$/.test(fullUri)) {
			fullUri += ".js";
		}
		fullUriList[uri] = fullUri;
		return fullUri;
	};

	var head = document.querySelector("head");

	//获取最后一个script对象
	var getLastScript = function () {
		var scripts = document.querySelectorAll("script");
		var script = scripts[scripts.length - 1];
		return script;
	};

    var callbacks = {};
    var timestamp;

	//相对于当前页面的路径
	var sourceModules;
	seekjs.require = function (mods, callback) {
		window.setTimeout(function () {
			timestamp = new Date().getTime();
			callbacks[timestamp] = callback;

            if(typeof(mods)== "string"){
                sourceModules = [mods];
            }else{
                sourceModules = mods;
            }
            sourceModules = sourceModules.map(function(uri) {
                uri = seekjs.resolve(uri, location.href);
                return iniModule(uri, location.href);
            });
            currentUri = sourceModules[0].uri;
            waitings = waitings.concat(sourceModules);
			cutQueue();
		}, 0);
	};

     //页面初始化
     seekjs.use = function (file) {
         seekjs.require(file);
     };

	seekjs.sysPath = getLastScript().src.replace(/[^\/]+$/, "");
	seekjs.rootPath = location.href.replace(/#.*$/,"").replace(/[^\/]+$/,"");

	var mainPath = getLastScript().dataset.main;
	if(mainPath){
		window.onload = function() {
			seekjs.use(mainPath);
		}
	}

}(this);
