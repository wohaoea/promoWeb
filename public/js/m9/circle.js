function circleCountDownPlugin(option){
	var $container = option.container;
	//画布的宽和高
  	var w = option.width/100 * rem;
  	var h = option.height/100 * rem;
	//画笔线条的宽度
	var bigStyleW = 0.12 * rem;
	var smallStyleW = 0.06 * rem;
	//圆的半径
	var r = (w - bigStyleW)/2;
	//圆心坐标
	var circleX = r + bigStyleW/2;
	var circleY = r + bigStyleW/2;
	//分钟
	var minute = option.minute;

	$container.append('<div class="circle-count-down-plugins"></div>');
	var $panel = $(".circle-count-down-plugins");
	$panel.css({
		"width":w+"px",
		"height":h+"px",
		"margin":"0 auto",
		"position":"relative"
	});

	//绘制背景
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	$(cns).css({"position":"absolute","left":"0","top":"0","zIndex":"1"});
	cns.width  = w;
	cns.height  = h;
	ctx.strokeStyle= option.bgColor || '#999';
	ctx.lineCap = "round";
	ctx.lineWidth = smallStyleW;

	for( var i = 0 ; i < 120; i++ ){
		if(i%2==0){
			ctx.beginPath();
			ctx.arc(circleX,circleY,r,1.5*Math.PI + 2*(i/120)*Math.PI,1.5*Math.PI + 2*(i/120)*Math.PI+(2/120)*Math.PI,false);
			ctx.stroke();
		}
	}
	$panel.append(cns);

	$panel.append('<p class="clock"></p>');
	$(".clock").css({
		"font-size":"0.9rem",
		"color":"#3296fa",
		"width":"50%",
		height:"30%",
		"position":"absolute",
		"top":"0",
		"bottom":"0",
		"left":"0",
		"right":"0",
		"margin":"auto"
	});

	//绘制动态层
	cns = document.createElement('canvas');
	ctx = cns.getContext('2d');
	$(cns).css({"position":"absolute","left":"0","top":"0","zIndex":"2"});
	cns.width = w;
	cns.height = h;
	ctx.strokeStyle='#3296fa';
	ctx.lineCap = "round";
	ctx.lineWidth = bigStyleW;

	var second = minute * 60;
	var count = parseInt(rest_time/1000);//rest_time 起始时间点(单位是毫秒)

	var rate = count/second;

	var time = setInterval(function(){
		if(count<=second){
			ctx.clearRect(0,0,w,h);
			ctx.beginPath();
			ctx.arc(circleX,circleY,r,1.5*Math.PI,2*rate*Math.PI + 1.5*Math.PI,false);
			ctx.stroke();
			$(".clock").text( convert(parseInt(count/60)) + ":" + convert(parseInt(count%60)));
			count++;
			rate = count/second;
		}else{
			ctx.clearRect(0,0,w,h);
			ctx.arc(circleX,circleY,r,0*Math.PI,2*Math.PI,false);
			if( typeof option.callback == 'function'){
				option.callback();
			}
			clearInterval(time);
		}

	},1000);
	$panel.append(cns);

	function convert(number){
		if(number>=10){
			return number
		}else{
			return "0"+number;
		}
	}
}