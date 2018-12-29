import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from './common';
import FlowAdd from './workflow-defination/FlowAdd';
import Node from './workflow-defination/Node';
import BussAdd from './workflow-defination/BussAdd';

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
                flowmenucontent = (<li onMouseOver={(e)=>(this.onMouseOver.bind(this,e,flow.id,flow.flowName))()} onMouseOut={(e)=>(this.onMouseOut.bind(this,e,flow.id))()} className="active"><a className={"showA_"} onClick={(e)=>(this.changeworkflow.bind(this,e,flow.id))()} href={"#tabcontent_"+flow.id} data-toggle="tab">
                    {flow.flowName}
                    <a style={{float:'right',lineHeight:0}} onClick={(e)=>(this.deleteFlow.bind(this,e,flow.id,flow.flowName))()} className={""}>
                        <b></b>
                    </a>
                </a> </li>);
                tabcontent = (<div className="tab-pane fade in active" id={"tabcontent_"+flow.id}><Node flow={flow}/></div>)
            }else{
                flowmenucontent = (<li onMouseOver={(e)=>(this.onMouseOver.bind(this,e,flow.id,flow.flowName))()} onMouseOut={(e)=>(this.onMouseOut.bind(this,e,flow.id))()}><a onClick={(e)=>(this.changeworkflow.bind(this,e,flow.id))()}  href={"#tabcontent_"+flow.id} data-toggle="tab">
                    {flow.flowName}
                    <a style={{float:'right',lineHeight:'0'}} onClick={(e)=>(this.deleteFlow.bind(this,e,flow.id,flow.flowName))()} className={""}>
                        <b></b>
                    </a>
                </a></li>);
                tabcontent = (<div className="tab-pane fade in" id={"tabcontent_"+flow.id}><Node flow={flow}/></div>)
            }
            flowmenuarr.push(flowmenucontent);
            tabcontentarr.push(tabcontent);
        }
        return(
            <section>
                <div className="asideBoxLeft ">
                    <aside>
                        <div className="asideH4">
                            <h4 className="clearfix text-center">
                                <a href="#flowdefination" >
                                    流 程 管 理
                                </a>
                            </h4>
                            <div  id="flowdefination">
                                <ul className="block-justify btnTwo">
                                    <li>
                                        <button className="btn btn-info btn-group-justified" id="button_bussadd">
                                            添 加 业 务 表
                                        </button>
                                    </li>
                                    <li>
                                        <button className="btn btn-info btn-group-justified" id="button_flowadd">
                                            添 加 流 程
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="panelBoxTwo">
                            <h4>
                                <span className="glyphicon glyphicon-list-alt"></span>
                                流程模板
                                <span className='glyphicon glyphicon-menu-down'></span>
                            </h4>
                            <div>
                                <ul className="nav nav-pills nav-stacked">
                                    {flowmenuarr}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
                <div className="asideBoxRight ">
                    <div className="tab-content">
                        {tabcontentarr}
                    </div>
                </div>
            </section>
        );
    }
}
ReactDom.render(<SysMenu/>,document.getElementById("main"));
ReactDom.render(<FlowAdd/>,document.getElementById("section_flowadd"));
ReactDom.render(<BussAdd/>,document.getElementById("section_bussadd"));