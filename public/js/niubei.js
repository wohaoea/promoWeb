;
$(function() {
	var btnOpenApp = $('#open-app');
	var opt = {

	};
	btnOpenApp.click(
		function() {
			//打开本地应用函数
			var open = function(url) {
				var timeout;

				function try_to_open_app() {
					if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
						if (!/MicroMessenger/i.test(navigator.userAgent)) {
							timeout = setTimeout(function() {
								window.location.href = url;
								//console.log(22)
							}, 2000);
							//return
						}
					}
					timeout = setTimeout(function() {
						window.location.href = url;
						//console.log(22)
					}, 10);
				}
				try_to_open_app();
			}
			if (/android/i.test(navigator.userAgent)) {
				if (/MicroMessenger/i.test(navigator.userAgent)) {
					open(promodomain+"nbreg?sid=1114");
				} else {
					open('https://ms.i-niuwa.com/file/downLoad?path=pl_niubei.apk');
				}
			}
			if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
				if (/MicroMessenger/i.test(navigator.userAgent)) {
					open(promodomain+"nbreg?sid=1114");
				} else {
					open('https://itunes.apple.com/us/app/niu-bei-da-xue-sheng-she-jiao/id998444014?ls=1&mt=8');
				}
			}
		}
	);
	var code_wait = 60;

	function time(btn) {
		if (code_wait == -1) {
			btn.removeAttr("disabled");
			code_wait = 60;
			btn.val("再次发送");
		} else {
			btn.attr("disabled", true);
			timetext = code_wait + "秒";
			btn.val(timetext);
			code_wait--;
			setTimeout(function() {
					time(btn);
				},
				1000);
		}
	}

	/*提交信息*/
	$("#regbtn").click(function() {
		var _that = $(this);
		var mobile = $("#phonenum").val();
		var pswd = $.sha256($("#password").val());
		var icode = $("#imgcode").val();
		if ($.trim(mobile) == '') {
			new window.palert("请输入手机号", true);
			return
		}
		if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(mobile)) {
			new window.palert("请输入您的有效手机号", true);
			return
		}
		if ($.trim($("#password").val()) == '') {
			new window.palert("请填写登录密码", true);
			return
		}
		if ((/[\u4e00-\u9fa5]/g).test($("#password").val())) {
			new window.palert("密码不能有汉字字符", true);
			return
		}
		if (($("#password").val()).length < 6 || ($("#password").val()).length > 20) {
			new window.palert("密码必须为6-20位字符", true);
			return
		}
		if ($.trim(icode) == '') {
			new window.palert("请输入图形验证码", true);
			return
		}
		if (icode.length != 4) {
			new window.palert("请输入4位数图形验证码", true);
			return
		}
		opt = $.extend({
			mobile: mobile,
			pswd: pswd,
			icode: icode
		}, opt);
		$.ajax({
			type: "POST",
			url: "/pla/nbBindPhoneNo",
			data: {
				mobile: mobile,
				pswd: pswd,
				icode: icode
			},
			beforeSend: function() {
				new window.palert('', false, 1);
				_that.addClass("disabled");
			},
			complete: function() {
				//new window.palert(msg.resultMessage, true);
				_that.removeClass("disabled");
				$(".bodyfix2").remove();
			},
			success: function(msg) {
				_that.removeClass("disabled");
				$(".bodyfix2").remove();
				if (msg.result == "fail") {
					new window.palert(msg.resultMessage, true);
					$("#refresh").attr("src", "/pla/generatecaptcha?" + Date.now());
					return
				}
				if (msg.result == 'success') {
					//$("##nbregbox").append('');
					$.ajax({
							type: "GET",
							url: "/pla/vphone",
							success: function(res) {
								/** <======= 新版本加入的 start **/
								$('body').css({background:'url(../imgs/niubei/register_bg2.png) no-repeat',backgroundSize:'cover'})
								/** 新版本加入的 end =======> **/
								$("#nbregbox").html(res);
								$.ajax({
									type: "POST",
									url: "/m1/pla/phonegeneratemobilecode",
									data: {
										pnumber: mobile,
										icode: icode
									},
									success: function(msg) {
										if (msg.result == "fail") {
											new window.palert(msg.resultMessage, true);
										} else {
											time($("#btnvalidation"));
										}
									}
								});
							}
						})
						// $(document).pjax('#switch-to-two', '#nbregbox');
						//$("#nbregbox").p
				} else {
					new window.palert(msg.resultMessage, true);
					$("#refresh").attr("src", "/pla/generatecaptcha?" + Date.now());
					return
				}
			}
		});

	});

	$('body').delegate('#btnvalidation', 'click', function() {
		$.ajax({
			type: "POST",
			url: "/m1/pla/phonegeneratemobilecode",
			data: {
				pnumber: opt.mobile,
				icode: opt.icode
			},
			beforeSend: function() {
				$('#btnvalidation').attr("disabled", true).val('连接中..');
			},
			complete: function() {

			},
			success: function(msg) {
				if (msg.result == "fail") {
					new window.palert(msg.resultMessage, true);
					$('#btnvalidation').attr("disabled", false).val('再次发送');
				} else {
					time($("#btnvalidation"));
				}
			},
			timeout: 10000,
			error: function() {
				new window.palert('链接超时', true);
				$('#btnvalidation').attr("disabled", false).val('再次发送');
			}
		});
	});

	$("#refresh").click(function() {
		$(this).attr("src", "/pla/generatecaptchareg?" + Date.now());
	});

	$('body').delegate('#nbregbtn', 'click', function() {
		//console.log(JSON.stringify(opt));
		var vcode = $("#telnum").val();
		if (vcode == '') {
			new window.palert('验证码不为空');
			return
		}
		if (vcode.length != 6) {
			new window.palert('验证码应为6位数数字');
			return
		}
		$.ajax({
			type: "POST",
			url: "/h5ceoreg1",
			data: {
				mobile: opt.mobile,
				pswd: opt.pswd,
				vcode: vcode
			},
			beforeSend: function() {
				new window.palert('', false, 1);
				//_that.addClass("disabled");
			},
			complete: function() {
				//new window.palert(msg.resultMessage, true);
				//_that.removeClass("disabled");
				$(".bodyfix2").remove();
			},
			success: function(result) {
				if (result.result == 'fail') {
					new window.palert('手机验证码错误', true);
					return
				}
				new window.palert('注册成功', true);
				var open1 = function(url) {
					var timeout;
					var try_to_open_app = (function() {
							if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
								if (!/MicroMessenger/i.test(navigator.userAgent)) {
									timeout = setTimeout(function() {
										window.location.href = url;
										//console.log(22)
									}, 2000);
									//return
								}
							}
							timeout = setTimeout(function() {
								window.location.href = url;
								//console.log(22)
							}, 10);
						}())
						//try_to_open_app();
				}
				if (/android/i.test(navigator.userAgent)) {
					if (/MicroMessenger/i.test(navigator.userAgent)) {
						open1('http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android&g_f=991653');
					} else {
						open1('https://ms.i-niuwa.com/file/downLoad?path=pl_niubei.apk');
					}
				}

				/*	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
						window.location.href = 'niubei://';
					} else {
						window.location.href = 'niuwa.niubei://my.com';
					}*/
				if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
					if (/MicroMessenger/i.test(navigator.userAgent)) {
						window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android&g_f=991653';
					} else {
						window.location.href = 'https://itunes.apple.com/us/app/niu-bei-da-xue-sheng-she-jiao/id998444014?ls=1&mt=8';
					}
				}

			}
		})
	});

})