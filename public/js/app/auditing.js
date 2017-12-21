var React=require("react");
var Router=require("react-router");
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Menum=require("./t_menu");
var RepaymentsRecord=require("./repaymentsrecord");
var Auditagree=require("./auditagree");

var Auditing = React.createClass({
   mixins : [Router.Navigation],
   getInitialState:function(){
        window.pageNavig.addpage("/");
        return {};
    },
    auditwidth:0,
    componentDidMount:function(){
      var ldom=this.refs.auditing_li1.getDOMNode();
      this.auditwidth=$(ldom).width();
      $(".hengxian").css({width:this.auditwidth+"px"});
      var index=0;
      switch(this.context.router.getCurrentPathname()){
        case "/auditing/agree":
        index=1;
        break;
        case "/auditing/refuse":
         index=2;
        break;
      }
      $(".hengxian").css("transform","translate("+index*this.auditwidth+"px)");
      $(".auditing_u li").removeClass("defcolor");
      var curli=$(".auditing_u li")[index];
      $(curli).addClass("defcolor");
    },
	  handleClickli:function(event){
      var curobj=event.currentTarget;
      var datat=$(curobj).attr("data-t");
     
      switch(datat){
        case "1"://待审核
          $(".hengxian").css("transform","translate(0px)");
          this.transitionTo("/auditing/pending");

          break;
        case "2"://已通过
          $(".hengxian").css("transform","translate("+this.auditwidth+"px)");
          this.transitionTo("/auditing/agree");
          break;
        case "3"://已拒绝
          $(".hengxian").css("transform","translate("+2*this.auditwidth+"px)");
          this.transitionTo("/auditing/refuse");
          break;
      }
      $(".auditing_u li").removeClass("defcolor");
      $(curobj).addClass("defcolor");
    },
    render: function () {
       return (
       			<div className="content">
       				<Menum title="审核列表" preurl="/"/>
              <div style={{position: "relative"}}>
                <ul className="auditing_u">
                  <li ref="auditing_li1" className="defcolor" data-t="1" onTouchStart={this.handleClickli}>待审核</li>
                  <li data-t="2" onTouchStart={this.handleClickli}>已通过<div className="auditing_u_pl">&nbsp;</div><div className="auditing_u_pr">&nbsp;</div></li>
                  <li data-t="3" onTouchStart={this.handleClickli}>已拒绝</li>
                </ul>
                <div className="hengxian"></div>
              </div>
             <RouteHandler />
                           
       			</div>
       		)
    }
});




module.exports=Auditing;