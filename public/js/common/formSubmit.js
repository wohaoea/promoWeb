/**
 * Created by Administrator on 2016/7/15.
 */
var formSubmit = {
    get:function (action, json, blank) {
        var　tempForm　=　document.createElement("form");
        tempForm.action=action;
        tempForm.method="get";
        if(blank){
            tempForm.target = "_blank";
        }
        document.body.appendChild(tempForm);

        for(var key in json){
            var　tempInput　=　document.createElement("input");
            tempInput.type="hidden";
            tempInput.name=key;
            tempInput.value=json[key];　//the　parameter　of　method　in　the　code　of　DispatchAction.　
            tempForm.appendChild(tempInput);
        }
        tempForm.submit();
        tempForm.remove()
    },
    post:function (action, json, blank) {
        var　tempForm　=　document.createElement("form");
        tempForm.action=action;
        tempForm.method="post";
        if(blank){
            tempForm.target = "_blank";
            json.tourl = action;
            tempForm.action = "/p/post"
        }
        document.body.appendChild(tempForm);

        for(var key in json){
            var　tempInput　=　document.createElement("input");
            tempInput.type="hidden";
            tempInput.name=key;
            tempInput.value=json[key];　//the　parameter　of　method　in　the　code　of　DispatchAction.　
            tempForm.appendChild(tempInput);
        }
        tempForm.submit();
        tempForm.remove()
    }
}