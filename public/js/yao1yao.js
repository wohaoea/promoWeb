$(function() {
		var rAF = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 0);
		};

	var myShakeEvent = new Shake({
		threshold: 15, // optional shake strength threshold
		timeout: 1000 // optional, determines the frequency of event generation
	});
	myShakeEvent.start();
	window.addEventListener('shake', shakeEventDidOccur, false);
	/*
	var pfx = ["webkit", "moz", "MS", "o", ""];

	function prefixedEvent(element, type, callback) {
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p]) type = type.toLowerCase();
			element.addEventListener(pfx[p] + type, callback, false);
		}
	}*/
	//prefixedEvent($(".y")[0], "AnimationEnd", animationListener);

	function shakeEventDidOccur() {
		
		if ($(".yaoyaoresult").css("display") == "block") {
			return;
		}

		$("#shake_sound_male")[0].play();

		setTimeout(function() {
			$(".y").css("animation", "");
			$(".y").css("-webkit-animation", "");
			$("#shake_match")[0].play();
			$("body").css("background", "#820078");
			$(".yaoyaoresult").show();
			$(".yaoyaoreg").hide();
			rAF(function() {
				$(".yaoyaoresultbg").css("-webkit-transform", "scale(1)")
			});
		}, 1500);
	}

	$(".yaobtn").click(function() {
		$(".y").css("animation", "");
		$(".y").css("-webkit-animation", "");
		$(".yaoyaoreg").hide();
		$("body").css("background", "#820078");
		$(".yaoyaoresult").show();
		rAF(function() {
			$(".yaoyaoresultbg").css("-webkit-transform", "scale(1)")
		});



	});

});
