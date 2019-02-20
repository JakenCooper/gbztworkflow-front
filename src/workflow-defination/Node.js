import React from 'react';
import ReactDom from 'react-dom';
import {ajaxreq,ajax_content_type,serializeformajax,refreshWin} from '../common';
import NodeAdd from './NodeAdd';
import NodeUpdate from './NodeUpdate';
import Line from './Line';
import NavigationBar from './NavigationBar';

import NodeUserPriv from './NodeUserPriv';
import FlowEdit from './FlowEdit';
import AffairConfiguer from './AffairConfiguer';
import UploadFlowTemplate from "./UploadFlowTemplate";


class Node extends React.Component{
    constructor(){
        super();
        this.state = {
            nodes:[],
            alreadyCopy:false
        };
        this.velocity = this.velocity.bind(this);
    }
    componentDidMount(){
        this.refresh();
        $('#button_flowEdit_'+this.props["flow"].id).click(function(){
            $('#modal_flowEdit').modal('show');
        });
    }
    refresh(){
        let flowid = this.props["flow"].id;
        window.currentflowid = flowid;
        ajaxreq(adminPath+'/defination/flows/'+flowid+'/nodes',{success:(nodes)=>{
                console.log(nodes);
                this.setState({nodes:nodes});
            }});
    }
    formDesign(id){
        window.open(adminPath+"/formDesign/get?id="+id);
    }
    deleteNode(e,nodeId,nodeName){ // 删除节点
        let flowid = this.props["flow"].id;
        if(!confirm('确认删除 \''+nodeName+'\' 节点？ id为 : '+nodeId)){
            return;
        }
        ajaxreq(adminPath+'/defination/nodes/'+nodeId,{type:'DELETE',success:(data)=>{
                // alert('删除成功！');
                refreshWin(flowid);
        }});
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
    copyFormKeyClick(e){
        let flowid = this.props["flow"].id;
        //选中一段文字
        let range = document.createRange();
        let textElem = document.getElementById("formKeyId_"+flowid).lastChild;
        range.selectNodeContents(textElem);
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy'); // 执行copy命令，copy用户选择的文本
        this.setState({
            alreadyCopy:true
        },() =>{ // setState的箭头回调函数
            setTimeout( () => {
                // alert('隔了3000毫秒执行了这个提示！');
                this.setState({
                    alreadyCopy:false
                });
                selection.removeAllRanges();
            }, 3000 );
        });
        // alert("formKey，已复制到剪贴板。");
    }
    velocity(){
        if(!confirm('确定生成代码??')){
            return;
        }
        let flowid = this.props["flow"].id;
        $('body').mLoading({
            text: "加载中...",//加载文字，默认值：加载中...
            html: false,//设置加载内容是否是html格式，默认值是false
            mask: true//是否显示遮罩效果，默认显示
        });
        ajaxreq(adminPath+'/velocity/velocity?id='+flowid,{type:'GET',dataType:'text',success:(result)=>{ // 生成代码
                let absolutePath = result;
                if(absolutePath.indexOf("\\") > 0 || absolutePath.indexOf("/") > 0){ // 返回项目路径,成功
                    // $('body').mLoading('hide');
                    alert('流程代码生成执行完毕！');
                    if(confirm('是否生成 并下载war包?')){
                        var path1 = absolutePath; // 返回项目路径
                        var path = encodeURIComponent(path1);// 设置编码
                        $('body').mLoading({
                            text: "加载中...",//加载文字，默认值：加载中...
                            html: false,//设置加载内容是否是html格式，默认值是false
                            mask: true//是否显示遮罩效果，默认显示
                        });
                        ajaxreq(adminPath+'/velocity/baleWar?absolutePath='+path,{type:'GET',async:true,dataType:'text',success:(warPath)=>{ // 生成war 包
                                // var warPath = 'E:\\IdeaWorkSpace\\WorkflowOA\\target\\WorkflowOA.war';
                                var wpath = warPath;
                                var wpath2 = encodeURIComponent(wpath);
                                if (warPath.indexOf(".war") > 0){
                                    ajaxreq(adminPath+'/velocity/warExists?projectWarPath='+wpath2,{type:'GET',async:true,dataType:'text',success:(fileExists)=>{ // 判断是否存在war包
                                            if (fileExists != 'false'){
                                                $('a#myTestA').attr('href',adminPath+"/velocity/downloadWar?projectWarPath="+wpath2); // 下载所生成的war包
                                                document.getElementById("myTestA").click(); //既触发了a标签的点击事件，又触发了页面跳转
                                            }else{
                                                alert("并未找到war包!");
                                            }
                                        }});
                                }else{
                                    alert("生成失败!");
                                }
                            }});
                    }
                }else if(result == 'success'){
                    alert('生成成功,按照 form_key 生成菜单!');
                }else{
                    alert('模板生成失败：'+decodeURI(absolutePath));
                    $('a#myTestA').attr('href',adminPath+"/velocity/errorDownloadWar"); // 下载所生成的war包
                    document.getElementById("myTestA").click(); //既触发了a标签的点击事件，又触发了页面跳转
                }
            }});
    }
    render(){
        let flowid = this.props["flow"].id;
        let flowName = this.props["flow"].flowName;
        let formKey = this.props["flow"].formKey;
        let nodelinearr = new Array();
        let nodelinecontent = null;
        for(let [index,node] of this.state.nodes.entries()){
            if(node.beginNode){
                nodelinecontent =(
                    <tr>
                        <td className={"vertial-center"}>{node.nodeDefId}</td>
                        <td className={"vertial-center"}>{node.name}</td>
                        <td className={"vertial-center"}>{node.description}</td>
                        <td className={"vertial-center"}>
                            {/*<button className={"btn btn-warning btn-sm"}><span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp;&nbsp;修改数据权限</button>&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            <NodeUpdate node={node} outernodeobj={this}/>
                            <Line node={node}/>
                            <button onClick={(e)=>(this.deleteNode.bind(this,e,node.id,node.name))()} className={"btn btn-danger btn-sm"}><span className={"glyphicon glyphicon-trash"}></span>
                                &nbsp;&nbsp;删  除</button>
                        </td>
                    </tr>
                );
            }else if(node.endNode){
                nodelinecontent =(
                    <tr>
                        <td className={"vertial-center"}>{node.nodeDefId}</td>
                        <td className={"vertial-center"}>{node.name}</td>
                        <td className={"vertial-center"}>{node.description}</td>
                        <td className={"vertial-center"}>
                            {/*<button className={"btn btn-warning btn-sm"}><span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp;&nbsp;修改数据权限</button>&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            <NodeUpdate node={node} outernodeobj={this}/>
                            <Line node={node}/>
                            <button onClick={(e)=>(this.deleteNode.bind(this,e,node.id,node.name))()} className={"btn btn-danger btn-sm"}><span className={"glyphicon glyphicon-trash"}></span>
                                &nbsp;&nbsp;删  除</button>
                        </td>
                    </tr>
                );
            }else{
                nodelinecontent =(
                    <tr>
                        <td className={"vertial-center"}>{node.nodeDefId}</td>
                        <td className={"vertial-center"}>{node.name}</td>
                        <td className={"vertial-center"}>{node.description}</td>
                        <td className={"vertial-center"}>
                            {/*<button className={"btn btn-warning btn-sm"}><span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp;&nbsp;修改数据权限</button>&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            <NodeUpdate node={node} outernodeobj={this}/>
                            <Line node={node}/>
                            <button onClick={(e)=>(this.deleteNode.bind(this,e,node.id,node.name))()} className={"btn btn-danger btn-sm"}><span className={"glyphicon glyphicon-trash"}></span>
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
                    <a id={"myTestA"} style={{display:'none'}} target="_blank" href='#'><p>下载war包a不要删</p></a>
                    <li><a href="#">流程管理</a></li>
                    <li><a href="#">流程模型：{flowName}</a></li>
                    <li className="active">节点管理</li>
                    <li className="active">
                        <span id={"formKeyId_"+flowid} style={{marginLeft:'65px',color:"green"}}>formKey: { formKey }</span>
                        <button className={"btn btn-success btn-xs"} style={{marginLeft:'15px'}} onClick={this.copyFormKeyClick.bind(this)} id={"formKeyButtonId_"+flowid}>{this.state.alreadyCopy ? "  已复制 √  " : " 复制fomKey "}</button>
                    </li>
                </ol>


                <div className="collapse navbar-collapse" style={{width:"92%",paddingLeft:"20px"}}>
                    <ul className="nav navbar-nav">
                        <li className="dropdown">
                            <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" href=""  style={{lineHeight:"25px",marginBottom:"3px",border:'none',marginRight:'10px',background:'#eee',color:'#333'}}> 基本功能
                                <span className="caret"></span></button>
                            <ul className="dropdown-menu">
                                <li className="features-menu">
                                    <a onClick={(e)=>(this.button_flowEdit.bind(this,e))()} style={{lineHeight:"35px"}} href="#">
                                        <span className="glyphicon glyphicon-pencil"></span>&nbsp;修改流程</a>
                                </li>
                                <li className="features-menu">
                                    <a href="#"  onClick={(e)=>(this.addNode.bind(this,e))()} style={{lineHeight:"35px"}}>
                                        <span className="glyphicon glyphicon-plus"></span>&nbsp;添加节点
                                    </a>
                                </li>
                                <li className="features-menu">
                                    <a onClick={(e)=>(this.formDesignButton.bind(this,e))()} style={{lineHeight:"35px"}} href="#">
                                        <span className="glyphicon glyphicon-list-alt"></span>&nbsp;页面编辑器</a>
                                </li>
                                <li className="features-menu">
                                    <UploadFlowTemplate flowId={flowid}/>
                                </li>
                                <li className="features-menu">
                                    <a onClick={(e)=>(this.velocityButton.bind(this,e))()} style={{lineHeight:"35px"}} href="#">
                                        <span className="glyphicon glyphicon-leaf"></span>&nbsp;生成模板</a>
                                </li>
                            </ul>
                        </li>

                        <li className="dropdown">
                            <button className="btn btn-primary dropdown-toggle" data-toggle="dropdown" href=""  style={{lineHeight:"25px",marginBottom:"3px",border:'none',background:'#eee',color:'#333'}}>高级功能
                                <span className="caret"></span></button>
                            <ul className="dropdown-menu">
                                <li className="features-menu">
                                    <a onClick={(e)=>(this.btn_model.bind(this,e))()} style={{lineHeight:"35px"}} href="#">
                                        <span className="glyphicon glyphicon-pencil"></span>&nbsp;修改数据权限</a>
                                </li>
                                <li className="features-menu">
                                    <a onClick={(e)=>(this.affairConfiguer.bind(this,e))()} style={{lineHeight:"35px"}} href="#">
                                        <span className="glyphicon glyphicon-wrench"></span>&nbsp;事物查询配置</a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    <form className="form-inline" style={{float:"right"}}>
                        <div className="form-group">
                            <div className="input-group">
                                <input type="text" className="form-control"
                                       placeholder="请输入节点名称查询" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{backgroundColor:'#2083b4',border:'none',marginLeft:'5px'}}>查询</button>
                    </form>
                </div>



                {/*<div id="tableTitleBox">*/}
                {/*<p>所有节点</p>*/}
                {/*</div>*/}

                <table className={"table table-bordered table-hover"} id={'tableBox'} style={{marginTop:"18px"}}>
                    {/*<caption className={"clearfix"}>*/}
                    <NodeAdd node={this} flow={this.props["flow"]}/>
                    <NodeUserPriv flow={this.props["flow"]}/>
                    <AffairConfiguer node={this} flow={this.props["flow"]}/>
                    <button onClick={this.velocity} style={{display:"none"}} id={"velocityButton_"+this.props["flow"].id} className={"btn btn-success pull-left marginleft-normal"}><span className={"glyphicon glyphicon-leaf"}></span>
                        &nbsp;生成页面模板</button>
                    <button onClick={this.formDesign.bind(this,this.props["flow"].id)} style={{display:"none"}} id={"formDesignButton_"+this.props["flow"].id}  className={"btn btn-primary pull-left marginleft-normal "}><span className={"glyphicon glyphicon-list-alt"}></span>
                        &nbsp;页面编辑器</button>
                    <button className={"btn btn-warning pull-right marginright-normal"} style={{display:'none'}} id={"button_flowEdit_"+flowid}><span className={"glyphicon glyphicon-leaf"}></span>
                        &nbsp;编辑流程</button>
                    <FlowEdit flowid={flowid}/>
                    {/*<br/><br/>*/}
                    {/*<span className={"text-info"}>--- 所有节点 ---</span>*/}
                    {/*</caption>*/}
                    <thead className={"bg-primary text-lg"}>
                    <tr className={"text-center"}>
                        <td style={{width:'16%'}}><strong>节点id</strong></td>
                        <td style={{width:'25%'}}><strong>节点名称</strong></td>
                        <td style={{width:'25%'}}><strong>节点描述</strong></td>
                        <td style={{width:'30%'}}><strong>操  作</strong></td>
                    </tr>
                    </thead>
                    <tbody className={"text-center"}>
                    {nodelinearr}
                    </tbody>

                </table>
            </div>
        );
    }
}


export default Node;