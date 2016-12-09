define(function (req, exp) {
	"use strict";

	var ua = exp.ua = navigator.userAgent;

	exp.os = "window";
    exp.browser = {
        name: "ie"
    };

	if (/ios/i.test(ua)) {
		exp.os = "ios";
		exp.ios = {
			version:0
		}
	}
	if (/android/i.test(ua)) {
		exp.os = "android";
		exp.android = {
			version:0
		}
	}
	if (/Mac OS X/i.test(ua)) {
		exp.os = "mac";
		exp.browser = {
            name: /chrome/i.test(ua) ? "chrome" : "safari",
			version: 0
		}
	}

    exp.mediaMode = screen.width>screen.height ? "pad" : "phone";
    exp.isMobile = /android|ios/.test(exp.os);

});