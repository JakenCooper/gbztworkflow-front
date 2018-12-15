import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from './common';
import FlowAdd from './workflow-defination/FlowAdd';
import Node from './workflow-defination/Node';
import BussAdd from './workflow-defination/BussAdd';
import NavigationBar from './workflow-defination/NavigationBar';

class SysMenu extends React.Component{
    constructor(){
        super();
        this.state = {
            flows:[]
        };
        this.changeworkflow = this.changeworkflow.bind(this);
    }
    componentDidMount(){
        ajaxreq(adminPath+'/defination/flows',{success:(flows) =>{
            this.setState({flows:flows});
        }});
    }
    changeworkflow(e,flowid){
        window.currentflowid = flowid;
        window.currentflowid2 = flowid; // 为导航栏菜单所单独创建
    }
    onMouseOver(e,flowId){
        // // this.setState({isShow: !this.state.isShow});
        // {/*<button style = "display:'none',float:'right',lineHeight:'0'" onClick="(e)=>(this.deleteFlow.bind(this,e,flow.id))()" className="btn btn-danger btn-sm"><span className="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;删  除</button>*/}
        // let button = document.createElement('button');
        // let a = e.target.appendChild(button);
    }
    onMouseOut(e,flowId){
        // e.target.removeChild("button");
    }
    deleteFlow(e,flowId,flowName){
        if(!confirm('确认删除 \''+flowName+'\' 流程？ id为 : '+flowId)){
            return;
        }
        ajaxreq(adminPath+'/defination/flows/'+flowId,{type:'DELETE',success:(data)=>{
                // alert('删除成功！');
                refreshWin();
        }});
    }
    render(){
        let flowmenuarr = new Array();
        let tabcontentarr = new Array();
        let flowmenucontent,tabcontent = null;
        for(let [index,flow] of this.state.flows.entries()) {
            if (index == 0) {
                window.currentflowid2 = flow.id;
                flowmenucontent = (<li onMouseOver={(e)=>(this.onMouseOver.bind(this,e,flow.id,flow.flowName))()} onMouseOut={(e)=>(this.onMouseOut.bind(this,e,flow.id))()} className="active"><a className={"showA_"} onClick={(e)=>(this.changeworkflow.bind(this,e,flow.id))()} href={"#tabcontent_"+flow.id} data-toggle="tab">●   {flow.flowName}   
                <button style={{float:'right',lineHeight:'0'}} onClick={(e)=>(this.deleteFlow.bind(this,e,flow.id,flow.flowName))()} className={"btn btn-danger btn-sm"}><span className={"glyphicon glyphicon-trash"}></span>&nbsp;&nbsp;删  除</button>
                </a> </li>);
                tabcontent = (<div className="tab-pane fade in active" id={"tabcontent_"+flow.id}><Node flow={flow}/></div>)
            }else{
                flowmenucontent = (<li onMouseOver={(e)=>(this.onMouseOver.bind(this,e,flow.id,flow.flowName))()} onMouseOut={(e)=>(this.onMouseOut.bind(this,e,flow.id))()}><a onClick={(e)=>(this.changeworkflow.bind(this,e,flow.id))()}  href={"#tabcontent_"+flow.id} data-toggle="tab">●   {flow.flowName}
                <button style={{float:'right',lineHeight:'0'}} onClick={(e)=>(this.deleteFlow.bind(this,e,flow.id,flow.flowName))()} className={"btn btn-danger btn-sm"}><span className={"glyphicon glyphicon-trash"}></span>&nbsp;&nbsp;删  除</button>
                </a></li>);
                tabcontent = (<div className="tab-pane fade in" id={"tabcontent_"+flow.id}><Node flow={flow}/></div>)
            }
            flowmenuarr.push(flowmenucontent);
            tabcontentarr.push(tabcontent);
        }
        return(
            <section className={"row"}>
                <section className="col-lg-2">
                    <section id="menu">
                        <div className="panel-group" id="index_menugroup">
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <h1 className="panel-title clearfix" style={{cursor:'pointer'}}>
                                        <a data-toggle="collapse" data-parent="#menu"
                                           href="#flowdefination">
                                            <span className="glyphicon glyphicon-align-justify"></span> &nbsp;流 程 管 理
                                        </a>
                                    </h1>
                                </div>
                                <div className="panel-collapse collapse in" id="flowdefination">
                                    <div className="block-justify">
                                        <button className="btn btn-primary btn-group-justified" id="button_bussadd">
                                            <span className="glyphicon glyphicon-plus"></span>
                                            &nbsp;添 加 业 务 表
                                        </button>
                                        <br/>
                                        <button className="btn btn-info btn-group-justified" id="button_flowadd">
                                            <span className="glyphicon glyphicon-plus"></span>
                                            &nbsp;添 加 流 程
                                        </button>
                                    </div>
                                    <div className="panel-body">
                                        <ul className="nav nav-pills nav-stacked">
                                            {flowmenuarr}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
                <section className="col-lg-10">
                    <div className="tab-content">
                        {tabcontentarr}
                    </div>
                </section>
            </section>
        );
    }
}
ReactDom.render(<SysMenu/>,document.getElementById("main"));
ReactDom.render(<FlowAdd/>,document.getElementById("section_flowadd"));
ReactDom.render(<BussAdd/>,document.getElementById("section_bussadd"));
ReactDom.render(<NavigationBar/>,document.getElementById("NavigationBar"));