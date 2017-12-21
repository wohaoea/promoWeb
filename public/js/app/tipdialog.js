function dialog(){
	var tipdialog = {
		type:0,
		cbcall:null,
		options:null,
		render: function(txt) {
			if(this.options){
				this.type=this.options.type;
			}

			var height = document.documentElement.clientHeight;
			var stroper="";

			if(this.type==1){
				stroper="<div><div class='tipdialog_ok'>确认</div><div class='tipdialog_cancel'>取消</div></div>";
			}else{
				stroper="<div><div class='tipdialog_ok' style='width:100%'>确认</div>";
			}

			var strdialog="<div class='tipdialog_cont'><div class='tipdialog_txt'>"+(txt||"")+"</div><div class='tipdialog_hx'></div>"+stroper+"</div>";
			var strHtml="<div class='tipdialog' style='height:"+height+"px'>"+strdialog+"</div>";

			$("body").append(strHtml);

			this.event();
		},event:function(){
			var that=this;
			$('.tipdialog').click(function(){
				$(this).remove();
			});
			$(".tipdialog_ok").click(function(){
				if(typeof that.cbcall=="function"){
					that.cbcall();
				}
			});
		}
	};
	return tipdialog;

}


module.exports = function(options){
	var dia=dialog();
	dia.options=options||null;
	 return dia;
};