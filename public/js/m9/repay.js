$(document).ready(function(){
	var m=$('.container > div').eq(0).find('li').length
		if(m>6){
			$('.container > div').eq(0).find('li:last-of-type').css('padding-bottom','2.3rem')
		}
//	$('.container > div').hide()
//	$('.container > div').eq(0).show()
	$('.container_top li').click(function(){
		
	
		alert($(this).data("type"))
		window.location.href="/m9/repay/"+$(this).attr("id");
		var height = Math.max($(window).height(), $(document.body).height());
		$("body").css('min-height', height);
		
		
		
//		if($(this).index()==2){
//			$('.footer').hide()
//		}else{
//			$('.footer').show()
//		}
//		$(this).siblings().removeClass('active')
//		$(this).addClass('active')
//		$('.container > div').hide()
//		$('.container > div').eq($(this).index()).show()
		var m=$('.container > div').eq($(this).index()).find('li').length
		if(m>6){
			$('.container > div').eq($(this).index()).find('li').eq(m-1).css('padding-bottom','2.3rem')
		}
			
	})
	
	
	var height = Math.max($(window).height(), $(document.body).height());
		$("body").css('min-height', height);
	
	

	
	
	
	
	
	
	
})