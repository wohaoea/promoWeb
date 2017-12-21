$(function() {
    if(users !="") {
        $.get("/m4/pra/noReadMsg?strtime=" + new Date().getTime(), function (json) {
            if (json.result == "success") {
                if (json.data == 0) {
                    $("#xiaoxicount").hide();
                    return;
                }
                $("#xiaoxicount").show();
                $("#msgCount").text(json.data);
            }
        });
    }

    $("#messagemanage a").hover(
        function(){
            $("#msgCount,#xiaoxicount").css("color","#fff");
        },
        function(){
            $("#msgCount,#xiaoxicount").css("color","#fa4b4b");
        }
    );
});