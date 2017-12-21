;(function($) {
     var goToTopTime = null;
     $.fn.goToTop = function(options) {
         var opts = $.extend({}, $.fn.goToTop.def, options);
         var $window = $(window);
         $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'); // opera fix

         var shouldvisible = ($window.scrollTop() >= opts.startline) ? true : false;

         var $this = $(this);
         if (shouldvisible) {
             $("#zhongzhi").css({
                 "position": "relative",
                 "top": "0"
             });
             $this.stop().css({
                 "visibility": "visible"
             });

         } else {
             $this.stop().css("visibility", "hidden");
             $("#zhongzhi").css({
                 "position": "relative",
                 "top": "50px"
             });
         }

         $(this).click(function(event) {
             $body.stop().animate({
                 scrollTop: $(opts.targetObg).offset().top
             }, opts.duration);
             $(this).blur();
             event.preventDefault();
             event.stopPropagation();
         });
     };


     $.fn.floatright = function(options) {
         var opts = $.extend({}, $.fn.goToTop.def, options);
         var $window = $(window);
         $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'); // opera fix
         //$(this).hide();
         var $this = $(this);
         goToTopTime = setTimeout(function() {
             var controlLeft;
             if ($window.width() > opts.pageHeightJg * 2 + opts.pageWidth) {
                 controlLeft = ($window.width() - opts.pageWidth) / 2 + opts.pageWidth + opts.pageWidthJg;
             } else {
                 controlLeft = $window.width() - opts.pageWidthJg - $this.width();
             }
             var cssfixedsupport = $.browser.msie && parseFloat($.browser.version) < 7; //判断是否ie6

             var controlTop = $window.height() - $this.height() - opts.pageHeightJg;

             controlTop = cssfixedsupport ? $window.scrollTop() + controlTop : controlTop;


             $this.css({
                 position: cssfixedsupport ? 'absolute' : 'fixed',
                 top: controlTop,
                 left: controlLeft
             });
         }, 30);
     };

     $.fn.goToTop.def = {
         pageWidth: 1000, //页面宽度
         pageWidthJg: 15, //按钮和页面的间隔距离
         pageHeightJg: 130, //按钮和页面底部的间隔距离
         startline: 130, //出现回到顶部按钮的滚动条scrollTop距离
         duration: 3000, //回到顶部的速度时间
         targetObg: "body" //目标位置
     };

 })(jQuery);


 $(function() {
     $('<div class="shortcut shortcut1"><a href="javascript:;" class="summergotop gotop" title="返回顶部"></a></div>').appendTo("body");
     
     $(".shortcut").floatright();
     $(window).bind('scroll resize', function() {
         $(".summergotop").goToTop({
             duration: 400
         });
         $(".shortcut").floatright();
     });
     $(".summergotop").goToTop();
 });