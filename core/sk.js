/**
 * 单文件解析器
 * Created by likaituan on 16/7/1.
 */

define(function(req, exp){

    //获取源码
    exp.getCode = function(filename, callback) {
        var tp = "";
        var st = "";
        var js = "";
        seekjs.loadText(filename, function(rs){
            rs.text.replace(/<template>([\s\S]+?)<\/template>/i, function(_,code){
                tp = code.trim().replace(/\r|\n/g,"");
            });
            rs.text.replace(/<style>([\s\S]+?)<\/style>/i, function(_,code){
                st = code.trim().replace(/\r|\n/g,"");
            });
            rs.text.replace(/<script>([\s\S]+?)<\/script>/i, function(_,code){
                js = 'exp.templateHTML=\'' + tp + '\'; exp.cssText=\'' + st + '\'; ' + code.trim();
            });
            var factory = new Function("req", "exp", "mod", js);
            callback(factory);
        });
    };

});