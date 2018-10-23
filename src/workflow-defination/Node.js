import React from 'react';
import ReactDom from 'react-dom';
import {ajaxreq,ajax_content_type,serializeformajax,refreshWin} from '../common';
import NodeAdd from './NodeAdd';
import Line from './Line';
import NodeUserPriv from './NodeUserPriv';

class Node extends React.Component{
    constructor(){
        super();
        this.state = {nodes:[]};
    }
    componentDidMount(){
       this.refresh();
    }
    refresh(){
        let flowid = this.props["flow"].id;
        window.currentflowid = flowid;
        ajaxreq(adminPath+'/defination/flows/'+flowid+'/nodes',{success:(nodes)=>{
                this.setState({nodes:nodes});
            }});
    }
    render(){
        let flowid = this.props["flow"].id;
        let flowName = this.props["flow"].flowName;
        let nodelinearr = new Array();
        let nodelinecontent = null;
        for(let [index,node] of this.state.nodes.entries()){
            if(node.beginNode){
                nodelinecontent =(
                    <tr className={"bg-success"}>
                        <td className={"vertial-center"}>{node.nodeDefId}</td>
                        <td className={"vertial-center"}>{node.name}</td>
                        <td className={"vertial-center"}>{node.description}</td>
                        <td className={"vertial-center"}>
                            {/*<button className={"btn btn-warning btn-sm"}><span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp;&nbsp;修改数据权限</button>&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            <Line node={node}/>
                            <button className={"btn btn-danger btn-sm"}><span className={"glyphicon glyphicon-trash"}></span>
                                &nbsp;&nbsp;删  除</button>
                        </td>
                    </tr>
                );
            }else if(node.endNode){
                nodelinecontent =(
                    <tr className={"bg-warning"}>
                        <td className={"vertial-center"}>{node.nodeDefId}</td>
                        <td className={"vertial-center"}>{node.name}</td>
                        <td className={"vertial-center"}>{node.description}</td>
                        <td className={"vertial-center"}>
                            {/*<button className={"btn btn-warning btn-sm"}><span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp;&nbsp;修改数据权限</button>&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            <Line node={node}/>
                            <button className={"btn btn-danger btn-sm"}><span className={"glyphicon glyphicon-trash"}></span>
                                &nbsp;&nbsp;删  除</button>
                        </td>
                    </tr>
                );
            }else{
                nodelinecontent =(
                    <tr className={"bg-info"}>
                        <td className={"vertial-center"}>{node.nodeDefId}</td>
                        <td className={"vertial-center"}>{node.name}</td>
                        <td className={"vertial-center"}>{node.description}</td>
                        <td className={"vertial-center"}>
                            {/*<button className={"btn btn-warning btn-sm"}><span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp;&nbsp;修改数据权限</button>&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            <Line node={node}/>
                            <button className={"btn btn-danger btn-sm"}><span className={"glyphicon glyphicon-trash"}></span>
                                &nbsp;&nbsp;删  除</button>
                        </td>
                    </tr>
                );
            }
            nodelinearr.push(nodelinecontent);
        }
        return(
            <div className={"container-fluid"}>
                <ol className="breadcrumb">
                    <li><a href="#">流程管理</a></li>
                    <li><a href="#">流程模型：{flowName}</a></li>
                    <li className="active">节点管理</li>
                </ol>


                <table className={"table table-hover"}>
                    <caption className={"clearfix"}>
                        <span className={"text-info"}>--- 所有节点 ---</span>
                        <NodeAdd node={this} flow={this.props["flow"]}/>
                        <NodeUserPriv flow={this.props["flow"]}/>
                        <button className={"btn btn-primary pull-right marginright-normal "}><span className={"glyphicon glyphicon-list-alt"}></span>
                            &nbsp;页面编辑器</button>
                        <button className={"btn btn-warning pull-right marginright-normal"}><span className={"glyphicon glyphicon-leaf"}></span>
                            &nbsp;生成页面模板</button>
                    </caption>
                    <thead className={"bg-primary text-lg"}>
                        <tr>
                            <td style={{width:'16%'}}><strong>节点id</strong></td>
                            <td style={{width:'30%'}}><strong>节点名称</strong></td>
                            <td style={{width:'30%'}}><strong>节点描述</strong></td>
                            <td style={{width:'25%'}}><strong>操  作</strong></td>
                        </tr>
                    </thead>
                    <tbody>
                        {nodelinearr}
                    </tbody>

                </table>
             </div>
        );
    }
}


export default Node;