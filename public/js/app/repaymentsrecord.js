var React=require("react");
var Router=require("react-router");
var Link = Router.Link;

var Menum=require("./t_menu");
var Record_Auditing=require("./record_auditing");

var Repaymentsrecord = React.createClass({
    getInitialState: function () {
        window.pageNavig.addpage("-1");
        return {
          list:[]
          };
    },
    componentDidMount:function(){
        
        var custId=this.props.params.custId;
        $.get("/app/findLoanList?custid="+custId,function(result){
            if(result.success==true){
                this.setState({list:result.data});
                
            }
        }.bind(this));

    },
    render: function () {
        var type = this.props.params.type;
        var custId=this.props.params.custId;
        var auditstate=this.props.params.auditstate;
        var id=this.props.params.id;
        
        return (

        	<div style={{width:"10rem",margin: "auto"}}>
        		<Menum title="借款记录"/>
                <div style={{marginTop:"0.13rem"}}></div>
                <ul className="recordlist">
                   
                    {
                        this.state.list&&this.state.list.length>0?
                    
                        this.state.list.map(function(item){
                            return(
                                    <li>
                                        <div className="recordlistd1"><div></div></div>
                                        <div className="recordlistd2">
                                            <div>{item.proName}</div>
                                            <div>{item.loanDate}</div>
                                        </div>
                                        <div className="recordlistd3">
                                            <div>{item.amount}元</div>
                                            <div>{item.status}</div>
                                        </div>
                                    </li>
                                )
                        }):
                        <li style={{textAlign:"center",lineHeight:"1rem"}}>无借款记录</li>

                    }
                      
                   
                </ul>
               <Record_Auditing type={type} auditstate={auditstate} id={id}/>
                
                
        	</div>

        	
        )
    }
});

module.exports=Repaymentsrecord;