(function($) {
	function alert(content, type) {
		this.content = content;
	}
	alert.prototype.Greatdiv = function() {
		var _this = this
		var pcontent = '<div class="bodyfix"></div><div class="alertcontent">' + this.content + '<div class="close"></div></div>';
		$("body").append(pcontent);
		$(".alertcontent").css({
			marginTop: '-'+px2rem($(".alertcontent").height())+'rem'
		});
		$(".bodyfix,.close").click(function() {
			_this.remove();
		})
	}
	alert.prototype.remove = function() {
		$(".bodyfix,.alertcontent").remove();
	}
	
})($)