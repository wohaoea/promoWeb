$(document).ready(function() {
	$('.repay_2').stop().click(function(){

	
			var ajax_url;
			if(repayType == "r1") {
				ajax_url = '/m9/single_repay'
			} else if(repayType == "r2") {
				ajax_url = '/m9/advance_repay'
			}
			
				$.ajax({
						type: "post",
						url: ajax_url,
						data: {
							loanId: loanId,
							repayPlanList: id_send,
							repayType: repayType,
							id_send: id_send
						},
						success: function(result) {
							if(result.success) {
								window.location.href = '/m9/repay_success/1'
							} else {
								window.location.href = '/m9/repay_success/2'
							}
						}
					})

				
	})
})
