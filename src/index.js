import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from './common';
import FlowAdd from './workflow-defination/FlowAdd';
import Node from './workflow-defination/Node';



class SysMenu extends React.Component{
    constructor(){
        super();
        this.state = {flows:[]};
        this.changeworkflow = this.changeworkflow.bind(this);
    }
    componentDidMount(){
        ajaxreq(adminPath+'/defination/flows',{success:(flows) =>{
            this.setState({flows:flows});
        }});
    }
    changeworkflow(e,flowid){
        window.currentflowid = flowid;
    }
   /* bindevent(fnc,e,arguments){
        let thisevent = window.event||e;
        return fnc.bind(this,thisevent,arguments);
    }*/
    render(){
        let flowmenuarr = new Array();
        let tabcontentarr = new Array();
        let flowmenucontent,tabcontent = null;
        for(let [index,flow] of this.state.flows.entries()) {
            if (index == 0) {
                flowmenucontent = (<li className="active"><a onClick={(e)=>(this.changeworkflow.bind(this,e,flow.id))()} href={"#tabcontent_"+flow.id} data-toggle="tab">●   {flow.flowName}</a></li>);
                tabcontent = (<div className="tab-pane fade in active" id={"tabcontent_"+flow.id}><Node flow={flow}/></div>)
            }else{
                flowmenucontent = (<li><a onClick={(e)=>(this.changeworkflow.bind(this,e,flow.id))()}  href={"#tabcontent_"+flow.id} data-toggle="tab">●   {flow.flowName}</a></li>);
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
