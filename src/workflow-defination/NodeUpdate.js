import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from '../common';

class NodeUpdate extends React.Component{
    constructor(){
        super();
        this.updateNode = this.updateNode.bind(this);
    }
    componentDidMount(){
        let nodeid = this.props['node'].id;
        $('#button_nodeupdate_'+nodeid).click(function(){
            $('#modal_nodeupdate_'+nodeid).on('show.bs.modal',function(){
            });
            $('#modal_nodeupdate_'+nodeid).modal('show');
            $('#modal_nodeupdate_'+nodeid).on('hidden.bs.modal',function(){
                $("#form_nodeupdate_"+nodeid)[0].reset();
            });
        });
    }
    updateNode(){
        let nodeid = this.props['node'].id;
        let nodeDefId = $('#form_nodeupdate_'+nodeid).find('[name="nodeDefId"]').val();
        let nodeName = $('#form_nodeupdate_'+nodeid).find('[name="name"]').val();
        if(nodeDefId == '' || nodeDefId.split('-').length == 0 || nodeDefId.indexOf("audit-")!=0 || nodeDefId == null){
            alert('节点id格式错误');
            return ;
        }
        if(nodeName == '' || nodeName == null){
            alert('节点名称格式错误');
            return ;
        }
        let data = serializeformajax($('#form_nodeupdate_'+nodeid));
        let outernodeobj = this.props['outernodeobj'];
        ajaxreq($('#form_nodeupdate_'+nodeid).attr('action'),{
            type:'post',
            contentType:ajax_content_type,
            data:data,
            async:false,
            dataType:'text',
            success:(result) =>{
                $('#modal_nodeupdate_'+nodeid).modal('hide');
                outernodeobj.refresh();
            }
        });
    }
    render(){
        let currentNode = this.props['node'];
        if (currentNode.beginNode){
            $('#beginNode_'+currentNode.id).attr("checked", 'checked');
        }
        if (currentNode.endNode){
            $('#endNode_'+currentNode.id).attr("checked", 'checked');
        }
        return(
            <div className={"inlineblock"}>
                <button className={"btn btn-warning btn-sm"} id={"button_nodeupdate_"+currentNode.id}><span className="glyphicon glyphicon-pencil"></span>
                    &nbsp; 修改节点</button>&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="modal fade" id={"modal_nodeupdate_"+currentNode.id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header" style={{backgroundColor:'#2083d4'}}>
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title" id={"label_nodeupdate_"+currentNode.id} style={{color:'#fff'}}>
                                    + 修 改 节 点
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form action={adminPath+'/defination/nodes/'+currentNode.id} method={"post"} id={"form_nodeupdate_"+currentNode.id}>
                                    <input type={"hidden"} name={"flowId"} value={this.props["node"].flowId}/>
                                    <div className="form form-horizontal row container-fluid">
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label"><font color="red">*</font> 节点id</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"text"} name="nodeDefId" className={"form-control"} placeholder={"audit-xx"} defaultValue={currentNode.nodeDefId}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label"><font color="red">*</font> 节点名称</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"text"} name="name" className={"form-control"} defaultValue={currentNode.name}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">节点描述</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <textarea className={"form-control"} rows={"2"} name={"description"} style={{resize:'none'}} defaultValue={"11"}></textarea>
                                            </div>
                                        </div>
                                        <div className  ="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">固定分配用户</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"text"} className="form-control" name={"assignUser"}  placeholder={"去查用户ID！"}
                                                       defaultValue={currentNode.assignUser}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">排序号</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"number"} className="form-control" name={"sortNum"} min={"1"} max={"100"} placeholder={"1~100的整数"}
                                                       defaultValue={currentNode.sortNum}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-10 col-lg-offset-2 clearfix">
                                                <div className="checkbox pull-left">
                                                    <label>
                                                        <input type="checkbox" id={"beginNode_"+currentNode.id} name={"beginNode"} value={"true"}/> 起始节点
                                                    </label>
                                                </div>
                                                <div className="checkbox pull-left" style={{marginLeft:'20px'}}>
                                                    <label>
                                                        <input type="checkbox" id={"endNode_"+currentNode.id} name={"endNode"} value={true}/> 结束节点
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.updateNode} className="btn btn-primary">提 交</button>&nbsp;
                                <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default NodeUpdate;