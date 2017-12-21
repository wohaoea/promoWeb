var React=require("react");
var Router=require("react-router");

var Link = Router.Link;
var Menum=require("./t_menu");
var idialog=require("./idialog");

var iDialog=new idialog();
var bntdisabled=false;

var Profile = React.createClass({
		mixins : [Router.Navigation],
		getInitialState:function(){
			 window.pageNavig.addpage("-1");
            return{userInfo:{}};
        },
		componentDidMount:function(){
	          $.get("/app/findOneCreditVip", function(result) {
	            if(result.success==true){
	                this.setState({userInfo:result.data});
	            }
        	}.bind(this));
        },
		handleEnter:function(){
			var userInfo=this.state.userInfo;
			var increaMoney=$("#increaMoney").val();
			if(!/^[1-9]{1,}[0-9][0-9]*$/.test(increaMoney) || increaMoney%100!==0){

				iDialog.show({
					content: "增加额度必须为100的整数倍"
				});
				return;
			}
			
			if(increaMoney>Math.min(this.state.userInfo.maxIncrement,this.state.userInfo.oneMaxIncrement)){
				iDialog.show({
					content: "输入额度超出当月限额，请重新输入"
				});
				return;
			}
			if(bntdisabled==true)return;
			//申请赠额
			bntdisabled=true;
			$.get("/app/saveAgreeCredit?vipid="+this.props.params.vipid+"&score="+increaMoney+"&id="+this.props.params.id, function(result) {
				
				bntdisabled=false;
	            if(result.success==true){
	               this.transitionTo("pending");
	               iDialog.show({
					content:"操作成功"});
	            }else{
	            	iDialog.show({
					content: result.msg
				});
	            }
        	}.bind(this));

		},
      	render: function () {
      		
       		return (
       			<div className="content">
       				<Menum title="信用达人增额"/>
	             	<ul className="inscrease_body">
	             		<li><div>当前可增额度</div><div>{Math.min(this.state.userInfo.maxIncrement,this.state.userInfo.oneMaxIncrement)}元</div></li>
	             		<li><div>增加额度</div><div><input type="tel" id="increaMoney" placeholder="请输入增加额度" />元</div></li>
	             	</ul>
	             	<div className="increas_enty">
	             		<input type="button" value="确定" id="btnenter" onClick={this.handleEnter} />
	             	</div>
	             	
       			</div>
       		)
    }
});


module.exports=Profile;