var React=require("react");
var Router=require("react-router");
var Link=require("react-router").Link;
var Menum=require("./t_menu");
var idialog=require("./idialog");
var Common=require("./common");
var iDialog=new idialog();

var Vip = React.createClass({
       getInitialState:function(){
          window.pageNavig.addpage("about:blank");
            return{list:{init:true}};
        },
        onChange:function(){
          $.get("/app/findList?applyType="+this.props.params.type, function(result) {
            if(result.success==true){
                this.setState({list:result.data});
            }
        }.bind(this));
        },
		    componentDidMount:function(){
          $.get("/app/findList?applyType="+this.props.params.type, function(result) {
            if(result.success==true){
                this.setState({list:result.data});
            }
            
        }.bind(this));
        },
      	render: function () {
      		var res={};
          var that=this;
         
       		return (
       			<div className="content">
       				 <Menum title="选择信用达人" preurl="about:blank"/>
               {
                this.state.list==null ||(this.state.list.selfList!=null&&this.state.list.selfList.length==0&&this.state.list.addrList!=null&&this.state.list.addrList.length==0&&this.state.list.schollList!=null&&this.state.list.schollList.length==0&&this.state.list.otherList.length!=null&&this.state.list.otherList.length==0)?
                <div id="xydr" style={{"marginTop": "1.4rem","textAlign": "center","fontSize": "0.4rem"}}>
                {
                  this.state.list.init?"加载中...":"当前还没有可选的信用达人"
                }
                
                </div>:""
               }
               {
                  this.state.list!=null&&this.state.list.selfList!=null && this.state.list.selfList.length>0?
                    <div>
                        <div className="selectcatgory">我</div>
                        <ul className="auditinglist">
                        {
                           this.state.list.selfList.map(function(item){
                              return <Item data={item} type={that.props.params.type} onChanged={that.onChange}/>
                           })
                        }
                        </ul>
                    </div>
                  :""
               }
               {
                this.state.list!=null &&this.state.list.addrList!=null &&this.state.list.addrList.length>0?
                    <div>
                        <div className="selectcatgory">通讯录好友</div>
                        <ul className="auditinglist">
                        {
                           this.state.list.addrList.map(function(item){
                              return <Item data={item} type={that.props.params.type} onChanged={that.onChange}/>
                           })
                        }
                        </ul>
                    </div>
                  :""

               }
               {
                this.state.list&&this.state.list.schollList!=null&&this.state.list.schollList.length>0?
                    <div>
                        <div className="selectcatgory">本校好友</div>
                        <ul className="auditinglist">
                        {
                           this.state.list.schollList.map(function(item){
                              return <Item data={item} type={that.props.params.type} onChanged={that.onChange}/>
                           })
                        }
                        </ul>
                    </div>
                  :""
               }
               {
                this.state.list &&this.state.list.otherList!=null &&this.state.list.otherList.length>0?
                    <div>
                        <div className="selectcatgory">其它学校</div>
                        <ul className="auditinglist">
                        {
                           this.state.list.otherList.map(function(item){
                              return <Item data={item} type={that.props.params.type} onChanged={that.onChange} />
                           })
                        }
                        </ul>
                    </div>
                  :""
               }
       			</div>
       		)
    }
});

var Item=React.createClass({
    hanldevipdetail:function(event){
      var obj=$(event.currentTarget);
      
      this.transitionTo("daren",{type:this.props.type,custId:obj.attr("data-custid")});

    },
    handle_auditing_opr:function(event){
      var obj=$(event.currentTarget);
      $.get("/app/saveApplyAmt?vipid="+obj.attr("data-vipid")+"&type="+obj.attr("data-type"),function(result){
         
          if(result.success){
            this.props.onChanged();
          }else{
             iDialog.show({
                  content: result.msg
                });
          }
      }.bind(this));
      event.stopPropagation();
    },
    handle_stopauditing:function(event){
      event.stopPropagation();
    },
    calcStrLength:function(str){
      if (!str) return 0;
      var arChina = str.match(/[^x00-xff]/g) ? str.match(/[^x00-xff]/g) : [];
      return str.length + arChina.length;
    },
    subString:function(str, length,dot){
      if (!str) return "";
      if (!dot) {
        dot = ".";
      }
      var strLength = this.calcStrLength(str);
      var dots = dot.toString() + dot;
      if (strLength + dots.length > length) {
        return str.substring(0, length - dots.length) + dots;
      }
      return str;

    },
    mixins : [Router.Navigation],
    render:function(){
      var res={};
      if(this.props.type==1){
        switch(this.props.data.status){
          case "1":
            res=<div className="auditinglist_opr select_opr_state">已申请</div>
          break;
           case "2":
            res=<div className="auditinglist_opr select_opr_state">审核通过</div>
          break;
           case "3":
            res=<div className="auditinglist_opr select_opr_state">未通过</div>
          break;
          default:
            res=<div className="auditinglist_opr select_opr_credit" data-type={this.props.type} data-vipid={this.props.data.vipId}  onClick={this.handle_auditing_opr}>申请授信</div>
        }
      }else if(this.props.type==2){
        switch(this.props.data.status){
          case "1":
            res=<div className="auditinglist_opr select_opr_state">已申请</div>
          break;
           case "2":
            res=<div className="auditinglist_opr select_opr_state">审核通过</div>
          break;
           case "3":
            res=<div className="auditinglist_opr select_opr_state">未通过</div>
          break;
          default:
            res=<div className="auditinglist_opr select_opr_credit" data-type={this.props.type} data-vipid={this.props.data.vipId}  onClick={this.handle_auditing_opr}>申请增额</div>
        }
      }

      return(
        <li onClick={this.hanldevipdetail} data-custid={this.props.data.vipId}>
            <div  style={{"paddingTop":"0.26rem","paddingBottom":"0.26rem"}}>
                <div className="auditinglist_img"><img src={"/getimgdef/"+(this.props.data.headPic?this.props.data.headPic:"pl_niubei_default_head.png")} style={{width:"1.06rem",height:"1.06rem","borderRadius":"50%"}} /></div>
                <div className="auditinglist_name"><div>{Common.subString(this.props.data.nickName,18)}</div> <div>{Common.subString(this.props.data.schooleName,18)}</div></div>
                <div className="selectvip_state"><div>授信分数:<span style={{color:"#74afff"}}>{this.props.data.creditScore}分</span></div> <div >增额上限:<span style={{color:"#FEB5B5"}}>{this.props.data.maxIncrement}元</span></div></div>
                {res}
                
            </div>
        </li>
        );
    }
});

module.exports=Vip;