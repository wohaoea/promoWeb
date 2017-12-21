var React=require("react");
var Router=require("react-router");
var Common=require("./common");

var Link = Router.Link;
var RepaymentsRecord=require("./repaymentsrecord");

var Auditpending = React.createClass({
	getInitialState: function () {
        return {
          list:{init:true}
          };
    },componentDidMount:function(){

      $.get("/app/findApplyList?type=1", function(result) { 
            if(result.success==true){
                this.setState({list:result.data});
                
            }
        }.bind(this));

    },
	 render: function () {
       return (
       			<Auditinglist data={this.state.list}/>
       		)
    }
});

//待审核列表
var Auditinglist=React.createClass({
   render: function () {
    
        return (
        
          <div>
            {
               (this.props.data.selfList==null||this.props.data.selfList.length==0)&&(this.props.data.addrList==null||this.props.data.addrList.length==0)&&
               (this.props.data.schollList==null||this.props.data.schollList.length==0)&&
              (this.props.data.otherList==null||this.props.data.otherList.length==0)?
              this.props.data.init?<div style={{"marginTop": "1.4rem","textAlign": "center","fontSize": "0.4rem"}}>加载中...</div>
              :<div style={{"marginTop": "1.4rem","textAlign": "center","fontSize": "0.4rem"}}>暂无数据</div>
              :""
            }
            { 
              this.props.data.selfList&&this.props.data.selfList.length>0?
                <div>
                  <div className="selectcatgory">我</div>
                  <ul className="auditinglist">
                      {
                          this.props.data.selfList.map(function (item) {
                            return <AuditingItem data={item} />
                      })}
                  </ul>
              </div>
            :""
            }
            { 
              this.props.data.addrList&&this.props.data.addrList.length>0?
                <div>
                  <div className="selectcatgory">通讯录好友</div>
                  <ul className="auditinglist">
                      {
                          this.props.data.addrList.map(function (item) {
                          return <AuditingItem data={item} />
                      })}
                  </ul>
              </div>
            :""
            }
            { 
              this.props.data.schollList &&this.props.data.schollList.length>0?
                <div>
                  <div className="selectcatgory">本校校友</div>
                  <ul className="auditinglist">
                      {
                          this.props.data.schollList.map(function (item) {
                          return <AuditingItem data={item} />
                      })}
                  </ul>
              </div>
            :""
            }
            { 
              this.props.data.otherList&&this.props.data.otherList.length>0?
                <div>
                  <div className="selectcatgory">其它学校</div>
                  <ul className="auditinglist">
                      {
                          this.props.data.otherList.map(function (item) {
                          return <AuditingItem data={item} />
                      })}
                  </ul>
              </div>
            :""
            }
          </div>
            
        )
    }
});

 var AuditingItem=React.createClass({
   mixins : [Router.Navigation],
  click_profileinfo:function(event){
    var obj=$(event.currentTarget);

    this.transitionTo("profile",{type:obj.attr("data-type"),custId:obj.attr("data-custid"),id:obj.attr("data-id"),auditstate:"1"});
 
  },
  click_auditinglist_opr:function(event){
    var obj=$(event.currentTarget);
    
    this.transitionTo("repaymentsrecord",{custId:obj.attr("data-custid"),type:obj.attr("data-type"),custId:obj.attr("data-custid"),id:obj.attr("data-id"),auditstate:"1"});
    event.stopPropagation();
  },
   render: function () {
        return (
            <li onClick={this.click_profileinfo} data-id={this.props.data.id}  data-custid={this.props.data.custId} data-type={this.props.data.applyType}>
              <div  style={{"paddingTop":"0.26rem","paddingBottom":"0.26rem"}}>
                <div className="auditinglist_img"><img src={"/getimgdef/"+(this.props.data.headPic?this.props.data.headPic:"pl_niubei_default_head.png")} style={{width:"1.06rem",height:"1.06rem","borderRadius":"50%"}} /></div>
                <div className="auditinglist_name" style={{width:"3.7rem"}}><div>{Common.subString(this.props.data.nickName,18)}</div> <div style={{lineHeight:"0.6rem"}}>{Common.subString(this.props.data.schooleName,18)}</div></div>
                <div className="auditinglist_state"><div>{this.props.data.applyType=="1"?"申请授信":"申请增额"}</div> <div style={{"lineHeight":"0.73rem"}}>{this.props.data.applyTime}</div></div>
                <div className="auditinglist_opr" data-id={this.props.data.id} data-custid={this.props.data.custId} data-type={this.props.data.applyType} onClick={this.click_auditinglist_opr}><a href="javascript:void(0)">借款记录</a></div>
            </div>
            </li>
            
        )
    }
});
module.exports=Auditpending;