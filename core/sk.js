/**
 * 单文件解析器
 * Created by likaituan on 16/7/1.
 */

define(function(req, exp){

    //获取源码
    exp.getCode = function(filename, callback) {
        var o = {
            js: "",
            tp: "",
            st: ""
        };
        seekjs.loadText(filename, function(rs){
            alert(rs.text);
            rs.text.replace(/<script>([\s\S]+?)<\/script>/i, function(_,code){
                o.js = 'define(function(req,exp,mod){' + code.trim() + '});';
            });
            rs.text.replace(/<template>([\s\S]+?)<\/template>/i, function(_,code){
                o.tp = code.trim();
            });
            rs.text.replace(/<style>([\s\S]+?)<\/style>/i, function(_,code){
                o.st = code.trim();
            });
            callback(o);
        });
    };

});