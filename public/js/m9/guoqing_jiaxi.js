$(document).ready(function(){
	
		$('.no_get_1').click(function(){
			
			
			
			$.get('/m9/check_login',{},function(data){
				if(data.url){return window.location.href = data.url;}

				$('.confirm').show();
				$('.gift').show();
			})
		})
		
	
		$('.no_get').click(function(){
				
			 $.get('/hd/guoqing2',{
            
            },function(data){
            	if(data.success&&data.data!="received"){
            		$('body').css({'background':' url(/imgs/m9/jx.png);background-size:cover'});
            		$('.jiaxi_paisong').hide();
					$('.no_get').hide();
					$('.get').hide();
					$('.confirm').show();
					$('.gift').show();
            	}
            })
		})
	
		$('.confirm').click(function(){
			window.location.href = index;
		})







})