/**
 * 文件合并
 * Created by likaituan on 15/9/18.
 */

(function(exp) {
    "use strict";
    var fs = require("fs");
    var tp = require("./h5template");

    //添加View页面
    exp.addFile = function(name){
        var tplCode = fs.readFileSync(`ui/${name}/ui.html`).toString();
        var jsCode = tp.getJsCode(tplCode);
        var fun = 'exp.getTemplate = function($){'+jsCode+'};';
        var code = fs.readFileSync(`ui/${name}/ui.js`).toString();
        code = code.replace("\"use strict\";", "\"use strict\";\n\n" + fun + "\n\n");
        var mid = "sys.ui." + name;
        code = exp.addCode(mid, code);

        /*
        code = code.replace('req("sys.ui.'+name+'.pic")', function(){
            var picCode = fs.readFileSync("public/seekjs/ui/"+name+"/pic.js").toString();
            return picCode.replace(/^[\s\S]*?define\(\"sys\.ui\.\w+\.pic\"\s*,\s*\{/, "{").replace(/\}\)\;$/,"}");
        });
        */
        exp.saveFile(name, code);
    };

    //添加ID标记
    exp.addCode = function(id, code){
        return code.replace(/define\s*\(\s*function/ig, "define(\""+id+"\",function");
    };

    //保存文件
    exp.saveFile = function(folder, code){
        fs.writeFileSync(`ui/${folder}/ui.min.js`, code);
    };

    exp.init = function(){
        var startTime = Date.now();
		
		var forder = process.argv[2];
		if(forder){
			exp.addFile(forder);

            var endTime = Date.now();
            var time = endTime - startTime;
            console.log("merge complete, use time "+time+"ms");
		}else{
			console.log("input a name please!");
		}
    };

    exp.init();
})(exports);
