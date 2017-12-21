var React=require("react");
var Router=require("react-router");
var Swiper=require("../libs/swiper");
var Link = Router.Link;

var Menum=require("./t_menu");


var Index = React.createClass({
    mixins : [Router.Navigation],
    getInitialState:function(){

        window.pageNavig.addpage("about:blank");
        return{userInfo:{}};
    },
    componentDidMount:function(){ 
        new Swiper('.swiper-container', {
           pagination : '.swiper-pagination'
        });
        $.get("/app/findOneCreditVip", function(result) {
            console.log(result);
            if(result.success==true){
                this.setState({userInfo:result.data});
            }
            
        }.bind(this));

    },
    render: function () {
        
        return (

        	<div style={{width:"10rem",margin: "auto"}}>
                
        		<Menum title="信用达人" tips="true" preurl="about:blank"/>
        		<div className="index_body swiper-container">
                        
                        <div className="swiper-wrapper">
                            <div className="swiper-slide">
                                <div className="swiper-slide1 container">
                                    您的达人学分已超越<span className="containertxt">{this.state.userInfo.percent}%</span>的信用达人
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="swiper-slide1 container" >
                                    <div>累计帮助<span className="containertxt">{this.state.userInfo.count}</span>人次完成授信增额服务
                                    </div>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="swiper-slide1 container">
                                    <div>累计授信分数达到<span className="containertxt">{this.state.userInfo.sumScore}</span>分</div>
                                </div>
                            </div>
                            <div className="swiper-slide">
                                <div className="swiper-slide1 container">
                                    <div>累计增额额度达到<span className="containertxt">{this.state.userInfo.sumAmt}</span>元</div>
                                </div>
                            </div>
                        </div>
                    <div className="swiper-pagination"></div>

                </div>
        		<ul className="index_ul">
        			<li>权限有效期<div>{this.state.userInfo.startTime}至{this.state.userInfo.endTime}</div><div className="clearboth"/></li>
        			<li>达人分数<div>{this.state.userInfo.vipScore}分</div><div className="clearboth"/></li>
        			<li>授信分数<div>{this.state.userInfo.creditScore}分/人</div><div className="clearboth"/></li>
        			<li>最大提升额度<div>{this.state.userInfo.maxIncrement}元/人</div><div className="clearboth"/></li>
        			<li>当月剩余可授信人数<div>{this.state.userInfo.remainCreditCount}人</div><div className="clearboth"/></li>
        			<li>当月剩余可用额度<div>{this.state.userInfo.remainAmount}元</div></li>
        		</ul>
                <div style={{height:"1.5rem"}}>&nbsp;</div>
        		<Link to="pending" className="index_detail">查看用户申请</Link>
        	</div>

        )
    }
});

module.exports=Index;