;
(function(window) {
	function palert(content, isclock, loading, type) {
		this.content = content; //内容
		this.isclock = isclock; //是否定时
		this.loading = loading;
		this.greatdiv();
	}
	palert.prototype.greatdiv = function() {
		var _this = this
		if (_this.loading == '1') {
			var pcontent = '<div class="bodyfix2"></div>';
			$("body").append(pcontent);
		} else {
			var pcontent = '<div class="bodyfix"></div><div class="alertcontent">' + this.content + '<div class="close"></div></div>';
			$("body").append(pcontent);
			$(".alertcontent").css({
				marginTop: '-' + px2rem($(".alertcontent").height()) + 'rem'
			});
			$(".bodyfix,.close").click(function() {
				_this.remove();
			})
		}
		if (this.isclock) {
			setTimeout(function() {
				_this.remove();
			}, 4000)
		}
	}
	palert.prototype.remove = function() {
		$(".bodyfix,.bodyfix2,.alertcontent").remove();
	}
	window.palert = palert;
})(window)