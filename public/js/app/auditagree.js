var React=require("react");
var Router=require("react-router");
var Common=require("./common");

var Link = Router.Link;
var RepaymentsRecord=require("./repaymentsrecord");

var Auditagree = React.createClass({
	getInitialState: function () {
        
        return {
          list:{init:true}
          };
    },componentDidMount:function(){

      $.get("/app/findApplyList?type=2", function(result) { 
            if(result.success==true){
                this.setState({list:result.data});
            }
            console.log(this.state.list);
        }.bind(this));
    },
	 render: function () {
       return (
       			<Auditingvia data={this.state.list}/>
       		)
    }
});
 

//审核通过
var Auditingvia=React.createClass({
    render:function(){
      return(
              <div>
                {
                    (this.props.data.otherList==null||this.props.data.otherList.length==0)?
                    <div style={{"marginTop": "1.4rem","textAlign": "center","fontSize": "0.4rem"}}>
                      {
                      this.props.data.init?"加载中...":"暂无数据"
                    }
                    </div>
                    :""
                  }
                 { 
                    this.props.data.otherList&&this.props.data.otherList.length>0?
                      <div>
                        
                        <ul className="auditinglist">
                            {
                                this.props.data.otherList.map(function (item) {
                                return <AuditingItemvia data={item} />
                            })}
                        </ul>
                      </div>
                      :""
                  }
            </div>
         )
    }
});

var AuditingItemvia=React.createClass({
   mixins : [Router.Navigation],
  click_profileinfo:function(event){
    var obj=$(event.currentTarget);
    
    this.transitionTo("profile",{type:obj.attr("data-type"),custId:obj.attr("data-custid"),id:obj.attr("data-id"),auditstate:"2"});
 
  },
  click_auditinglist_opr:function(event){
    var obj=$(event.currentTarget);
    this.transitionTo("repaymentsrecord",{custId:obj.attr("data-custid"),type:obj.attr("data-type"),custId:obj.attr("data-custid"),id:obj.attr("data-id"),auditstate:"2"});
    event.stopPropagation();
  },
   render: function () {

        return (
            <li onClick={this.click_profileinfo} data-id={this.props.data.id} data-custid={this.props.data.custId} data-type={this.props.data.applyType}>
              <div  style={{"paddingTop":"0.26rem","paddingBottom":"0.26rem"}}>
                <div className="auditinglist_img"><img src={"/getimgdef/"+(this.props.data.headPic?this.props.data.headPic:"pl_niubei_default_head.png")} style={{width:"1.06rem",height:"1.06rem","borderRadius":"50%"}} /></div>
                <div className="auditinglist_name" style={{width:"3.7rem"}}><div>{Common.subString(this.props.data.nickName,18)}</div> <div style={{lineHeight:"0.6rem"}}>{Common.subString(this.props.data.schooleName,18)}</div></div>
                <div className="auditinglist_state"><div>{this.props.data.applyType=="1"?"授信"+this.props.data.value+"分":"增额"+this.props.data.value+"元"}</div> <div style={{"lineHeight":"0.73rem"}}>{this.props.data.applyTime}</div></div>
                <div className="auditinglist_opr" data-id={this.props.data.id} data-custid={this.props.data.custId} data-type={this.props.data.applyType} onClick={this.click_auditinglist_opr}><a href="javascript:void(0)">借款记录</a></div>
            </div>
            </li>
            
        )
    }
});


module.exports=Auditagree;