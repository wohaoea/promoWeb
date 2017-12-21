var React=require("react");
var Router=require("react-router");

var Link = Router.Link;
var Menum=require("./t_menu");
var Profileitem=require("./profileitem");
var Record_Auditing=require("./record_auditing");
var idialog=require("./idialog");
var Tipdialog=require("./tipdialog");

var iDialog=new idialog();

var freeze_saveApplyAmt=false;
var freeze_saveCancelAll=false;
var freeze_saveApplyAmt=false;


var DaRen = React.createClass({
		
		checkAduit:function(moneystate,auditstate){
			var result={};
			var type=this.props.params.type;//1：授信，增额
			var auditstate=auditstate||"";//授信 1：待审核，2：通过，""：未申请
			var moneystate=moneystate||"";//增额
			if(type=="1"){
				if(auditstate==""){
				
					if(moneystate==2){
						return (<div><div className="creditdaren_auditing" data-type="1" style={{left:"0px",width:"50%"}} onClick={this.handlecredit}>申请授信</div><div style={{right:"0px",width:"50%"}} className="creditdaren_auditing" onClick={this.cancelaudit}>取消授信增额</div></div>)
					}
					return <div className="creditdaren_auditing" data-type="1" style={{left:"0px",width:"100%"}} onClick={this.handlecredit}>申请授信</div>
				}else if(auditstate==1){
					
					if(moneystate==2){
						return <div> <div className="showtips">授信申请已发送，请耐心等待</div><div className="creditdaren_auditing" onClick={this.cancelaudit}>取消授信增额</div></div>
					}
					return <div className="showtips">授信申请已发送，请耐心等待</div>
					
				}else if(auditstate==2){
						return <div className="creditdaren_auditing" onClick={this.cancelaudit}>取消授信增额</div>
				}else if(auditstate==3 &&moneystate==2){
					return <div className="creditdaren_auditing" onClick={this.cancelaudit}>取消授信增额</div>
				}
			}else{

				if(moneystate==""){
					
					if(auditstate==2){
						return <div><div className="creditdaren_auditing" style={{left:"0px",width:"50%"}} data-type="2" onClick={this.handlecredit}>申请授额</div><div style={{right:"0px",width:"50%"}} className="creditdaren_auditing" onClick={this.cancelaudit}>取消授信增额</div></div> 
					}
					return <div className="creditdaren_auditing" style={{left:"0px",width:"100%"}} data-type="2" onClick={this.handlecredit}>申请授额</div>
				}else if(moneystate==1){
					
					if(auditstate==2){
						return <div><div className="showtips">授信增额已发送，请耐心等待</div><div onClick={this.cancelaudit} className="creditdaren_auditing">取消授信增额</div></div>
					}
					return <div className="showtips">授信增额已发送，请耐心等待</div>
				}else if(moneystate==2){
						return <div className="creditdaren_auditing" onClick={this.cancelaudit}>取消授信增额</div>
				}else if(moneystate==3&&auditstate==2){
						return <div className="creditdaren_auditing" onClick={this.cancelaudit}>取消授信增额</div>
				}
			}
			
		},
		handlecredit:function(event){
			//申请授信-授额
			var custId=this.props.params.custId;
			var obj=$(event.currentTarget);
			if(freeze_saveApplyAmt==true)return;
			freeze_saveApplyAmt=true;
			$.get("/app/saveApplyAmt?vipid="+custId+"&type="+obj.attr("data-type"),function(result){
				freeze_saveApplyAmt=false;
				 if(result.success){
		          	 this.componentDidMount();
		          }else{
		             iDialog.show({
		                  content: result.msg
		                });
		          }
			}.bind(this));
		},
		cancelaudit:function(){
			var custId=this.props.params.custId;
			var t=new Tipdialog({type:1});

	        t.render("确认取消授信增额吗？");
	        t.cbcall=function(){
	           
	           //取消授信增额
				if(freeze_saveCancelAll==true)return;
				freeze_saveCancelAll=true;

				$.get("/app/saveCancelAll?custId="+custId,function(result){
					freeze_saveCancelAll=false;
					 if(result.success){
			          	 this.componentDidMount();
			          	 var t0=new Tipdialog({type:0});
	        			 t0.render("您已取消授信增额");
			          }else{
			             iDialog.show({
			                  content: result.msg
			                });
			          }
				}.bind(this));

	        }.bind(this);			
		},
		getInitialState: function () {
			window.pageNavig.addpage(this.props.params.usource?"about:blank":"-1");
	        return {userInfo:{},auditstate:""};
	    },
	    handle_auditing_opr:function(event){
	    	//申请授信
	      if(freeze_saveApplyAmt==true)rturn;

	      var obj=$(event.currentTarget);
	      var custId=this.props.params.custId;
	      freeze_saveApplyAmt=true;
		  //showtips
	      $.get("/app/saveApplyAmt?vipid="+custId,function(result){
	      	 $(".creditdaren_auditing").hide();
	           $(".showtips").show();
	           return;
	         freeze_saveApplyAmt=false;
	          if(result.success){
	           $(".creditdaren_auditing").hide();
	           $(".showtips").show();
	          }else{
	             iDialog.show({
	                  content: result.msg
	                });
	          }
	      }.bind(this));
	    },
		componentDidMount:function(){
		 var custId=this.props.params.custId;
	     $.get("/app/findBase?jobType=1&custId="+custId+"&applyType="+this.props.params.type, function(result) {
	     		
	     		if(result.success==true){
	     			this.setState({userInfo:result.data});
	     		}

        	}.bind(this));
	    },
	    removeCha:function(){
	    	$(".incretips").remove();
	    },
      	render: function () {
      		
      		var type = this.props.params.type;
      		var strtips="";
      		if(type==1 &&this.state.userInfo.isScore&&this.state.userInfo.overNum>0){
      			$(".incretips").show();
      			strtips="有"+this.state.userInfo.overNum+"人能给你更高信用评分";
      		}else if(type==2 &&this.state.userInfo.isAmt&&this.state.userInfo.overNum>0){
      			$(".incretips").show();
      			strtips="有"+this.state.userInfo.overNum+"人能给你更高额度";
      		}
      		var strAmt=this.state.userInfo.isAmt=="Y"?"已增额：":"增额上限：";
      		var strScore=this.state.userInfo.isScore=="Y"?"已增信：":"增信上限：";
       		return (
       			<div className="content">
       				<Menum title="信用达人档案" preurl={this.props.params.usource?"about:blank":""}/>
	             	<div className="index_body">
	             		<div className="profile_vatar"><img src={"/getimgdef/"+(this.state.userInfo.headPic?this.state.userInfo.headPic:"pl_niubei_default_head.png")} /></div>
	             		<div className="profile_info">
	             			<div>{this.state.userInfo.nickName}</div>
	             			<div>{strAmt}<span className="profile_maxmoney">{this.state.userInfo.amt}元</span></div>
	             			<div>{strScore}<span className="profile_maxcredit">{this.state.userInfo.score}分</span></div>
	             		</div>
	             	</div>
	             	<div className="incretips">{strtips}<div className="incretips_cha" onTouchEnd={this.removeCha}></div></div>
	             	<Profileitem data={this.state.userInfo}/>
	             	{this.checkAduit(this.state.userInfo.amtStatus,this.state.userInfo.scoreStatus)}
	             	
       			</div>
       		)
    }
});


module.exports=DaRen;