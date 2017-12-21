var React=require("react");
var Router=require("react-router");
var Common=require("./common");
var Link = Router.Link;

var ProfileItem = React.createClass({
      render: function () {
            
       return (
                  this.props.data?
       			<div className="content">
       				<ul className="profileitem_ul" >
       					<li><div>签名</div><div>{Common.subString(this.props.data.signTxt,36)}</div></li>
       					<li><div>学校</div><div>{this.props.data.schoolName}</div></li>
       					<li><div>院系</div><div>{this.props.data.college}</div></li>
       					<li><div>专业</div><div>{this.props.data.major}</div></li>
       					<li><div>入学年份</div><div>{this.props.data.enterYear}年</div></li>
       				</ul>
       			</div>
                  :""
       		)
    }
});


module.exports=ProfileItem;