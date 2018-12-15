import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax,CommonObj} from '../common';

class NavigationBar extends React.Component{
    constructor(){
        super();
        this.state={};
    }
    componentDidMount(){
        $('.clickShowHide').click(function () {
            $(this).parent().nextAll().each(function(){
                if ($(this).prop("className")=='features-menu') {
                    $(this).toggle();
                }
            });
        });
        $('.navigationUl li:visible').mouseover(function () { // 获取焦点时
            $(this).css({"border-bottom":"3px solid #F0F8FF"});
            // $(this).animate({"border-bottom":3px solid #F0F8FF},"fast");
        });
        $('.navigationUl li:visible').mouseout(function () { // 失去焦点时
            $(this).css({"border-bottom":"3px solid #222222"});
            // $(this).animate({"border-bottom":"3px solid #222222"},"fast");
            // $('#borderBottomSpan').animate({width:liWidth,left:$("#borderBottomSpan").position().left-differenceWidth},"fast");
        });
    }
    addNode(event){
        let id = window.currentflowid2;
        $('#button_nodeadd_'+id).click();
    }
    affairConfiguer(event){
        let id = window.currentflowid2;
        $('#btn_affairConfiguer_'+id).click();
    }
    btn_model(event){
        let id = window.currentflowid2;
        $('#btn_model_'+id).click();
    }
    velocityButton(event){
        let id = window.currentflowid2;
        $('#velocityButton_'+id).click();
    }
    formDesignButton(event){
        let id = window.currentflowid2;
        $('#formDesignButton_'+id).click();
    }
    button_flowEdit(event){
        let id = window.currentflowid2;
        $('#button_flowEdit_'+id).click();
    }
    render() {
        return (
            <div>
                {/*<span id={"borderBottomSpan"} style={{float:"left",left:"364px",zIndex :"50",position:"absolute",top:"62px",minWidth:"20px",minHeight:"3px",backgroundColor:"#F0F8FF"}}></span>*/}
                <ul className="nav navbar-nav navigationUl" style={{zIndex :"-1",marginLeft: "50px"}}>
                    {/*<li><a style="line-height:35px;background-color: #222222;border-bottom: 3px solid aliceblue;" href="#">基本功能</a></li>*/}
                    {/*<li><a style="line-height:35px;background-color: #222222;" href="#">高级功能</a></li>*/}
                    <li className="dropdown">
                        <a style={{lineHeight:"35px",backgroundColor: "#222222",fontSize: "15px"}}
                           // borderBottom: "3px solid aliceblue",
                           href="#" className="dropdown-toggle clickShowHide" data-toggle="dropdown">
                            基本功能 ▶
                        </a>
                    </li>
                    <li onClick={(e)=>(this.button_flowEdit.bind(this,e))()} className="features-menu">
                        <a style={{lineHeight:"35px",backgroundColor: "#222222"}} href="#">
                            <span className="glyphicon glyphicon-pencil"></span>&nbsp;修改流程</a>
                    </li>
                    <li className="features-menu">
                        <a href="#"  onClick={(e)=>(this.addNode.bind(this,e))()} style={{lineHeight:"35px",backgroundColor: "#222222"}}>
                            <strong>+</strong> 添 加 节 点 
                        </a>
                    </li>
                    <li className="features-menu">
                        <a onClick={(e)=>(this.formDesignButton.bind(this,e))()} style={{lineHeight:"35px",backgroundColor: "#222222"}} href="#">
                            <span className="glyphicon glyphicon-list-alt"></span>&nbsp;页面编辑器</a>
                    </li>
                    <li className="features-menu">
                        <a onClick={(e)=>(this.velocityButton.bind(this,e))()} style={{lineHeight:"35px",backgroundColor: "#222222"}} href="#">
                            <span className="glyphicon glyphicon-leaf"></span>&nbsp;生成模板</a>
                    </li>
                </ul>
                <ul className="nav navbar-nav navigationUl" style={{zIndex :"-1",marginLeft: "10px"}}>
                    <li className="dropdown">
                        <a style={{lineHeight:"35px",backgroundColor: "#222222",fontSize: "15px"}}
                            // borderBottom: "3px solid aliceblue",
                           href="#" className="dropdown-toggle clickShowHide" data-toggle="dropdown">
                            高级功能 ▶
                        </a>
                    </li>
                    <li className="features-menu">
                        <a onClick={(e)=>(this.btn_model.bind(this,e))()} style={{lineHeight:"35px",backgroundColor: "#222222"}} style={{lineHeight:"35px",backgroundColor: "#222222"}} href="#">
                            <span className="glyphicon glyphicon-pencil"></span>&nbsp;修改数据权限</a>
                    </li>
                    <li className="features-menu">
                        <a onClick={(e)=>(this.affairConfiguer.bind(this,e))()} style={{lineHeight:"35px",backgroundColor: "#222222"}} style={{lineHeight:"35px",backgroundColor: "#222222"}} href="#">
                            <span className="glyphicon glyphicon-wrench"></span>&nbsp;事物查询配置</a>
                    </li>
                </ul>
            </div>
        );
    }
}
export default NavigationBar;