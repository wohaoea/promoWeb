var React=require("react");
var Router=require("react-router");
var Route = require("react-router").Route;

var RouteHandler = Router.RouteHandler;
var DefaultRoute = require("react-router").DefaultRoute;

var Index=require("./index");
var Auditing=require("./auditing");
var Menum=require("./t_menu");
var RepaymentsRecord=require("./repaymentsrecord");
var Profile=require("./profile");
var DaRen=require("./creditdaren");
var Increasemoney=require("./increasemoney");
var Help=require("./help");
var SelectVip=require("./selectvip");
var Auditpending=require("./auditpending");
var Auditagree=require("./auditagree");
var Auditrefuse=require("./auditingrefuse");

require("../../css/mobiapp.css");
require("../../css/swiper.css");



var App=React.createClass({
    render:function(){
        
        return (<RouteHandler />)
    }
});
var routes=(
     
        <Route path="/" handler={App}>
            <DefaultRoute name="index" handler={Index}/>
            <Route name="auditing" path="auditing" handler={Auditing} >
                <Route name="pending" path="pending" handler={Auditpending} /> 
                <Route name="agree" path="agree" handler={Auditagree} /> 
                <Route name="refuse" path="refuse" handler={Auditrefuse} /> 
            </Route>
            <Route name="profile" path="profile/:type/:auditstate/:custId/:id" handler={Profile} />
            <Route name="daren" path="daren/:custId/:type/:usource?" handler={DaRen} />
            <Route name="selectvip" path="selectvip/:type/:urldirect?" handler={SelectVip} />
            <Route name="help" path="help" handler={Help} />
            <Route name="increasemoney" path="increasemoney/:id" handler={Increasemoney} />
            
            <Route name="repaymentsrecord" path="repaymentsrecord/:type/:custId/:id/:auditstate" handler={RepaymentsRecord}/>
        </Route>
     
    );
//HistoryLocation 
Router.run(routes, Router.HashLocation, function (Root) {
    React.render(<Root/>, document.body);
});