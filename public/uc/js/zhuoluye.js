$(function(){
	
	$('#container').fullpage({
		
		
	});
	
	
	timer1= setInterval(aa,1000);


		var flag=1;
		function aa(){
			if(flag){
				$("#m1").animate({'top':"95%"},1000);
				$("#m2").animate({'top':"95%"},1000);
				$("#m3").animate({'top':"42%"},1000);
				flag=0
			}else{
				$("#m1").animate({'top':"93%"},1000);
				$("#m2").animate({'top':"93%"},1000);
				$("#m3").animate({'top':"44%"},1000);
				flag=1
			}
		}
	
	
		$("#m1").click(function(){
		
			$.fn.fullpage.moveSectionDown()
		})
	
		$("#m2").click(function(){
		
			$.fn.fullpage.moveSectionDown()
		})
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});
