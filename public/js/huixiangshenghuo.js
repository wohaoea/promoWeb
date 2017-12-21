function getDateShown(time) {
	if (!time) return "";
	if (!time.indexOf) return "";
	if (time.indexOf(" ") < 0) return "";
	var time = time.split(" ");
	if (!time.length) return "";
	time = time[0].split("-");
	if (!time || !time.length) return "";
	return "活动截止：" + time.join(".");
}

function initView() {
	$(".wappopr").each(function(i, doc) {
		var html = $(doc).html();
		if (html) {
			html = html.replace(/[\u4e00-\u9fa5]/g, "aa")
			if (html.length > 22) {
				$(doc).css("font-size", "12px");
			}
		}
	});
	// $(function(){
	// 	$('.togrey').gray();
	// });
}

initView();
/*common function*/
/*function ObjectKeys(obj) {
	var arr = [];
	for (var key in obj) {
		arr.push(key);
	}
	return arr;
}*/

function goToUrl(url, is_Blank) {
	if (!url) return;
	var form = $("#gotourlform");
	if (!form.length) {
		form = $("<form id=\"gotourlform\"></form>").attr("action", url).attr("method", "get").attr("style", "display:none;");
	} else {
		form.attr("action", url);
	}
	if (is_Blank) form.attr("target", "_blank");
	$("body").append(form);
	form.submit();
}

function initShopClick() {
	$(".shop").each(function(i, doc) {
		var canClick = true;
		var isLink = false;
		var isCodeByUrl = false;
		var url = $(doc).data("url");
		var code = $(doc).data("code");
		if (!code) {
			if (!url) return;
			var tests = url.match(/^\/m7\/huixiangshenghuo_pages\/(\w+)$/);
			if (!tests || !tests[1]) {
				isLink = true;
			} else {
				code = tests[1];
				isCodeByUrl = true;
			}
		}
		$(doc).click(function(e) {
			if (canClick) {
				canClick = !canClick;
				if (isLink) {
					canClick = true;
					goToUrl(url, true);
					return;
				}
				if (!$(doc).hasClass("active")) {
					TipGoToOthers();
					canClick = true;
					return;
				}
				if ($(doc).hasClass("active")) {
					$.ajax({
						type: "GET",
						url: "/m7/huixiangshenghuo_getshopstatus/" + code + "?t=" + new Date(),
						dataType: 'json',
						success: function(result) {
							if (!result.active) {
								TipGoToOthers(true);
								canClick = true;
								return;
							} else if (!_custId || _custId == "") {
								nwDialog({
									title: '提示',
									height: 160,
									content: '<div style=\"margin:10px auto;\">您尚未登录，请先登录</div>',
									btn: nwDialogBtn({
										m: 2,
										ok: {
											val: '确定',
											type: 'red',
											click: function() {
												window.location.href = domain + "login?apchy=m7/huixiangshenghuo_pages/" + code
											}
										},
										cancle: {
											val: '取消',
											type: 'red',
											click: function() {
												canClick = true;
											}
										}
									}),
									hide: function() {
										canClick = true;
									}
								});
								return;
							} else {
								canClick = true;
								window.location.href = "/m7/huixiangshenghuo_pages/" + code;
							}
						}
					});
					return;
				} else if (!_custId || _custId == "") {
					nwDialog({
						title: '提示',
						height: 160,
						content: '<div style=\"margin:10px auto;\">您尚未登录，请先登录</div>',
						btn: nwDialogBtn({
							m: 2,
							ok: {
								val: '确定',
								type: 'red',
								click: function() {
									window.location.href = domain + "login?apchy=m7/huixiangshenghuo_pages/" + code
								}
							},
							cancle: {
								val: '取消',
								type: 'red',
								click: function() {
									canClick = true;
								}
							}
						}),
						hide: function() {
							canClick = true;
						}
					});
					return;
				} else {
					canClick = true;
					return;
				}
			}
		});
	});
}

function TipNoChange() {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">今日领取资格已使用，明日再来领取吧~</div>',
		btn: nwDialogBtn({
			m: 1,
			ok: {
				val: '确定',
				type: 'red'
			}
		})
	});
}

function TipGoToOthers(needReload) {
	nwDialog({
		title: '提示',
		height: 200,
		content: '<div style=\"margin:28px auto;\">优惠券已经被抢光啦，看看别的商户吧</div>',
		btn: nwDialogBtn({
			m: 1,
			ok: {
				val: '确定',
				type: 'red',
				click: function() {
					if (needReload) window.location.reload();
				}
			}
		}),
		hide: function() {
			if (needReload) window.location.reload();
		}
	});
}

function TipGoToLogin(code) {
	nwDialog({
		title: '提示',
		height: 160,
		content: '<div style=\"margin:10px auto;\">您尚未登录，请先登录</div>',
		btn: nwDialogBtn({
			m: 2,
			ok: {
				val: '登录',
				type: 'red',
				click: function() {
					window.location.href = domain + "login?apchy=m7/huixiangshenghuo_pages/" + code
				}
			},
			cancle: {
				val: '取消',
				type: 'red'
			}
		})
	});
}

/*init function*/
function initValues() {}

function initDisplay() {}

/*init event*/
function initEvents() {
	/*view function*/
	/*click functions*/
	initShopClick();
}

function init() {
	initValues();
	initDisplay();
	initEvents();
}

/*init*/
init();

/*惠享生活 限时优惠*/
;
(function($) {
	/*倒计时*/
	$('.togrey').gray();
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
		$(this).data('cd').mydom = $('#'+$(this).attr('id'));
		$(this).data('cd')._ms = 0;
		$(this).data('cd')._t = '#cd-+' + i;
		arr.push($(this).data('cd'));
	});
	if (arr.length != 0) {
		$.timeDown(arr, function(mydom) {
			mydom.text('').css({
				background: 'none'
			});
			$(".hxsh_xsqg_wrap_right_img img").addClass('togrey');
			$('.togrey').gray();
			$(".xsqg_tip").remove()
		});
	}

})(jQuery)