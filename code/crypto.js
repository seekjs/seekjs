/**
	@title 代码加密
	@author Li
	@date 2015.1.12
*/
define(function (req, exp, mod) {
	"use strict";
    var cod = req("sys.code.code");

    mod.exports = function(srcCode){
        var code = srcCode;
        //code = cod.clearWhite(code);
        code = cod.clearComment(code);
        return code;
    };

});