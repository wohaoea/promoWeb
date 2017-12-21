var smashingeggs_hammer = document.getElementById("smashingeggs_hammer");
var x, y, eggs, rate, custId, domain, shareId, investURL, exchangeGoldenEggURL;
var qrcodeUrl = "customer/getQRCode";
var EGGS = {
	"g": {
		doc: document.getElementById("smashingeggs_golden_egg"),
		brokenable: 1,
		url: "smashingeggs_smashing_eggs/:type",
		surplus: 0,
		exchanged: false, //controll text
		waitForExchange: 0, //controll dialog
		exchangedText: "您还有&nbsp;<font color=\"white\">%waitForExchange%</font>&nbsp;张现金券没有兑换",
		text: "您已成功获得&nbsp;<font color=\"white\">%waitForExchange%</font>&nbsp;张现金券"
	},
	"s": {
		doc: document.getElementById("smashingeggs_silver_egg"),
		brokenable: 1,
		url: "smashingeggs_smashing_eggs/:type",
		surplus: 0,
		exchanged: false,
		waitForExchange: 0,
		exchangedText: "您还有&nbsp;<font color=\"white\">%waitForExchange%</font>&nbsp;元现金券可分享",
		text: "您还有&nbsp;<font color=\"white\">%waitForExchange%</font>&nbsp;元现金券可分享"
	}
};

/*function*/

function getPosition(doc) {
	var p = {
		x: doc.offsetLeft,
		y: doc.offsetTop
	};
	var t = doc.offsetParent;
	while (t) {
		p.x += t.offsetLeft;
		p.y += t.offsetTop;
		t = t.offsetParent
	}
	p.x -= window.pageXOffset || window.document.body.scrollLeft || window.document.documentElement.scrollLeft;
	p.y -= window.pageYOffset || window.document.body.scrollTop || window.document.documentElement.scrollTop;
	return p;
}

function getEggsPosition() {
	for (var gs in EGGS) {
		if (!eggs) eggs = {};
		if (!eggs[gs]) eggs[gs] = {};
		eggs[gs].p = getPosition(EGGS[gs].doc);
		var wh = {
			w: EGGS[gs].doc.offsetWidth,
			h: EGGS[gs].doc.offsetHeight
		};
		eggs[gs].p2 = {
			x: eggs[gs].p.x + wh.w,
			y: eggs[gs].p.y + wh.h
		};
	}
}

function viewBrokenEggs(sg) {
	$(EGGS[sg].doc).css("background-position", "0% 100%");
}

function viewRestoreEggs(sg) {
	$(EGGS[sg].doc).css("background-position", "0% 0%");
}

function viewEggsSurpluse() {
	$("#golden_surplus").html(custId ? "x" + EGGS.g.surplus : "--");
	$("#silver_surplus").html(custId ? "x" + EGGS.s.surplus : "--");
}

function viewExchangeText() {
	if (EGGS.g.exchanged) $("#exchange_golden_egg_text").html(EGGS.g.exchangedText.replace("%waitForExchange%", (custId ? EGGS.g.waitForExchange : "--")));
	else $("#exchange_golden_egg_text").html(EGGS.g.text.replace("%waitForExchange%", (custId ? EGGS.g.waitForExchange : "--")));
	if (EGGS.s.exchanged) $("#exchange_silver_egg_text").html(EGGS.s.exchangedText.replace("%waitForExchange%", (custId ? EGGS.s.waitForExchange : "--")));
	else $("#exchange_silver_egg_text").html(EGGS.s.text.replace("%waitForExchange%", (custId ? EGGS.s.waitForExchange : "--")));
}

function dialog(option) {
	var opt = {
		title: false,
		fixed: true,
		lock: true,
		opacity: .5,
		effect: false,
		width: 400,
		height: 180,
		content: document.getElementById("exchange_golden_egg_success"),
		hide: function() {
			window.location.reload();
			return true;
		},
		init: function() {
			var that = this; //this，表示当前对话框实例对象
			$('div.dialog>div.dialogtop>div.close').click(function() {
				that.hide();
			});
		}
	};
	if (!option) return $.dialog(option);
	for (var key in opt) {
		if (!option.hasOwnProperty(key)) {
			option[key] = opt[key];
		}
	}
	$.dialog(option);
}
/*common function*/

/*about req function*/
function checkResult(result) {
	if (!result) return false;
	if (result.success !== true) {
		if (result.resultCode === "notlogin" || result.resultCode == "timeout") {
			window.location.href = domain;
		}
		return false;
	}
	return true;
}

function smashingeggs_smashing_eggs(sg) {
	if (!custId) {
		TipGoToLogin();
		return;
	}
	if (EGGS[sg].brokenable) {
		EGGS[sg].brokenable = !EGGS[sg].brokenable;
		var url = EGGS[sg].url.replace(":type", sg == "g" ? 1 : 2) + "?t=" + new Date().getTime();
		$.ajax({
			type: "GET",
			url: url, //.replace(":type", type)
			dataType: "json",
			success: function(result) {
				EGGS[sg].brokenable = !EGGS[sg].brokenable;
				if (checkResult(result)) {
					if (result.data === "-1") {
						dialog({
							content: document.getElementById("smashingeggs_smashing_eggs_fail"),
							hide: function() {
								return true;
							}
						});
					} else if (result.data === "-2") {
						//alert("服务器繁忙，请重新领取");
						return;
					} else { //success
						if (sg === "g") {
							viewBrokenEggs(sg);
							// EGGS[sg].waitForExchange += 1;
							$("#smashing_golden_egg_result").html(result.data);
							// EGGS[sg].surplus -= 1;
							// viewExchangeText();
							// viewEggsSurpluse();
							dialog({
								content: document.getElementById("smashing_golden_egg_success"),
								hide: function() {
									window.location.reload();
									return true;
								}
							});
							// window.location.reload();
						} else {
							// EGGS[sg].waitForExchange += parseFloat(result.data.amount);
							shareId = result.data.shareRedId;
							$("#smashing_silver_egg_result").html(result.data.amount);
							// EGGS[sg].surplus -= 1;
							var img = document.getElementById("qrcodeimg");
							img.onload = function() {
								viewBrokenEggs(sg);
								// viewEggsSurpluse();
								// viewExchangeText();
								dialog({
									content: document.getElementById("smashing_silver_egg_success"),
									hide: function() {
										window.location.reload();
										return true;
									}
								});
							}
							img.src = "/m6/getQRCode/" + shareId;
						}
					}
				}
			}
		});
	}
}
/*init function*/
function initValues() {
	custId = document.getElementById("_custId").value;
	EGGS.g.surplus = parseFloat(document.getElementById("_g_surplus").value);
	EGGS.s.surplus = parseFloat(document.getElementById("_s_surplus").value);
	EGGS.g.waitForExchange = parseFloat(document.getElementById("_g_exchange").value);
	EGGS.s.waitForExchange = parseFloat(document.getElementById("_s_exchange").value);
	domain = document.getElementById("_domain").value;
	investURL = domain + "plan";
	exchangeGoldenEggURL = domain + "p/account/xjqgl";
	shareId = document.getElementById("_shareId").value;
}

function initDisplay() {
	document.body.onselectstart = document.body.ondrag = function() {
		return false;
	}
	rate = 1;
	// rate = Math.max(document.body.clientWidth, 1000) * 1.0 / 1920;
	// $(".smashingeggs_header").css("height", (rate * 700) + "px");
	// $(".smashingeggs_bottom").css("height", (rate * 600) + "px");
	// $(".smashingeggs_egg_label>label").css("line-height", 34 * rate + "px");
	// $(".smashingeggs_egg_label>label").css("font-size", 20 * rate + "px");
	// $(".smashingeggs_exchange_text>p").css("line-height", 30 * rate + "px");
	// $(".smashingeggs_exchange_text>p").css("font-size", 1.2 * rate + "em");
	// $("div.smashingeggs_exchange_btn").css("line-height", (3.6 + 1.25 * rate) + "em");
	// $("div.smashingeggs_exchange_btn").css("font-size", 1.5 * rate + "em");
	$(EGGS.s.doc).css("background-position", "0% 0%");
	$(EGGS.g.doc).css("background-position", "0% 0%");
	viewEggsSurpluse();
	viewExchangeText();
}

function TipGoToLogin() {
	nwDialog({
		title: '提示',
		height: 175,
		width:400,
		content: '<div style=\"margin:10px auto;\">您尚未登录，请先登录</div>',
		btn: nwDialogBtn({
			m: 2,
			ok: {
				val: '登录',
				type: 'red',
				click: function() {
					window.location.href = domain + "login?apchy=smashingeggs";
				}
			},
			cancle: {
				val: '取消',
				type: 'red'
			}
		})
	});
}
/*init event*/
function initEvents() {

	/*view function*/
	$(document.body).mousemove(function(e) {
		getEggsPosition();
		x = e.clientX;
		y = e.clientY;
		if (x > eggs.g.p.x && x < eggs.g.p2.x && y > eggs.g.p.y && y < eggs.g.p2.y || x > eggs.s.p.x && x < eggs.s.p2.x && y > eggs.s.p.y && y < eggs.s.p2.y) {
			smashingeggs_hammer.style.left = (x - 218 * rate * 0.31) + "px";
			smashingeggs_hammer.style.top = (y - 227 * rate * 0.31) + "px";
			smashingeggs_hammer.style.display = "block";
		} else {
			smashingeggs_hammer.style.display = "none";
		}
	});
	/*$("#invest_now").mouseup(function(e) {
		if (this.src != "/imgs/m6/smashingeggs/invest_now_up.png") this.src = "/imgs/m6/smashingeggs/invest_now_up.png";
	});
	$("#invest_now").mouseout(function(e) {
		if (this.src != "/imgs/m6/smashingeggs/invest_now_up.png") this.src = "/imgs/m6/smashingeggs/invest_now_up.png";
	});*/
	$("#invest_now").mousedown(function(e) {
		if (this.src != "/imgs/m6/smashingeggs/invest_now_down.png") this.src = "/imgs/m6/smashingeggs/invest_now_down.png";
	});
	/*$(".smashingeggs_exchange_btn").mouseup(function(e) {
		if (this.style["background-image"] != "url(/imgs/m6/smashingeggs/exchange_eggs_up.png)") this.style["background-image"] = "url(/imgs/m6/smashingeggs/exchange_eggs_up.png)";
	});
	$(".smashingeggs_exchange_btn").mouseout(function(e) {
		if (this.style["background-image"] != "url(/imgs/m6/smashingeggs/exchange_eggs_up.png)") this.style["background-image"] = "url(/imgs/m6/smashingeggs/exchange_eggs_up.png)";
	});*/
	$(".smashingeggs_exchange_btn").mousedown(function(e) {
		if (this.style["background-image"] != "url(/imgs/m6/smashingeggs/exchange_eggs_down.png)") this.style["background-image"] = "url(/imgs/m6/smashingeggs/exchange_eggs_down.png)";
	});

	/*click functions*/
	$(".smashingeggs_invest_now").click(function(e) {
		window.location.href = investURL;
	});
	$("#exchange_golden_egg_btn").click(function(e) {
		if (!custId) {
			TipGoToLogin();
			return;
		}
		if (EGGS.g.waitForExchange > 0) return window.location.href = exchangeGoldenEggURL;
		else {
			dialog({
				content: document.getElementById("smashingeggs_smashing_eggs_fail"),
				hide: function() {
					return true;
				}
			});
		}
	});
	$("#exchange_silver_egg_btn").click(function(e) {
		//show qrcode
		if (!custId) {
			TipGoToLogin();
			return;
		}
		if (!shareId || EGGS.s.waitForExchange <= 0) {
			dialog({
				content: document.getElementById("smashingeggs_smashing_eggs_fail"),
				hide: function() {
					return true;
				}
			});
			return;
		}
		var img = document.getElementById("qrcodeimg");
		$("#smashing_silver_egg_result").html(EGGS.s.waitForExchange);
		img.src = "/m6/getQRCode/" + shareId;
		dialog({
			content: document.getElementById("exchange_silver_egg_success"),
			hide: function() {
				return true;
			}
		})
	});
	smashingeggs_hammer.onclick = function(e) {
		if (smashingeggs_hammer.style.display == "block") {
			x = e.clientX;
			y = e.clientY;
			var sg = x > eggs.g.p.x && x < eggs.g.p2.x && y > eggs.g.p.y && y < eggs.g.p2.y ? "g" : "s";
			if ($(EGGS[sg].doc).css("background-position") == "0% 0%") {
				smashingeggs_smashing_eggs(sg);
			}
		}
	}

	/*all display*/
	$(window).resize(function() {
		initDisplay();
	});
}

function init() {
	initValues();
	initDisplay();
	initEvents();
}
$("<div class=\"shortcut\"><a href=\"#\" class=\"gotop\" title=\"返回顶部\"></div>").appendTo("body");
/*init*/
init();



(function($) {
	var goToTopTime = null;
	$.fn.goToTop = function(options) {
		var opts = $.extend({}, $.fn.goToTop.def, options);
		var $window = $(window);
		$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'); // opera fix

		var shouldvisible = ($window.scrollTop() >= opts.startline) ? true : false;

		var $this = $(this);
		if (shouldvisible) {
			$("#zhongzhi").css({
				"position": "relative",
				"top": "0"
			});
			$this.stop().css({
				"visibility": "visible"
			});

		} else {
			$this.stop().css("visibility", "hidden");
			$("#zhongzhi").css({
				"position": "relative",
				"top": "50px"
			});
		}

		$(this).click(function(event) {
			$body.stop().animate({
				scrollTop: $(opts.targetObg).offset().top
			}, opts.duration);
			$(this).blur();
			event.preventDefault();
			event.stopPropagation();
		});
	};


	$.fn.floatright = function(options) {
		var opts = $.extend({}, $.fn.goToTop.def, options);
		var $window = $(window);
		$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'); // opera fix
		//$(this).hide();
		var $this = $(this);
		goToTopTime = setTimeout(function() {
			var controlLeft;
			if ($window.width() > opts.pageHeightJg * 2 + opts.pageWidth) {
				controlLeft = ($window.width() - opts.pageWidth) / 2 + opts.pageWidth + opts.pageWidthJg;
			} else {
				controlLeft = $window.width() - opts.pageWidthJg - $this.width();
			}
			var cssfixedsupport = $.browser.msie && parseFloat($.browser.version) < 7; //判断是否ie6

			var controlTop = $window.height() - $this.height() - opts.pageHeightJg;

			controlTop = cssfixedsupport ? $window.scrollTop() + controlTop : controlTop;


			$this.css({
				position: cssfixedsupport ? 'absolute' : 'fixed',
				top: controlTop,
				left: controlLeft
			});
		}, 30);
	};

	$.fn.goToTop.def = {
		pageWidth: 1000, //页面宽度
		pageWidthJg: 15, //按钮和页面的间隔距离
		pageHeightJg: 130, //按钮和页面底部的间隔距离
		startline: 130, //出现回到顶部按钮的滚动条scrollTop距离
		duration: 3000, //回到顶部的速度时间
		targetObg: "body" //目标位置
	};

})(jQuery);
$(".gotop").goToTop();
$(".shortcut").floatright();
$(window).bind('scroll resize', function() {
	$(".gotop").goToTop({
		duration: 400
	});
	$(".shortcut").floatright();
});

$(".shortcut .hotline").hover(
	function() {
		$(".shortcut .hotlinebox").show();
	},
	function() {
		$(".shortcut .hotlinebox").hide();
	}
);
$(".shortcut .weixin").hover(
	function() {
		$(".shortcut .weixinbox").show();
	},
	function() {
		$(".shortcut .weixinbox").hide();
	}
);