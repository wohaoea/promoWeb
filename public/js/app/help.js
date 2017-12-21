var React=require("react");
var Router=require("react-router");


var Menum=require("./t_menu");


var Help = React.createClass({
		  getInitialState:function(){
       window.pageNavig.addpage("/");
            return{};
        },
      	render: function () {
      		
       		return (
       			<div className="content">
       				<Menum title="信用达人指南" preurl="/"/>
	             	<ul className="helpcont">
	             		<li>1.信用达人需按照指导手册，对用户是否具备授信/增额资格进行审核；</li>
	             		<li>2.用户有权单方面取消您提升的授信/增额；</li>
						<li>3.用户在使用您提升的授信/增额进行借款后，是否按时还款将影响到您的达人学分。</li>
	             	</ul>
       			</div>
       		)
    }
});


module.exports=Help;