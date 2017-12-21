var niuwaError = {
	'login': {
		'user': '请填写用户名',
		'password': '请填写登录密码',
		'vcode': '验证码不为空'

	},
	'register': {
		'user': '请填写用户名',
		'userRegNum': '用户名不能纯数字',
		'userReg': '用户名只允许字母,数字,"-"及"_"',
		'userRegBetween': '用户名为 6-20 个字符',
		'password': '请填写登录密码',
		'passWordReg': '密码必须为6-20位字符',
		'passWordAgain': '密码不一致',
		'passWordAgainnull': '请再次输入密码确认',
		'vcode': '请填写验证码',
		'proviSion': '请阅读并同意《平台注册协议》',
		'pnumberverify': '请输入您的有效手机号码',
		'pnumbernull': '请输入您的有效手机号码',
		'phonevcodenull': '请输入验证码',
		'phonevcodefourtimes': '验证码错误'
	},

	severStatus: {
		nwAtf: "nwAtf" //投标——立即投资

	},
	'tips': {
		centertips: function(text) {
			return '<div style="text-align:center; font-size: 16px;color:#fb4b4b; margin-top: 30px;">' + text + '</div>';
		},
		centeralert: function(text) {
			return '<div style="text-align:center; font-size: 16px;color:#fb4b4b; margin-top: 30px;">' + text + '</div>'
				/*+
				'<div style=" text-align:center;"><input class="closealert" type="button" value="确定" style="  text-align: center; background: #fb4b4b;  color: #fff;  width: 100px;  padding: 2px;  line-height: 26px;  height: 30px;  margin-top: 30px; cursor: pointer; border: none;"/></div>'*/
			;
		},
		closeAlert: function(callback) {
			var that = this;
			$("body").delegate(".closealert", "click", function() {
				if (callback) {
					callback();
				} else {
					that.hide();
				}
			});
		},
		confirmThirdparty: function(severStatus) {
			var params = "severStatus=";
			switch (severStatus) {
				case niuwaError.severStatus.nwAtf:
					params += niuwaError.severStatus.nwAtf;
					break;
			}

			return '<div class="tip-info" style="margin-bottom:8px;">请您在新打开的支付平台进行支付，<br>支付完成前请不要关闭该窗口</div><div class="FS12" style="color: #bbb;">(若页面未跳转请在浏览器设置中允许插件执行)</div>';
		},
		closeConfirmThirdparty: function() {
			var that = this;
			$('.init-my-btn').click(function() {
				that.hide();
			});
		}
	}
};

$(function() {
	var birthdayopt;
	/*时间格式*/
	/*时间格式*/
	function getBirthTime(data) {
		var bimonth = ((parseInt(new Date(data).getMonth()) + 2) < 10) ? ('0' + (parseInt(new Date(data).getMonth()) + 2)) : (parseInt(new Date(data).getMonth()) + 2);
		var birday = (parseInt(new Date(data).getDate()) < 10) ? ('0' + parseInt(new Date(data).getDate())) : (parseInt(new Date(data).getDate()));;
		if (parseInt(new Date(data).getMonth()) + 1 == 12) {
			return (parseInt(new Date(data).getFullYear()) + 1) + '-' + '01' + '-' + birday;
		}
		return new Date(data).getFullYear() + '-' + bimonth + '-' + birday;
	}

	function letDivCenter(divName) {
		var top = ($(window).height() - $(divName).height()) / 2;
		var left = ($(window).width() - $(divName).width()) / 2;
		var scrollTop = $(document).scrollTop();
		var scrollLeft = $(document).scrollLeft();
		$(divName).css({
			'top': top + scrollTop,
			left: left + scrollLeft
		});
	}
	/*弹出生日礼包
		type=1 弹出领取
		type=2 弹出确定领取
		type=0 删除创建dom元素
		data 获取服务器时间
	*/

	var birthlayer = function(type, data) {
			var h = $(document).height();
			var top = ($(window).height() - 319) / 2;
			var left = ($(window).width() - 554) / 2;
			var top2 = ($(window).height() - 60) / 2;
			var left2 = ($(window).width() - 200) / 2;
			var scrollTop = $(document).scrollTop();
			var scrollLeft = $(document).scrollLeft();
			var arr = [];
			switch (type) {
				case "0":
					$(".birthlayer,.birthbox").remove()
					break;
				case "1":
					$(".birthlayer,.birthbox").remove()

					arr.push('<div class="birthbox" style="top:' + (top + scrollTop) + 'px;left:' + (left + scrollLeft) + 'px">');
					arr.push('<div class="lingqubirgiftbtn" data-ca="lingqubirgiftbtn"></div>');
					arr.push('</div>');
					arr.push('<div class="birthlayer" style="height:' + h + 'px"></div>');
					arr = arr.join('');
					$("body").append(arr);
					break;
				case '2':
					$(".birthlayer,.birthbox").remove()

					/*arr.push('<div class="birthbox" style="top:' + (top2 + scrollTop) + 'px;left:' + (left2 + scrollLeft) + 'px;background:#FB4B4B;height:60px;width:200px;line-height:60px;color:#fff;font-size:14px;text-align:center">');
					arr.push('' + data + '</div>');
					arr.push('<div class="birthlayer" style="height:' + h + 'px"></div>');
					arr = arr.join('');
					$("body").append(arr);
					setTimeout(function() {
						birthlayer("0")
					}, 1000)*/
					nwDialog({
						m:0,
						title: '提示',
						content: data,
						height: '190px',
						fixed: true,
						btn: nwDialogBtn({
							ok: {
								val: '确定',
								type: 'red',
								click: function() {
									// window.location.href= domain + "login?apchy=hhr";
									//$("#pswd-again").focus();
								}
							}
						})
					});
					break;
				default:
					$(".birthlayer,.birthbox").remove()
					arr.push('<div class="birthbox combirthbox" style="top:' + (top + scrollTop) + 'px;left:' + (left + scrollLeft) + 'px">');
					arr.push('<div class="brithxianjin">');
					arr.push('<div style="width:100%;margin-top:77px"><p style="padding-left:10px">有效期:' + data + '</p><p style="padding-left:10px">最低投资额<span style="marin-left:5px">10000元</span></p></div>');
					arr.push('</div>');
					arr.push('<div class="brithjiaxi">');
					arr.push('<div style="width:100%;margin-top:50px"><p style="padding-left:67px">仅限智牛精选，懒牛计划</p><p style="padding-left:67px">有效期' + data + '</p></div>');
					arr.push('</div>');
					arr.push('<div class="quedingbirgiftbtn" data-ca="quedingbirgiftbtn"></div>')
					arr.push('</div>');
					arr.push('<div class="birthlayer" style="height:' + h + 'px"></div>');
					arr = arr.join('');
					$("body").append(arr);
					//letDivCenter(".birthbox");
			}
		}
		/*读取个人生日信息*/
	$.ajax({
		type: "GET",
		url: "/pla/isBirsthday",
		dataType: "json",
		data: {
			ttime: new Date().getTime()
		},
		success: function(result) {
			if (result.success) {
				if (result.data == '1') {
					birthdayopt = getBirthTime(result.date);
					$(".title-menu>ul>li").eq(1).append('<a href="javascript:;" style="float:left;padding:0!important;background:none !important" id="birthdaybtn" data-ca="birthdaybtn"><img src="/imgs/birthdayimg/birthdayicon.png" style="margin-top:-4px"/></a>');
					$("#birthdaybtn").click(function() {
						birthlayer('1');
						$(window).scroll(function() {
							letDivCenter(".birthbox");
						});
					})
					return
				}
			}
		},
		error: function(err) {
			//alert(err);
		}
	});

	$("body").delegate(".lingqubirgiftbtn", "click", function() {
		birthlayer("3", birthdayopt)
	});
	$("body").delegate(".quedingbirgiftbtn", "click", function() {
		$.ajax({
			type: "GET",
			url: "/pra/getBirthdayGift",
			dataType: "json",
			data: {
				ttime: new Date().getTime()
			},
			beforeSend: function() {
				$(".quedingbirgiftbtn").addClass("quedingbirgiftbtnun");
				$('<div style="width:100%;height:100%;position:absolute;left:0;top:0;background:none;z-index:10000000" id="birthfugai"></div>').appendTo('body');
			},
			complete: function() {
				$(".quedingbirgiftbtn").removeClass("quedingbirgiftbtnun");
				$("#birthfugai").remove();
			},
			success: function(result) {
				if (result.result == 'fail' && result.tourl) {
					window.location.href == result.tourl;
					return
				}
				if (result.success) {
					birthlayer("2", '领取成功')
				} else {
					if (result.data == '0') {
						window.location.href == '/login';
						return
					}
					if (result.data == '1') {
						birthlayer("2", '再等等，稍后再试试吧')
						return
					}
					if (result.data == '2') {
						birthlayer("2", '您已经领过礼包啦！');
						$('#birthdaybtn').remove();
						return
					}
				}
			},
			error: function(err) {
				//alert(err)
			}
		});
	});
});

(function(window,$) {
	/*弹窗提示*/
	function nwDialog(options) {
		var defaults = {
			title: '提示',
			width: 400,
			height: 'auto',
			opacity: .5,
			lock: true,
			padding: 0,
			effect: 'i-scale',
			m: 300,
			content: '',
			btn: null,
			remove: true

		};
		var opt = $.extend(defaults, options);

		var content = '';
		var mcls = '';
		switch (opt.m) {
			case 0:
				mcls = '';
				break;
			case 200:
				mcls = 'i-success';
				break;
			case 300:
				mcls = 'i-warning';
				break;
			case 500:
				mcls = 'i-error';
				break;

		}
		content = '<div class="i-dialog-section" style="text-align:center">';
		if (mcls) content += '<div class="' + mcls + '"></div>';
		content += opt.content;
		content += '</div>';

		opt.content = content;
		$.dialog(opt);
	}

	/*弹窗按钮*/
	function nwDialogBtn(options) {
		var defaults = {
			m: 1, //按钮个数 1只显示确定按钮 2显示确定和取消按钮
			ok: {
				val: '确定',
				type: 'red',
				click: function() {}
			},
			cancle: {
				val: '取消',
				click: function() {}
			}
		}

		var opt = $.extend(defaults, options);
		var ok = {
			val: opt.ok.val,
			type: opt.ok.type,
			click: opt.ok.click
		}
		var cancle = {
			val: opt.cancle.val,
			click: opt.cancle.click
		}

		if (opt.m == 1) {
			return {
				ok: ok
			}
		} else if (opt.m == 2) {
			return {
				ok: ok,
				cancle: cancle
			}
		}
	}
	window.nwDialog = nwDialog;
	window.nwDialogBtn = nwDialogBtn;
})(window,jQuery);