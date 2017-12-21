;
$(function() {
	/*倒计时*/
	var timeDown = function(option, callback) {
		function doTimeDown() {
			for (var i = 0; i < option.length; i++) {
				var _v = formatTime((option[i]._h) + '：' + (option[i]._m) + '：' + (option[i]._s));
				(option[i]._s) --;
				if ((option[i]._s) == -1) {
					(option[i]._m) --;
					(option[i]._s) = 59;
				}
				if ((option[i]._m) == -1) {
					(option[i]._h) --;
					(option[i]._m) = 59;
				}
				var _b = ((parseInt(option[i]._h) < 0) || (parseInt(option[i]._m) < 0) || (parseInt(option[i]._s) < 0));
				if (_b) {
					_v = '已结束';
					option[i].mydom.text(_v);
					option[i].mydom
					clearTimeout(_t);
					callback(option[i].mydom);

					//return
				} else {
					_v = formatTime((option[i]._h) + '：' + (option[i]._m) + '：' + (option[i]._s));
					option[i].mydom.text(_v);
				}
			}
			_t = setTimeout(doTimeDown, 1000);
			//return _v; 
		}

		function formatTime(_time) {
			return _time.replace(/\b(\w)\b/g, '0$1');
		}
		_t = setTimeout(doTimeDown, 1000);

	}
	$.timeDown = timeDown;
	/*弹出层*/
	var layerTip = function(flag) {
		var tiplayer = '<div class="boxfixed" style="height:' + px2rem($(document).height()) + 'rem"></div><div class="shareTip" style="top:' + (px2rem($(window).scrollTop()) + 0.3) + 'rem"></div>';
		$('body').append(tiplayer);
		//creattip(true);
		$('.boxfixed,.shareTip').bind('touchstart', function(event) {
			$('.boxfixed,.shareTip').remove();
		})
	};
	var layer = function(opt) {
		var arg = {
			html: '',
			callback: function() {},
			background: '#ffaf19',
			bindEvent: function() {},
			lock: true,
			closebtn: true,
			removewrap: function() {
				$('.layerwrap,.boxfixed').remove();
			},
			removewraplay: function() {
				$('.layerwrap').remove();
			}
		}
		opt = $.extend(arg, opt);
		var lockbg = opt.lock && '<div class="boxfixed" style="height:' + px2rem($(document).height()) + 'rem"></div>';
		var closebtn = opt.closebtn ? '<div class="layerClose"></div>' : '';
		if (!lockbg) {
			var layer = '<div class="layerwrap" style="' + 'background:' + opt.background + 'display:none">' + closebtn + opt.html + '</div>';
		} else {
			var layer = lockbg + '<div class="layerwrap" style="' + 'background:' + opt.background + 'display:none">' + closebtn + opt.html + '</div>';
		}
		$('body').append(layer);
		var top = px2rem(($(window).height() - $('.layerwrap').height()) / 2);
		var left = px2rem(($(window).width() - $('.layerwrap').width()) / 2);
		var scrollTop = px2rem($(document).scrollTop());
		var scrollLeft = px2rem($(document).scrollLeft());
		$('.layerwrap').css({
			'top': (top + scrollTop) + 'rem',
			'left': (left + scrollLeft) + 'rem',
			'display': 'block',
			'background': opt.background
		});
		opt.bindEvent = (function() {
			$('.layerClose').bind('touchstart', function() {
				$('.layerwrap,.boxfixed').remove();
			})
		})();
		opt.callback();
	}
	$.layerTip = layerTip;
	$.layer = layer;

	/*滑动到底部加载分页*/
	//获取滚动条当前的位置 
	function getScrollTop() {
		var scrollTop = 0;
		if (document.documentElement && document.documentElement.scrollTop) {
			scrollTop = document.documentElement.scrollTop;
		} else if (document.body) {
			scrollTop = document.body.scrollTop;
		}
		return scrollTop;
	}

	//获取当前可是范围的高度 
	function getClientHeight() {
		var clientHeight = 0;
		if (document.body.clientHeight && document.documentElement.clientHeight) {
			clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
		} else {
			clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
		}
		return clientHeight;
	}

	//获取文档完整的高度 
	function getScrollHeight() {
		return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
	}

	function getBottomRefresh(totalPage, callback, callback2) {
		var count = 1;

		window.onscroll = function() {
			if (getScrollTop() + getClientHeight() >= getScrollHeight()) {
				if (count == totalPage) {
					callback2(count);
					count++;
					return
				}
				if (count > totalPage) {
					//callback2(count);
					count++;
					return
				}
				count++;
				callback(count);

			}
		}
	}
	window.getBottomRefresh = getBottomRefresh;

});

/*众人帮加息活动*/
;
$(function() {
	/*分享页 及帮助页*/
	function getTimeDown() {
		if (typeof(ishare) != 'undefined') {
			if (ishare == 1) {
				var yyy = 0;
				$(document).bind('touchstart', function(event) {
					yyy = event.originalEvent.targetTouches[0].pageY;
				}).bind('touchmove', function(event) {
					if (event.originalEvent.targetTouches[0].pageY != yyy) {
						//event.preventDefault()
						event.originalEvent.targetTouches[0].pageY = yyy;
					}
					//event.preventDefault();
				})
				$(".jxbtnshare").bind('touchstart', function(event) {
					$.layerTip()
				});
				getBottomRefresh(totalPage, function(count) {
						$.ajax({
							type: "GET",
							url: "/m6/pla/interestshare/" + recordNo,
							dataType: "html",
							data: {
								page: count
							},
							beforeSend: function() {
								var melayer = '<div class="boxfixed" style="height:' + px2rem($(document).height()) + 'rem;background:none"></div>';
								var loadbox = '<li class="hasnomsg1">加载中~~</li>';
								$(melayer).appendTo('body');
								$(".liebiaowrap>ul").append(loadbox);
								$('.boxfixed').bind('touchstart', function(event) {
									event.preventDefault();
								}).bind('touchmove', function(event) {
									event.preventDefault();
								}).bind('touchend', function(event) {
									event.preventDefault();
								});
							},
							complete: function() {
								$('.boxfixed,.hasnomsg1').remove()
							},
							timeout: 10000,
							success: function(result) {
								if (typeof(result.url) != 'undefined') {
									window.location.href = result.url
									return
								}
								//var loadbox = '<li class="hasnomsg111">ajax后~~</li>';
								$(".liebiaowrap>ul").append(result);

							},
							error: function(err) {
								alert('数据加载异常')
							}
						});
					},
					function(count) {
						$('.boxfixed,hasnomsg').remove()
						//var lastbox = '<li class="hasnomsg">没有更多信息可加载啦~~</li>';
						//$(".liebiaowrap>ul").append(lastbox);
					});
				var myarr = [];
				if ($('.countdownbox').length == 0) {
					return
				}
				$('.countdownbox').data('cd').mydom = $('#countdownbox');
				$('.countdownbox').data('cd')._t = '#+countdownbox';
				myarr.push($('.countdownbox').data('cd'));
				$.timeDown(myarr, function(mydom) {
					mydom.css({
						color: '#969696'
					});
					$.ajax({
						type: "GET",
						url: "/m6/pla/hqjxz/" + recordNo,
						dataType: "json",
						data: {},
						beforeSend: function() {},
						complete: function() {},
						timeout: 10000,
						success: function(result) {
							$('.mytip').text('加息完成，恭喜您获得' + result.data.addRate + '%加息');
						},
						error: function() {}
					});
					if ((investRecordDetail.isAddRate) == true && (investRecordDetail.isHaveRedEnvelope == false)) {
						//$(".mytip").remove()
					} else {
						$(".jxbtnhelp,.jxbtnhelplqhbed").remove();
					}
					$(".liebiaowrap").css({
						'marginTop': '0.5rem'
					});
				});

			}
		}
	};
	getTimeDown()
		/*	$.layer({
							html: '<h3 style="line-height:2.3rem">成功为TA加息<span>+' + 0.28 + '%</span></h3><p>恭喜你！获得<span class="huang">牛娃红包</span>一份</p><a class="masquedinghongbao" href="javscript:void(0)"><img src="/imgs/sdhd/quedinghongbao.png"/></a>',
							lock: true,
							callback: function() {

							}
						});
			$.layer({
					html: '<h3>填写手机号，绑定牛娃红包</h3><div class="inputbox"><input type="tel" placeholder="输入手机号" id="mephonenum"/><div class="errmsg"></div></div><div class="tijiao"></div><div class="tijiaoz"></div>',
					callback: function() {
					 }
			 })

	$.layer({
			html: '<h3>恭喜您获得<span>20元<span>牛娃红包</h3><p>红包已发放至您的账户</p><p>有效期至：2016-01-16</p><a class="ljzcbtn" href=""><img src="/imgs/sdhd/ljzc.png"/></a>',
			lock: true,
			callback: function() {

			}
		});
$.layer({
		html: '<h3 style="padding-top:1.2rem">该手机号已领取过牛娃红包</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
		lock: false,
		callback: function() {

		}
	});
*/

	var func = null

	function vaditionphone(mobile, fn, callback) {
		if (mobile == '') {
			func = '请输入手机号';
			fn()
			return
		}
		if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(mobile)) {
			func = '请输入有效手机号码';
			fn()
			return;
		}
		callback()

	}
	/*领取红包*/
	function getlqhongbao() {
		if (isSelf) {
			$.ajax({
				type: "GET",
				url: "/m6/pla/jxlhb/" + recordNo,
				dataType: "json",
				data: userinfo,
				beforeSend: function() {
					$('.tijiao').hide();
					$('.tijiaoz').show();
				},
				complete: function() {
					$('.tijiao').show();
					$('.tijiaoz').hide();
				},
				timeout: 10000,
				success: function(result) {
					//_this.removewraplay();
					if (result.success) {
						if (result.data.isExist) {
							$.layer({
								html: '<h3>该手机号已领取过牛娃红包</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
								lock: false,
								callback: function() {

								}
							});
							return
						}
						if (result.data.isRegister == false) {
							$.layer({
								html: '<h3>恭喜您获得<span>20元<span>牛娃红包</h3><p>红包已发放至您的账户</p><p>有效期至：' + result.endtime + '</p><a class="ljzcbtn" href="' + result.domh5 + 'user/reg?sid=1118&mob=' + mobile + '"><img src="/imgs/sdhd/ljzc.png"/></a>',
								lock: true,
								callback: function() {

								}
							});
							return
						}
						if (result.data.isRegister) {
							$.layer({
								html: '<h3>恭喜您获得<span>20元<span>牛娃红包</h3><p>&nbsp;</p><p>红包已发放至您的账户</p><a class="ljzcbtn" href="' + result.domh5 + 'user/login?tourl=/account/redpacket"><img src="/imgs/sdhd/chakanhongbao.png"/></a>',
								lock: false,
								callback: function() {

								}
							});
							return
						}
					} else {
						$.layer({
							html: '<h3 style="padding-top:1.2rem">' + result.msg + '</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
							lock: false,
							callback: function() {

							}
						});
					}
				},
				error: function(err) {
					//_this.removewraplay();
					$.layer({
						html: '<h3 style="padding-top:1.2rem">网络超时</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
						lock: false,
						callback: function() {

						}
					});
				}
			});
			return
		}

		if (myinfo.phoneNumber) {
			//alert(myinfo.phoneNumber);
			userinfo.mobile = myinfo.phoneNumber;
			userinfo.ttime = new Date().getTime();
			$.ajax({
				type: "GET",
				url: "/m6/pla/jxlhb/" + recordNo,
				dataType: "json",
				data: userinfo,
				beforeSend: function() {
					$('.tijiao').hide();
					$('.tijiaoz').show();
				},
				complete: function() {
					$('.tijiao').show();
					$('.tijiaoz').hide();
				},
				//timeout: 10000,
				success: function(result) {
					//alert(result)
					//	_this.removewraplay();
					if (result.success) {
						if (result.data.isExist) {
							$.layer({
								html: '<h3>该手机号已领取过牛娃红包</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
								lock: false,
								callback: function() {}
							});
							return
						}
						//alert(result.data.isRegister);
						if (result.data.isRegister == false) {
							$.layer({
								html: '<h3>恭喜您获得<span>20元<span>牛娃红包</h3><p>红包已发放至您的账户</p><p>有效期至：' + result.endtime + '</p><a class="ljzcbtn" href="' + result.domh5 + 'user/reg?sid=1118&mob=' + userinfo.mobile + '"><img src="/imgs/sdhd/ljzc.png"/></a>',
								lock: true,
								callback: function() {

								}
							});
							return
						}
						if (result.data.isRegister) {
							$.layer({
								html: '<h3>恭喜您获得<span>20元<span>牛娃红包</h3><p>&nbsp;</p><p>红包已发放至您的账户</p><a class="ljzcbtn" href="' + result.domh5 + 'user/login?tourl=/account/redpacket"><img src="/imgs/sdhd/chakanhongbao.png"/></a>',
								lock: false,
								callback: function() {

								}
							});
							return
						}
					} else {
						//alert(2);
						$.layer({
							html: '<h3 style="padding-top:1.2rem">' + result.msg + '</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
							lock: false,
							callback: function() {

							}
						});
					}
				},
				error: function(err) {
					//_this.removewraplay();
					$.layer({
						html: '<h3 style="padding-top:1.2rem">网络超时</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
						lock: false,
						callback: function() {

						}
					});
				}
			});
			return
		}
		$.layer({
			html: '<h3>填写手机号，绑定红包</h3><div class="inputbox"><input type="tel" placeholder="输入手机号" id="mephonenum"/><div class="errmsg"></div></div><div class="tijiao"></div><div class="tijiaoz"></div>',
			lock: true,
			callback: function() {
				var _this = this;
				$("#mephonenum").focus();
				$('.errmsg').text('');
				$('.boxfixed').bind('touchstart', function(event) {
					event.preventDefault();
				}).bind('touchmove', function(event) {
					event.preventDefault();
				}).bind('touchend', function(event) {
					event.preventDefault();
				});
				$("#mephonenum").focus(function() {
					$('.errmsg').text('');
				});
				$(".tijiao").bind('touchstart', function(event) {
					var mobile = $("#mephonenum").val();
					vaditionphone(mobile, function() {
							$('.errmsg').text(func);
						}, function() {
							userinfo.mobile = mobile;
							userinfo.ttime = new Date().getTime()
							$.ajax({
								type: "GET",
								url: "/m6/pla/jxlhb/" + recordNo,
								dataType: "json",
								data: userinfo,
								beforeSend: function() {
									$('.tijiao').hide();
									$('.tijiaoz').show();
								},
								complete: function() {
									$('.tijiao').show();
									$('.tijiaoz').hide();
								},
								timeout: 10000,
								success: function(result) {
									_this.removewraplay();
									if (result.success) {
										if (result.data.isExist) {
											$.layer({
												html: '<h3>该手机号已领取过牛娃红包</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
												lock: false,
												callback: function() {

												}
											});
											return
										}
										if (result.data.isRegister == false) {
											$.layer({
												html: '<h3>恭喜您获得<span>20元<span>牛娃红包</h3><p>红包已发放至您的账户</p><p>有效期至：' + result.endtime + '</p><a class="ljzcbtn" href="' + result.domh5 + 'user/reg?sid=1118&mob=' + mobile + '"><img src="/imgs/sdhd/ljzc.png"/></a>',
												lock: false,
												callback: function() {

												}
											});
											return
										}
										if (result.data.isRegister) {
											$.layer({
												html: '<h3>恭喜您获得<span>20元<span>牛娃红包</h3><p>&nbsp;</p><p>红包已发放至您的账户</p><a class="ljzcbtn" href="' + result.domh5 + 'user/login?tourl=/account/redpacket"><img src="/imgs/sdhd/chakanhongbao.png"/></a>',
												lock: false,
												callback: function() {

												}
											});
											return
										}
									} else {
										$.layer({
											html: '<h3 style="padding-top:1.2rem">' + result.msg + '</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
											lock: false,
											callback: function() {

											}
										});
									}
								},
								error: function(err) {
									_this.removewraplay();
									$.layer({
										html: '<h3 style="padding-top:1.2rem">网络超时</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
										lock: false,
										callback: function() {

										}
									});
								}
							});
						})
						//$('.errmsg').text(vaditionphone(moblie));
						//_this.removewrap() //关闭兑换框
				});
			}
		});
		return false
	}

	/*按钮点击事件*/
	$('.jxbtnhelplqhb').bind('touchend', function(event) {
		getlqhongbao()
	});
	$('.jxbtnhelp').bind('touchend', function(event) {
		$.ajax({
			type: "GET",
			url: "/m6/pla/jxhelp/" + recordNo,
			dataType: "json",
			data: userinfo,
			beforeSend: function() {
				var melayer = '<div class="boxfixed" style="height:' + px2rem($(document).height()) + 'rem;background:none"></div>';
				$(melayer).appendTo('body');
			},
			complete: function() {

			},
			timeout: 10000,
			success: function(result) {
				$('.boxfixed').remove();
				if (result.success) {
					if (result.data.isOver) {
						$.layer({
							html: '<h3 style="padding-top:1.2rem">已经有很多人帮TA 完成加息啦！</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
							lock: true,
							callback: function() {

							}
						});
						return
					}
					$.layer({
						html: '<h3 style="line-height:2.3rem">成功为TA加息<span>+' + result.data.addRate + '%</span></h3><p>恭喜你！获得<span class="huang">牛娃红包</span>一份</p><a class="masquedinghongbao" href="javscript:void(0)"><img src="/imgs/sdhd/quedinghongbao.png"/></a>',
						lock: true,
						callback: function() {
							var orrate = parseFloat($(".yijiashouyi>span").text());
							$.get('/m6/pla/getInvestRecordDetail/' + recordNo, userinfo, function(result) {
								//var addrate = parseFloat()
								$(".yijiashouyi>span").text(result.addRate);
								if(result.addRate=='1'){
									window.location.reload(true);
								}
							});
							var myinfoobj = userinfo;
							myinfoobj.page = 1;
							$.get('/m6/pla/interestshare/' + recordNo, myinfoobj, function(result) {
								$(".liebiaowrap>ul").empty().append(result);
							});
							$(".masquedinghongbao").bind('touchend', function(event) {
								getlqhongbao();
							})
						}
					});
				}
			},
			error: function(err) {
				$('.boxfixed').remove();
				$.layer({
					html: '<h3 style="padding-top:1.2rem">网络繁忙，稍后再试！</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
					lock: true,
					callback: function() {

					}
				});
			}
		})
	})

	$('.jxbtnhelplqhbed').bind('touchend', function(event) {
		$.layerTip();
	});
	$('.jxbtnhelplqhbedother').bind('touchend', function(event) {
		window.location.href = h5url + 'user/reg?sid=1118&mob=' + $(this).data('moblie');
	});

});