$(function(){
    $(".niuwa-header-menu>ul>li").hover(
        function() {
            if (!$(this).children(".header-menu-child").is(":animated")) {
                $(this).children(".header-menu-child").slideDown(100);
            }
        },
        function() {
            $(this).children(".header-menu-child").slideUp(100);
        }
    );
});