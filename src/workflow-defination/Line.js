import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from '../common';

class Line extends React.Component{
    constructor(){
        super();
        this.state = {node:{},lines:[]};
        this.openModal = this.openModal.bind(this);
        this.saveLine = this.saveLine.bind(this);
        this.delLine = this.delLine.bind(this);
    }
    componentDidMount(){
        $("#linecanvas_"+this.props["node"].id).hide();
    }
    refresh(){
        ajaxreq(adminPath+'/defination/nodes/'+this.props['node'].id,{success:(node)=>{
            this.setState({node:node,lines:[]});
        }});
    }
    openModal(e){
        /*$('#button_line').click(function(){
            $('#modal_line').modal('show');
        });*/
        /*let outernode = this.props['node'];
        $("#linecanvas_"+outernode.id).show();
        let ctx = $("#linecanvas_"+outernode.id)[0].getContext('2d');
        ctx.beginPath();
        ctx.moveTo(80,80);
        ctx.lineTo(500,500);
        ctx.closePath();
        ctx.lineWidth=10;
        ctx.strokeStyle='red';
        ctx.stroke();*/
        $(e.target).next().modal('show');
        this.refresh();
    }
    selectNodeEle(e){
        /*$(e.target).find('input').is(':checked')?$(e.target).find('input').removeAttr('checked'):$(e.target).find('input').attr('checked','');
        e.stopPropagation();*/
    }
    openLineEditorModal(e,id,name,tag,status){
        e.stopPropagation();
        let outernode = this.props['node'];
        let forelines = this.state.node.inLines;
        let nextlines = this.state.node.outLines;
        $('#mode_lineadd_'+outernode.id).on('show.bs.modal',function(){
            if(tag == 'fore'){
                $('#id_lineadd_beginnode_'+outernode.id).val(id);
                $('#id_lineadd_endnode_'+outernode.id).val(outernode.id);
                $('#name_lineadd_beginnode_'+outernode.id).val(name);
                $('#name_lineadd_endnode_'+outernode.id).val(outernode.name);
                for(let [index,foreline] of forelines.entries()){
                    if(foreline.beginNodeId == id && foreline.endNodeId == outernode.id){
                        if(foreline.canWithdraw){
                            $('#chk_lineadd_withdraw_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else{
                            $('#chk_lineadd_withdraw_'+outernode.id).removeAttr('checked');
                        }
                        //     defaultChecked={"true"}
                        if(foreline.taskType == 'usertask'){
                            $('#user_task_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else if (foreline.taskType == 'systask') {
                            $('#sys_task_'+outernode.id).removeAttr('checked').attr('checked','');
                        }
                        if(foreline.finishType == 'multi'){
                            $('#multi_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else if (foreline.finishType == 'single') {
                            $('#single_'+outernode.id).removeAttr('checked').attr('checked','');
                        }
                        if(foreline.execType == 'concurrent'){
                            $('#concurrent_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else if (foreline.execType == 'block') {
                            $('#block_'+outernode.id).removeAttr('checked').attr('checked','');
                        }
                        if(foreline.canRetreat){
                            $('#chk_lineadd_retreat_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else{
                            $('#chk_lineadd_retreat_'+outernode.id).removeAttr('checked');
                        }
                        if(foreline.execSingle){
                            $('#chk_lineadd_execsingle_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else{
                            $('#chk_lineadd_execsingle_'+outernode.id).removeAttr('checked');
                        }
                    }
                }
            }else{
                $('#id_lineadd_beginnode_'+outernode.id).val(outernode.id);
                $('#id_lineadd_endnode_'+outernode.id).val(id);
                $('#name_lineadd_beginnode_'+outernode.id).val(outernode.name);
                $('#name_lineadd_endnode_'+outernode.id).val(name);
                for(let [index,nextline] of nextlines.entries()){
                    if(nextline.beginNodeId == outernode.id && nextline.endNodeId == id){
                        if(nextline.canWithdraw){
                            $('#chk_lineadd_withdraw_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else{
                            $('#chk_lineadd_withdraw_'+outernode.id).removeAttr('checked');
                        }
                        if(nextline.taskType == 'usertask'){
                            $('#user_task_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else if (nextline.taskType == 'systask') {
                            $('#sys_task_'+outernode.id).removeAttr('checked').attr('checked','');
                        }
                        if(nextline.finishType == 'multi'){
                            $('#multi_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else if (nextline.finishType == 'single') {
                            $('#single_'+outernode.id).removeAttr('checked').attr('checked','');
                        }
                        if(nextline.execType == 'concurrent'){
                            $('#concurrent_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else if (nextline.execType == 'block') {
                            $('#block_'+outernode.id).removeAttr('checked').attr('checked','');
                        }
                        if(nextline.canRetreat){
                            $('#chk_lineadd_retreat_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else{
                            $('#chk_lineadd_retreat_'+outernode.id).removeAttr('checked');
                        }
                        if(nextline.execSingle){
                            $('#chk_lineadd_execsingle_'+outernode.id).removeAttr('checked').attr('checked','');
                        }else{
                            $('#chk_lineadd_execsingle_'+outernode.id).removeAttr('checked');
                        }
                    }
                }
            }
            $('#flowid_lineadd_'+outernode.id).val(outernode.flowId);
            if(status == 'check'){
                $('#tips_no_lineadd_'+outernode.id).hide();
                $('#tips_yes_lineadd_'+outernode.id).show();
                $('#btn_lineadd_remove_'+outernode.id).show();
            }else{
                $('#tips_no_lineadd_'+outernode.id).show();
                $('#tips_yes_lineadd_'+outernode.id).hide();
                $('#btn_lineadd_remove_'+outernode.id).hide();
            }
        });
        $('#mode_lineadd_'+outernode.id).modal("show");
        $('#mode_lineadd_'+outernode.id).on('hidden.bs.modal',function(){
            $("#form_lineadd_"+outernode.id)[0].reset();
        });
    }
    saveLine(){
        let outernode = this.props['node'];
        var data = serializeformajax($('#form_lineadd_'+outernode.id));
        ajaxreq($('#form_lineadd_'+outernode.id).attr('action'),{
            type:'post',
            async:false,
            contentType:ajax_content_type,
            data:data,
            dataType:'text',
            success:(data)=>{
                $('#mode_lineadd_'+outernode.id).modal("hide");
                this.refresh();
            }
        });
    }
    delLine(){
        let outernode = this.props['node'];
        var data = serializeformajax($('#form_lineadd_'+outernode.id));
        ajaxreq($('#form_lineadd_'+outernode.id).attr('action'),{
            type:'delete',
            async:false,
            contentType:ajax_content_type,
            data:data,
            dataType:'text',
            success:(data)=>{
                $('#mode_lineadd_'+outernode.id).modal("hide");
                this.refresh();
            }
        });
    }
    render(){
        let outernode = this.props['node'];
        let allNodesInFlow = this.state.node.allNodesInFlow;
        let foreNodes = this.state.node.foreNodes;
        let nextNodes = this.state.node.nextNodes;
        let foreNodeMap = new Map();
        let nextNodeMap = new Map();

        let foreNodeArr = new Array();
        let nextNodeArr =new Array();
        let foreNodeContent =null;
        let nextNodeContent = null;
        if(typeof foreNodes != 'undefined'){
            for(let [index,node] of foreNodes.entries()){
                foreNodeMap.set(node.id,node);
            }
            for(let [index,node] of nextNodes.entries()){
                nextNodeMap.set(node.id,node);
            }
            for(let [index,node] of allNodesInFlow.entries()){
                if(foreNodeMap.has(node.id)){
                    foreNodeContent = (
                        <div className={"line-node-ele bg-success clearfix"} onClick={this.selectNodeEle}>
                            <input type={"checkbox"} id={"chk_forenode_" + node.id} checked disabled/>
                            <label htmlFor={"chk_forenode_" + node.id}
                                   className={"marginleft-small"}>{node.name}
                                   {node.beginNode == true?'（起始节点）':''}
                                {node.endNode == true?'（结束节点）':''}</label>
                            <button className={"btn btn-mini btn-warning pull-right"} onClick={(e)=>(this.openLineEditorModal.bind(this,e,node.id,node.name,'fore','check'))()}>
                                <span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp; 编辑上一步属性
                            </button>
                        </div>
                    )
                }else{
                    foreNodeContent = (
                        <div className={"line-node-ele clearfix"}>
                            <input type={"checkbox"} id={"chk_forenode_"+node.id} disabled/>
                            <label for={"chk_forenode_"+node.id} className={"marginleft-small"}>{node.name}
                                {node.beginNode == true?'（起始节点）':''}
                                {node.endNode == true?'（结束节点）':''}</label>
                            <button className={"btn btn-mini btn-info pull-right"} onClick={(e)=>(this.openLineEditorModal.bind(this,e,node.id,node.name,'fore','uncheck'))()}>
                                <span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp; 编辑上一步属性
                            </button>
                        </div>
                    )
                }
                if(nextNodeMap.has(node.id)){
                    nextNodeContent = (
                        <div className={"line-node-ele bg-success clearfix"} onClick={this.selectNodeEle}>
                            <input type={"checkbox"} id={"chk_nextnode_" + node.id} checked disabled/>
                            <label htmlFor={"chk_nextnode_" + node.id}
                                   className={"marginleft-small"}>{node.name}
                                {node.beginNode == true?'（起始节点）':''}
                                {node.endNode == true?'（结束节点）':''}</label>
                            <button className={"btn btn-mini btn-warning pull-right"} onClick={(e)=>(this.openLineEditorModal.bind(this,e,node.id,node.name,'next','check'))()}>
                                <span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp; 编辑下一步属性
                            </button>
                        </div>
                    )
                }else{
                    nextNodeContent = (
                        <div className={"line-node-ele clearfix"} onClick={this.selectNodeEle}>
                            <input type={"checkbox"} id={"chk_nextnode_" + node.id} disabled/>
                            <label htmlFor={"chk_nextnode_" + node.id}
                                   className={"marginleft-small"}>{node.name}
                                {node.beginNode == true?'（起始节点）':''}
                                {node.endNode == true?'（结束节点）':''}</label>
                            <button className={"btn btn-mini btn-info pull-right"} onClick={(e)=>(this.openLineEditorModal.bind(this,e,node.id,node.name,'next','uncheck'))()}>
                                <span className={"glyphicon glyphicon-pencil"}></span>
                                &nbsp; 编辑下一步属性
                            </button>
                        </div>
                    )
                }
                foreNodeArr.push(foreNodeContent);
                nextNodeArr.push(nextNodeContent);
            }
        }
        return(
            <div className={"inlineblock"}>
                <button className={"btn btn-info btn-sm "}  onClick={this.openModal} ><span className={"glyphicon glyphicon-plane"}></span>
                    &nbsp;&nbsp;维护连线</button>&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="modal fade" id={"modal_line_"+this.props["node"].id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true" data-backdrop="static">
                    <div className="modal-dialog largemodal"  >
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title vertial-center" id="myModalLabel">
                                    <span className={"glyphicon glyphicon-plane"}></span>
                                    &nbsp;&nbsp;维 护 连 线
                                </h4>
                            </div>
                            <div>
                                <div style={{marginTop:'20px'}}>
                                        <div className="form form-horizontal row container-fluid">
                                            <div className={"caption col-lg-5"} style={{height:'95%;'}}>
                                                <div className={"caption line-maintain"}>
                                                    <div className="panel panel-info">
                                                        <div className="panel-heading">
                                                            <h3 className="panel-title text-center">
                                                                <span className={"glyphicon glyphicon-arrow-left"}></span> &nbsp;上一步列表
                                                            </h3>
                                                        </div>
                                                        <div className="panel-body">
                                                            {foreNodeArr}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"caption col-lg-2 line-maintain text-center thumbnail"} style={{height:'95%'}}>
                                                  --- 当 前 节 点  ---<br/><br/>
                                                <label className={"text-info"}>{this.props["node"].name}</label>
                                                <canvas id={"linecanvas_"+outernode.id}
                                                        style={{border:'1px solid #000000',position:'absolute',left:'0px',top:'0px',zIndex:'99999'}}></canvas>
                                            </div>
                                            <div className={"caption col-lg-5 "} style={{height:'95%;'}}>
                                                <div className={"caption line-maintain"}>
                                                    <div className="panel panel-info">
                                                        <div className="panel-heading clearfix">
                                                            <h3 className="panel-title text-center">
                                                                下一步列表 &nbsp;<span className={"glyphicon glyphicon-arrow-right"}></span>
                                                            </h3>
                                                        </div>
                                                        <div className="panel-body">
                                                            {nextNodeArr}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {/*<button type="button" className="btn btn-primary">提 交</button>&nbsp;*/}
                                <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="modal fade" id={"mode_lineadd_"+outernode.id} tabIndex="-1" role="dialog"
                     aria-hidden="true">
                    <div className="modal-dialog smallmodal">
                        <div className="modal-content bg-danger">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title" id="label_nodeadd">
                                    <span className={"glyphicon glyphicon-pencil"}></span>
                                    &nbsp; 编 辑 连 线 属 性 &nbsp;
                                    <span className={"text-danger"} id={"tips_no_lineadd_"+outernode.id}><strong>【当前连线状态：无】</strong></span>
                                    <span className={"text-success"} id={"tips_yes_lineadd_"+outernode.id}><strong>【当前连线状态：有】</strong></span>
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form action={adminPath+'/defination/lines'} method={"post"} id={"form_lineadd_"+outernode.id}>
                                    <input type={"hidden"} id={"id_lineadd_beginnode_"+outernode.id} name={"beginNodeId"} />
                                    <input type={"hidden"} id={"id_lineadd_endnode_"+outernode.id} name={"endNodeId"} />
                                    <input type={"hidden"} id={"flowid_lineadd_"+outernode.id} name={"flowId"} />
                                    <div className="form form-horizontal row container-fluid">
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">起始节点：</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"text"} name="beginNodeName"  readOnly id={"name_lineadd_beginnode_"+outernode.id}
                                                       className={"form-control"} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">结束节点：</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"text"} name="endNodeName"  readOnly id={"name_lineadd_endnode_"+outernode.id}
                                                       className={"form-control"} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">任务类型：</label>
                                            </div>
                                            <div className="col-lg-10 clearfix">
                                                <div className={"radio pull-left"}>
                                                    <label>
                                                        <input  type="radio" name="taskType" id={"user_task_"+outernode.id}  value="usertask"/> 用户任务
                                                    </label>
                                                </div>
                                                <div className={"radio pull-left marginleft-normal"}>
                                                    <label>
                                                        <input  type="radio" id={"sys_task_"+outernode.id} name="taskType" value="systask"/> 系统任务
                                                    </label>
                                                </div>
                                                <div className={"clearfix"}>
                                                </div>
                                                <br/>
                                                <div className={"form-control "} style={{border:'none'}}>
                                                    <label>系统任务类型：</label>
                                                </div>
                                                <select name={"sysTaskName"} className={"form-control"}>
                                                    <option value={"auto_finish"}>自动完成</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">实例类型：</label>
                                            </div>
                                            <div className="col-lg-10 clearfix">
                                                <div className={"radio pull-left"}>
                                                    <label>
                                                        <input  type="radio" id={"single_"+outernode.id} name="finishType"   value="single" /> 单实例
                                                    </label>
                                                </div>
                                                <div className={"radio pull-left marginleft-normal"}>
                                                    <label>
                                                        <input  type="radio" id={"multi_"+outernode.id} name="finishType" value="multi"/> 多实例
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">执行类型：</label>
                                            </div>
                                            <div className="col-lg-10 clearfix">
                                                <div className={"radio pull-left"}>
                                                    <label>
                                                        <input  type="radio" id={"block_"+outernode.id} name="execType"  value="block" /> 串行
                                                    </label>
                                                </div>
                                                <div className={"radio pull-left marginleft-normal"}>
                                                    <label>
                                                        <input  type="radio" id={"concurrent_"+outernode.id} name="execType" value="concurrent" /> 并行
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-10 col-lg-offset-2 clearfix">
                                                <div className="checkbox pull-left">
                                                    <label>
                                                        <input type="checkbox" name={"canWithdraw"} id={"chk_lineadd_withdraw_"+outernode.id} value={"true"}/> 可收回
                                                    </label>
                                                </div>
                                                <div className="checkbox pull-left" style={{marginLeft:'20px'}}>
                                                    <label>
                                                        <input type="checkbox" name={"canRetreat"} id={"chk_lineadd_retreat_"+outernode.id} value={"true"}/> 可退回
                                                    </label>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id={"btn_lineadd_remove_"+this.props['node'].id} onClick={this.delLine} className="btn btn-danger">删除连线</button>&nbsp;
                                <button type="button" onClick={this.saveLine} className="btn btn-primary">提 交</button>&nbsp;
                                <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

export default Line;