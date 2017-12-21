(function($) {
	$('.togrey').gray();
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

	/*倒计时*/

	function daojishi() {
		var arr = new Array();
		$('.cd').each(function(i) {
			$(this).data('cd').mydom = $('#'+$(this).attr('id'));
			$(this).data('cd')._ms = 0;
			$(this).data('cd')._t = '#cd-+' + i;
			arr.push($(this).data('cd'));
			//console.log(typeof(arr));
		});
		if (arr.length != 0) {
			$.timeDown(arr, function(mydom) {
				mydom.closest('li').find('.xsqgleft img').addClass('togrey');
				$('.togrey').gray();
				mydom.closest('li').find('.xianshi').remove();
				mydom.closest('li').find('.xsqgjoin').text('已结束').attr({
					href: 'javascript:;'
				}).addClass('btngray');
				mydom.css({
					background: "none"
				}).html('&nbsp;');
			});
		}
	}
	daojishi()

	/*异步加载列表*/
	function getPageList(pageIndex) {
		$.ajax({
			type: "GET",
			url: "/m7/pla/xsqglist",
			beforeSend: function() {

			},
			complete: function() {

			},
			data: {
				pageIndex: pageIndex,
				rtime: new Date().getTime()
			},
			dataType: "html",
			success: function(result) {
				$(".xsqgwrap").html(result);
				daojishi();
			},
			error: function() {

			}
		})
	}
	$('.xsqgwrap').delegate('.paing_sel', 'click', function() {
		getPageList($(this).data('index'))
	}).delegate('.paging_go', 'click', function() {
		var pageIndex = parseInt($('#handindex').val()) - 1;
		if (pageIndex >=pageDate.pageCount) {
			pageIndex = pageDate.pageCount-1
		}
		if (pageIndex <= 0) {
			pageIndex = 0;
		}
		getPageList(pageIndex)
	})

})(jQuery)