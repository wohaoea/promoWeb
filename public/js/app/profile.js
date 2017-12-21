var React=require("react");
var Router=require("react-router");

var Link = Router.Link;
var Menum=require("./t_menu");
var Profileitem=require("./profileitem");
var Record_Auditing=require("./record_auditing");

var Profile = React.createClass({
		 getInitialState: function () {
		 	window.pageNavig.addpage("-1");
	        return {userInfo:{}};
	    },
		componentDidMount:function(){
	     $.get("/app/findBase?jobType=2&custId="+this.props.params.custId+"&applyType="+this.props.params.type, function(result) {
	     		
	     		if(result.success==true){
	     			this.setState({userInfo:result.data});
	     		}
	     		console.log(this.state.userInfo);
        	}.bind(this));
	    },
      	render: function () {
      		var type = this.props.params.type;
      		var auditstate=this.props.params.auditstate;//1待审核2已同意3：已拒绝 
      		var amtStatus=this.state.userInfo.amtStatus;//增额状态
      		var scoreStatus=this.state.userInfo.scoreStatus;//增信状态
      		var id=this.props.params.id; 
      		var isAmttxt=amtStatus==3?"拒绝增额":this.state.userInfo.isAmt&&this.state.userInfo.isAmt=="Y"?"已增额：":"最大可增额：";
      		var isScoretxt=scoreStatus==3?"拒绝授信":this.state.userInfo.isScore&&this.state.userInfo.isScore=="Y"?"已授信：":"可授信：";
      		
       		return (
       			<div className="content">
       				<Menum title="个人信息"/>
	             	<div className="index_body">
	             		<div className="profile_vatar"><img src={"/getimgdef/"+(this.state.userInfo.headPic?this.state.userInfo.headPic:"pl_niubei_default_head.png")} /></div>
	             		<div className="profile_info">
	             			<div>{this.state.userInfo.nickName}</div>
	             			<div>{isAmttxt}{amtStatus!=3?<span className="profile_maxmoney">{this.state.userInfo.amt}元</span>:""}</div>
	             			<div>{isScoretxt}{scoreStatus!=3?<span className="profile_maxcredit">{this.state.userInfo.score}分</span>:""}</div>
	             		</div>
	             	</div>
	             
	             	<Profileitem data={this.state.userInfo}/>
	             	<Record_Auditing type={type} auditstate={auditstate} id={id} />
       			</div>
       		)
    }
});


module.exports=Profile;