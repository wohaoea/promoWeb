var React=require("react");
var Router=require("react-router");
var idialog=require("./idialog");

var Link = Router.Link;
var Menum=require("./t_menu");
var iDialog=new idialog();

var Record_Auditing = React.createClass({
      mixins : [Router.Navigation],
      handlegree:function(){
        var id=this.props.id;
        //同意授信
         $.get("/app/saveAgreeCredit?id="+id,function(result){
            if(result.success==true){
                
                iDialog.show({
                  content: "操作成功"
                });
                this.transitionTo("pending");
            }else{
               iDialog.show({
                  content: result.msg||"操作失败"
                });
            }
        }.bind(this));

      },handlerefuse:function(){
        //拒绝授信
        var id=this.props.id;
        $.get("/app/saveRefuseCredit?id="+id,function(result){
            if(result.success==true){
               
                iDialog.show({
                  content: "操作成功"
                });
                this.transitionTo("pending");
            }else{
               iDialog.show({
                  content: result.msg||"操作失败"
                });
            }
        }.bind(this));
      },
      render: function () {
      	var type=this.props.type;
        var auditstate=this.props.auditstate;//1待审核2已同意3：已拒绝
       return (
       			<div>
       			 {
                   auditstate==1?type=="1"? 
                   <div className="record_auditing" ><div onClick={this.handlegree}>同意授信</div><div onClick={this.handlerefuse}>拒绝授信</div></div>
                   :
                   <div className="record_auditing"><div><Link className="index_detail2" params={{id:this.props.id}} to="increasemoney">同意增额</Link></div><div onClick={this.handlerefuse}>拒绝增额</div></div>
                   :""
              }
                </div>
       		)
    }
});


module.exports=Record_Auditing;