
var currentindex = 0;
var timerID;
// JavaScript Document
$(function() {
	//slider
	$(".niuwa-slider").hover(function() {
		stopSlider();
	}, function() {
		startSlider();
	});
	startSlider();

	$(".slider-nav>ul>li").hover(function() {
		stopSlider();
		clickNav($(this).index());
	}, function() {
		startSlider();
	});

	$(window).resize(function() {
		prevNextResize();
	});
	prevNextResize();
	prevNext();
});


//调用slider

$.fn.niuwaSilder = function(params) {
	options = {
		currentindex: 0,
		timerID: null
	}
	$.extend(options, params);
}


function niuwaSilder(i) {
	currentindex = i;
	//$(".niuwa-slider>ul>li").is(":animated").stop();
	for (j = 0; j < $(".niuwa-slider ul li").length; j++) {
		if (j == i) {
			var _this = $(".niuwa-slider>ul>li").eq(j);
			_this.fadeIn();
			$(".slider-nav>ul>li").eq(j).addClass("active");
		} else {
			$(".niuwa-slider>ul>li").eq(j).fadeOut();
			$(".slider-nav>ul>li").eq(j).removeClass();
		}
	}
	clearInterval(timerID);
	startSlider()
}

function startSlider() { //及时器开
	timerID = setInterval("timerTick()", 4000); //4000代表间隔时间设置
}

function stopSlider() { //及时器关
	clearInterval(timerID);
}

function timerTick() { //循环遍历
	currentindex = currentindex >= $(".niuwa-slider ul li").length - 1 ? 0 : currentindex + 1;
	niuwaSilder(currentindex);
}

function clickNav(i) {
	$(".niuwa-slider>ul>li").fadeOut();
	$(".slider-nav>ul>li").removeClass();
	$(".niuwa-slider>ul>li").eq(i).fadeIn();
	$(".slider-nav>ul>li").eq(i).addClass("active");
	currentindex = i
}

function prevNext() {
	prev = function() {
		stopSlider();
		$(".niuwa-slider>ul>li").fadeOut();
		$(".slider-nav>ul>li").removeClass();
		currentindex = currentindex <= 0 ? 3 : currentindex - 1;
		$(".niuwa-slider>ul>li").eq(currentindex).fadeIn();
		$(".slider-nav>ul>li").eq(currentindex).addClass("active");
		startSlider();
	};
	next = function() {
		stopSlider();
		$(".niuwa-slider>ul>li").fadeOut();
		$(".slider-nav>ul>li").removeClass();
		currentindex = currentindex >= 3 ? 0 : currentindex + 1;
		$(".niuwa-slider>ul>li").eq(currentindex).fadeIn();
		$(".slider-nav>ul>li").eq(currentindex).addClass("active");
		startSlider();
	};

	$(".prev").click(function() {
		prev()
	});
	$(".next").click(function() {
		next()
	});

}

function prevNextResize() {
	if ($(window).width() >= 1226) {
		$(".prev").css("display", "block");
		$(".next").css("display", "block");
	} else {

		$(".prev").css("display", "none");
		$(".next").css("display", "none");
	}
}