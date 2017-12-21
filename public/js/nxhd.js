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

/*双蛋活动*/
;
$(function() {
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

	/*	$.layer({
			html: '<h3>恭喜您获得<span>18.28元<span>现金券</h3><p>现金券已发放至您的账户</p><p>有效期至：2016-01-16</p><a class="chakanxjq" href=""><img src="/imgs/sdhd/chakanxjq.png"/></a>',
			lock: false,
			callback: function() {

			}
		});*/
	/*$.layer({
			html: '<h3>恭喜您获得<span>18.28元<span>现金券</h3><p>现金券已发放至您的账户</p><p>有效期至：2016-01-16</p><a class="ljzcbtn" href=""><img src="/imgs/sdhd/ljzc.png"/></a>',
			lock: false,
			callback: function() {

			}
		});*/
	/*$.layer({
		html: '<h3 style="padding-top:1.2rem">该手机号已抢过银蛋现金券</h3><p>&nbsp;</p><p>感谢您对牛娃互联网金融的支持！</p>',
		lock: false,
		callback: function() {

		}
	});
*/
	$(".btnlq").bind('touchend', function(event) {
			$.layer({
				html: '<h3>填写手机号，绑定红包</h3><div class="inputbox"><input type="tel" placeholder="输入手机号" id="mephonenum"/><div class="errmsg"></div></div><div class="tijiao"></div><div class="tijiaoz"></div>',
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
								userinfo.tel = mobile;
								userinfo.ttime = new Date().getTime();
								$.ajax({
									type: "GET",
									url: "/m8/pla/getjxq",
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
											if (result.telVali == '0') {
												$.layer({
													html: '<h3>恭喜您获得<span>' + result.amount + '元</span>红包</h3><p>红包已发放至您的账户</p><p>有效期至：' + result.endtime + '</p><a class="ljzcbtn" href="'+ result.domh5 + 'user/reg?sid=1119&mob='+mobile+'"><img src="/imgs/sdhd/ljzc.png"/></a>',
													lock: false,
													callback: function() {
														$.get('/m8/pla/sdh5lqlist',myinfo, function(result) {
															$(".liebiaowrap>ul").empty().append(result);
														});
													}
												});
												return
											}
											if (result.telVali == '1') {
												$.layer({
													html: '<h3>恭喜您获得<span>' + result.amount + '元</span>红包</h3><p>&nbsp;</p><p>红包已发放至您的账户</p><a class="chakanxjq" href="' + result.domh5 + 'user/login"><img src="/imgs/sdhd/chakanhongbao.png"/></a>',
													lock: false,
													callback: function() {
														$.get('/m8/pla/sdh5lqlist',myinfo, function(result) {
															$(".liebiaowrap>ul").empty().append(result);
														});
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
		})

	
		/*微信弹出分享提示*/
	$(".btnshare,.vedbtnlq").bind('touchstart', function(event) {
		$.layerTip();
	});

	function getEndTime(data) {
		var bimonth = ((parseInt(new Date(data).getMonth()) + 2) < 10) ? ('0' + (parseInt(new Date(data).getMonth()) + 2)) : (parseInt(new Date(data).getMonth()) + 2);
		var birday = (parseInt(new Date(data).getDate()) < 10) ? ('0' + parseInt(new Date(data).getDate())) : (parseInt(new Date(data).getDate()));;
		if (parseInt(new Date(data).getMonth()) + 1 == 12) {
			return (parseInt(new Date(data).getFullYear()) + 1) + '-' + '01' + '-' + birday;
		}
		return new Date(data).getFullYear() + '-' + bimonth + '-' + birday;
	}

	$('.vbtnlq').bind('touchstart', function(event) {
		var that = $(this);
		/*$.layer({
			html: '<h3>恭喜您获得<span>' + "11111" + '元</span>现金券</h3><p>现金券已发放至您的账户</p><p>有效期至：' +"111111" + '</p><a class="ljzcbtn" href="' + "result.domh5" + 'user/reg' + '"><img src="/imgs/sdhd/ljzc.png"/></a>',
			callback: function() {

			}
		});*/
		$.layer({
			html: '<h3>恭喜您获得<span>' + that.data('amount') + '元</span>红包</h3><p>红包已发放至您的账户</p><p>有效期至：' + getEndTime(that.data('overtime')) + '</p><a class="ljzcbtn" href="' + h5url + 'user/reg?sid=1119&mob=' + that.data('tel') + '"><img src="/imgs/sdhd/ljzc.png"/></a>',
			callback: function() {

			}
		});
		return
	})
});

/*众人帮加息活动*/
;
$(function() {
	var arr = new Array();
	$('.cd').each(function(i) {
		$(this).data('cd').mydom = $('#cd-' + i);
		$(this).data('cd')._t = '#cd-+' + i;
		arr.push($(this).data('cd'));
		//console.log(typeof(arr));
	});
	/*倒计时*/
	$.timeDown(arr, function(mydom) {
		mydom.closest("li").addClass('hdover').find('.rightarrow').remove();
	});

	/*点击跳转*/
	$('.jxlist>ul>li').bind('touchend', function(event) {
		window.location.href = $(this).data('url');
	});

	/*分享页 及帮助页*/
	function getTimeDown() {
		if (typeof(ishare) != 'undefined') {
			if (ishare == 1) {
				var yyy=0;
				$(document).bind('touchstart',function(event){
						yyy=event.originalEvent.targetTouches[0].pageY;
				}).bind('touchmove', function(event) {
					if(event.originalEvent.targetTouches[0].pageY!=yyy){
						//event.preventDefault()
						event.originalEvent.targetTouches[0].pageY=yyy;
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
							//timeout: 10000,
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
						var lastbox = '<li class="hasnomsg">没有更多信息可加载啦~~</li>';
						$(".liebiaowrap>ul").append(lastbox);
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
					$(".mytip,.jxbtnshare").remove();
					$(".liebiaowrap").css({
						'marginTop': '0.5rem'
					});
				});

			}
		}
	};
	getTimeDown()



});