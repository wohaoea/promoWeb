var validatePhoneUrl = domain + "p/mobilevalidation";
var validateRealnameUrl = domain + "p/reg3";

var canClickBtn = true;
$(function() {
	if (wsresult === "-3") { //产品已过期
		TipGoToOthers();
		return;
	}
	if (wsresult === "") { //产品已过期
		TipGoToOthers();
		return;
	}
	//1.  count：用户可用次数
	//2.	"-2"：没有此产品
	//3.  "-1":该用户今天已经进入3次
	//4.   "-3":产品已过期
	$("#QR_CODE").click(function(e) { //qrcode
		if (canClickBtn) {
			if ($(".shop-sys-box").is(":hidden")) {
				clickFunc("QR_CODE");
			} else {
				$(".shop-sys-box").hide();
				$("#QR_CODE").removeClass("active");
				canClickBtn = true;
			}
		}
		e.stopPropagation();
	});
	$(".shop-sys-box").click(function(e) {
		e.stopPropagation();
	});
	$("body").click(function() {
		if (!$(".shop-sys-box").is(":hidden")) {
			$(".shop-sys-box").hide();
			$("#QR_CODE").removeClass("active");
			canClickBtn = true;
		}
	});
	$("#ELECTRONIC_TICKET").click(function(e) { //ele
		if (canClickBtn) clickFunc("ELECTRONIC_TICKET");
		e.stopPropagation();
	});
	$("#LINK").click(function(e) { //link
		if (canClickBtn) clickFunc("LINK");
		e.stopPropagation();
	});
});

function goToUrl(url, is_Blank) {
	if (!url) return;
	var form = $("<form id=\"gotourlform\"></form>").attr("action", url).attr("method", "get").attr("style", "display:none;").attr("action", url);
	if (is_Blank) form.attr("target", "_blank");
	$("body").append(form);
	form.submit();
	form.remove();
}

function clickFunc(id) {
	canClickBtn = false;
	if (wsresult === "-3") { //产品已过期
		TipGoToOthers();
		return;
	}
	if (wsresult === "-2") { //没有此产品
		TipGoToOthers();
		return;
	}
	if (wsresult === "-1") {
		TipNoChance();
		return;
	}
	if (wsresult === "0") {
		TipReTry();
		return;
	}
	if (wsresult == "-4") {
		if (id == "QR_CODE") {
			$("#QR_CODE").addClass("active");
			$(".shop-sys-box").show();
			$(".shop-sys-box")[0].focus();
		} else if (id == "LINK") {
			goToUrl(href, true);
			canClickBtn = true;
			// $("#hreflinkform").submit();
		}
		return;
	}
	TipHasChance(parseInt(wsresult), id);
}

function TipNoChance() {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">今日领取资格已使用，明日再来领取吧~</div>',
		btn: nwDialogBtn({
			m: 1,
			ok: {
				val: '确定',
				type: 'red',
				click: function() {
					canClickBtn = true;
				}
			}
		}),
		hide: function() {
			canClickBtn = true;
		}
	});
}

function TipReTry() {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">系统繁忙，请稍候重试~</div>',
		btn: nwDialogBtn({
			m: 1,
			ok: {
				val: '确定',
				type: 'red',
				click: function() {
					canClickBtn = true;
				}
			}
		}),
		hide: function() {
			canClickBtn = true;
		}
	});
}

function TipGoToOthers() {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">优惠券已经被抢光啦，请去别的商户看看吧</div>',
		btn: nwDialogBtn({
			ok: {
				val: '确定',
				type: 'red',
				click: function() {
					window.location.href = "/m7/huixiangshenghuo";
				}
			}
		}),
		hide: function() {
			canClickBtn = true;
		}
	});
}

function TipGoToLogin() {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">您尚未登录，请先登录</div>',
		btn: nwDialogBtn({
			ok: {
				val: '登录',
				type: 'red',
				click: function() {
					window.location.href = domain + "login?apchy=huixiangshenghuo";
				}
			}
		}),
		hide: function() {
			canClickBtn = true;
		}
	});
}


function TipGoToValidatePhone() {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">您尚未完成手机认证，请先认证</div>',
		btn: nwDialogBtn({
			m: 2,
			ok: {
				val: '认证',
				type: 'red',
				click: function() {
					window.location.href = validatePhoneUrl;
				}
			},
			cancle: {
				val: '取消',
				type: 'red',
				click: function() {
					canClickBtn = true;
					// window.location.reload();
				}
			}
		}),
		hide: function() {
			canClickBtn = true;
		}
	});
}

function TipGoToValidateRealname() {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">您尚未实名认证，请先认证</div>',
		btn: nwDialogBtn({
			m: 2,
			ok: {
				val: '认证',
				type: 'red',
				click: function() {
					window.location.href = validateRealnameUrl;
				}
			},
			cancle: {
				val: '取消',
				type: 'red',
				click: function() {
					canClickBtn = true;
					// window.location.reload();
				}
			}
		}),
		hide: function() {
			canClickBtn = true;
		}
	});
}

function TipNoChanceThisShop() {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">您今日已领取过本商户优惠，明天再来吧</div>',
		btn: nwDialogBtn({
			ok: {
				val: '确定',
				type: 'red',
				click: function() {
					window.location.reload();
				}
			}
		}),
		hide: function() {
			canClickBtn = true;
		}
	});
}

function TipHasChance(number, id) {
	$.ajax({
		type: "GET",
		url: "/m7/huixiangshenghuo_checktogo/" + key + "?t=" + new Date(),
		dataType: 'json',
		async:false,
		success: function(result) {
			if (result.success == false && result.msg == "notlogin") return TipGoToLogin();
			if (result.data === "-5") { //no phone
				TipGoToValidatePhone();
				return;
			} else if (result.data === "-6") { //no realname
				TipGoToValidateRealname();
				return;
			} else if (result.data === "-3") { //产品已过期
				TipGoToOthers();
				return;
			} else if (result.data === "-2") { //没有此产品
				TipGoToOthers();
				return;
			} else if (result.data === "-1") {
				TipNoChance();
				return;
			} else if (result.data === "0") {
				TipReTry();
				return;
			} else if (result.data == "-4") {
				if (id == "QR_CODE") {
					$("#QR_CODE").addClass("active");
					$(".shop-sys-box").show();
					$(".shop-sys-box")[0].focus();
				} else if (id == "LINK") {
					goToUrl(href, true);
				}
				return;
			} else if (result.data === "-7") {
				TipNoChanceThisShop();
				return;
			}
			nwDialog({
				height: 200,
				title: '提示',
				content: '<div style=\"margin:10px auto;\">每天可领取三次奖励，您今日尚可领取【N】次<br/>确认领取吗？</div>'.replace("N", result.data),
				btn: nwDialogBtn({
					m: 2,
					ok: {
						val: '确定',
						type: 'red',
						click: function() {
							// "data": "1xfasphg",     //1.券码商户返回券码 
							//2.	"-2"：没有此产品
							//3.  "-1":该用户今天已经进入3次
							//4.   "0":产品已过期
							//5.   "1":非券码商户进入成功
							//6.   "-3":网络繁忙，请重试
							$.ajax({
								type: "GET",
								url: "/m7/huixiangshenghuo_userconfirm/" + key + "?t=" + new Date(),
								dataType: 'json',
								async:false,
								success: function(result) {
									if (result.msg == "notlogin") {
										TipGoToLogin();
										return;
									} else if (result.data === "-3" || result.data === "-2" || result.data === "0") {
										TipGoToOthers();
									} else if (result.data === "-1") {
										TipNoChance();
									} else if (result.data === "-5") {
										TipGoToValidatePhone();
									} else if (result.data === "-6") {
										TipGoToValidateRealname();
									} else if (result.data === "-7") {
										TipNoChanceThisShop();
									} else { //可能qrcode，link
										if (id == "QR_CODE") {
											$("#QR_CODE").addClass("active");
											$(".shop-sys-box").show();
											$(".shop-sys-box")[0].focus();
										} else if (id == "ELECTRONIC_TICKET") {
											var data = result.data;
											$("#ELECTRONIC_TICKET").hide();
											$(".card-id").html(data).show();
											canClickBtn = false;
										} else if (id == "LINK") {
											goToUrl(href, true);
										}
										canClickBtn = true;
									}
								}
							});
						}
					},
					cancle: {
						val: '取消',
						type: 'red',
						click: function() {
							canClickBtn = true;
							// window.location.reload();
						}
					}
				})
			});
		}
	});
}

var str1 = "<a class=\"channel-description noselect\"><span class=\"channel-description-icon\"></span>频道说明</a>";
var str2 = "<div class=\"channel-description-content noselect\"><li>1、惠享生活频道是牛娃互联网金融提供给用户的</li><li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;专享福利，可获得不同行业商户提供的优惠；</li><li>2、用户须完成实名认证方可获取优惠；</li><li>3、每人每天可获取3次优惠。</li></div>";
$("div.hshtop_t").append(str1);
$("div.shopinfo").append(str2);
$("a.channel-description").click(function() {
	if (!$(".channel-description-content").is(":hidden")) {
		$(".channel-description-content").hide();
	} else {
		$(".channel-description-content").show();
	}
});

$("<div class=\"shortcut\"><a href=\"#\" class=\"gotop\" title=\"返回顶部\"></div>").appendTo("body");
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

/*惠享生活 限时优惠*/
;
(function($) {
	/*倒计时*/
	var timeDown = function(option, callback) {
		window._t = null;

		function doTimeDown() {
			var flag = true;
			for (var i = 0; i < option.length; i++) {
				var _v = '还剩:' + (option[i]._d) + '天' + (option[i]._h) + '小时' + (option[i]._m) + '分' + (option[i]._s) + '.' + (option[i]._ms) + '秒';
				//var _v = formatTime((option[i]._h) + '：' + (option[i]._m) + '：' + (option[i]._s));
				(option[i]._ms) --;
				if (option[i]._ms == -1) {
					(option[i]._s) --;
					(option[i]._ms) = 9;
				}
				if ((option[i]._s) == -1) {
					(option[i]._m) --;
					(option[i]._s) = 59;
				}
				if ((option[i]._m) == -1) {
					(option[i]._h) --;
					(option[i]._m) = 59;
				}
				if ((option[i]._h) == -1) {
					(option[i]._d) --;
					(option[i]._h) = 23;
				}
				var _b = ((parseInt(option[i]._ms) < 0) || (parseInt(option[i]._d) < 0) || (parseInt(option[i]._h) < 0) || (parseInt(option[i]._m) < 0) || (parseInt(option[i]._s) < 0));
				if (_b) {
					clearTimeout(_t);
					callback(option[i].mydom);
				} else {
					_v = '还剩:' + (option[i]._d) + '天' + (option[i]._h) + '小时' + (option[i]._m) + '分' + (option[i]._s) + '.' + (option[i]._ms) + '秒';
					option[i].mydom.text(_v);
				}
			}
			_t = setTimeout(doTimeDown, 100);
			//return _v; 
		}
		doTimeDown();

		function formatTime(_time) {
			return _time.replace(/\b(\w)\b/g, '0$1');
		}
		//_t = setTimeout(doTimeDown, 1000);

	}
	$.timeDown = timeDown;
	var arr = new Array();
	$('.cd').each(function(i) {
		$(this).data('cd').mydom = $('#cd-' + i);
		$(this).data('cd')._ms = 0;
		$(this).data('cd')._t = '#cd-+' + i;
		arr.push($(this).data('cd'));
	});
	if (arr.length != 0) {
		$.timeDown(arr, function(mydom) {
			mydom.text('').css({
				background: 'none'
			});
			$(".hxsh_xsqg_wrap_right_img").addClass('togrey');
			$(".xsqg_tip").remove()
		});
	}

})(jQuery)