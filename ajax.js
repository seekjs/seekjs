/*csd*/
define(function (req, exp) {
	"use strict";
	var ex = req("sys.ex");

	//默认设置
	exp.ops = {
		usemask: true,
		timeout: 90000
	};

	//ajax请求
	exp.request = function (ops) {
		ops.method = "get";
		ex.mergeObj(this, ops);

		var xhr = new XMLHttpRequest();
		xhr.open(ops.method || "get", ops.url, false);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				exp.usemask && mask.hide();
				if (xhr.status == 200 || xhr.status == 0) {
					var callback = ops.callback || ops.success;
					callback && callback(xhr.responseText);
				} else {
					if (ops.error) {
						ops.error();
					} else {
						throw ops.url + " is load error, state:" + xhr.state;
					}
				}
			}
		};
		var data = [];
		if (ops.data) {
			for (var k in ops.data) {
				data.push(k+"="+ops.data[k]);
			}
		}
		this.beforeSend && this.beforeSend(xhr);
		xhr.send(data.join("&"));

	};

	//get请求
	exp.get = function (ops) {
		ops.method = "get";
		return this.request(ops);
	};

	//post请求
	exp.post = function (url, data, callback) {
		ops.method = "post";
		return this.request(ops);
	};
});