/*csd*/
define(function (req, exp) {
	"use strict";

	//存储
	var Store = function(){
        var args = [].slice.call(arguments);
        if(arguments.length==4){
            return Store.setKey.apply(Store,args);
        }
        if(arguments.length==3){
            return Store.set.apply(Store,args);
        }
        if(arguments.length==2){
            return Store.get.apply(Store,args);
        }
	};

    //获取值
    Store.get = function(store, name){
        try{
            return JSON.parse(store[name]);
        }catch(e){
            return store[name] || "";
        }
    };

    //设置
    Store.set = function(store,name,json){
        if(json===undefined){
            json = "";
        }
        store[name] = typeof(json)=="object" ? JSON.stringify(json) : json;
        return json;
    };

    //设置key值
    Store.setKey = function(store, name, key, val){
        var json = this.get(store, name);
        if(json && typeof(json)=="object") {
            json[key] = val;
            this.set(store,name,json);
        }
        return val;
    };


	//本地存储
	exp.local = function(name, json){
		return Store.apply(null,[localStorage].concat([].slice.call(arguments)));
	};

	//浏览器回话存储
	exp.session = function(name, json){
		return Store.apply(null,[sessionStorage].concat([].slice.call(arguments)));
	};

});