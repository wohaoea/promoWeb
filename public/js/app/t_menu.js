var React=require("react");
var Router=require("react-router");
//React.initializeTouchEvents(true);

var Menum = React.createClass({
	mixins : [Router.Navigation],
	handleClick:function(){

		if(this.props.preurl=="about:blank"){
			window.location.href="about:blank";
			return;
		}

		if(this.props.preurl){
			window.location.hash="#"+this.props.preurl;
		}else{
			window.history.go(-1);
		}
		
		
	},
	handleHelp:function(){
		this.transitionTo("help");
	},
    render: function () {
    	
        return (
        	<div style={{position: "relative",backgroundColor: "#0778C9"}}>
				<div className="menum" >{this.props.title}</div> 
				{
					
					<div className="menum_nav" onTouchStart={this.handleClick}>
						<div className="menum_navico"></div>
					</div>
				}
				
				
				{
					this.props.tips?<div className="menum_tip" onTouchStart={this.handleHelp}>&nbsp;</div>:""
				}
				
        	</div>
            
        )
    }
});

module.exports=Menum;