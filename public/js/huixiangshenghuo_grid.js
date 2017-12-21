(function($) {
	$(".wappitem").click()
		/*异步加载列表*/
	function getPageList(pageIndex) {
		$.ajax({
			type: "GET",
			url: "/m7/pla/channel/" + channel,
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
				initShopClick && initShopClick();
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