/*
 * jQuery - jcMarquee v0.10
 * Copyright(c) 2012 by Riddick-design 
 * Date: 2012-01-07
 * 相关参数 
   'marquee':'x',        \\ 设置滚动方向，提供 marquee:x 或 marquee:y
   'margin_bottom':'0',  \\ 设置margin_bottom值
   'margin_right':'0',   \\ 设置margin_right值
   'speed':'10'          \\ 设置滚动速度,单位mm
 * 重要提醒
   #Marquee_x ul li { float:left;} // 横向滚动时必须让所有li左浮动 
 * HTML结构
   <div id="Marquee"> 
         <ul> 
              <li> 
                  <div><img height="50" width="100" alt="图片1" /></div>
              </li>
         </ul> 
   </div>  
 */
;
(function($) {
	var distance = 0;
	$.fn.jcMarquee = function(options) {
		var defaults = {
			'marquee': 'x',
			'margin_bottom': '0',
			'margin_right': '0',
			'speed': '10'
		};
		var options = $.extend(defaults, options);
		return this.each(function() {
			var $marquee = $(this),
				$marquee_scroll = $marquee.children('ul');
			$marquee_scroll.find('li').clone().appendTo($marquee_scroll);
			var $marquee_left = $marquee_scroll.find('li');
			$marquee_scroll.css('width', '1000%');
			$(".sliderbarR").hover(function() {
				options.marquee = 'x'
			})
			$(".sliderbarL").hover(function() {
				options.marquee = '-x'
			})

			function Marquee_x() {
				if (options.marquee == 'x') {
					var x = distance;
					$marquee.scrollLeft(++x);
					distance = x;
					//console.log(($marquee_left.size() / 2) * ($marquee_left.outerWidth())+'======'+x+"=========="+distance);
					if (x >=1451){
						distance=x = 0;
						//distance=0
					};
				}
				if (options.marquee == '-x') {
					var x = distance;
					$marquee.scrollLeft(--x);
					distance = x;
					if (x <= 0) {
						distance=x=1451;
						//distance=0
					};
				};
			}
			var MyMar = setInterval(Marquee_x, options.speed);
			$marquee.hover(function() {
				clearInterval(MyMar);
			}, function() {
				MyMar = setInterval(Marquee_x, options.speed);
			});
		});
	};


})(jQuery)