import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from '../common';

class NodeAdd extends React.Component{
    constructor(){
        super();
        this.state = {
            assignUser : ''
        }
        this.saveNode = this.saveNode.bind(this);
        this.endNodeOnChange = this.endNodeOnChange.bind(this);
        this.assignUserChange = this.assignUserChange.bind(this);
    }
    componentDidMount(){
        let flowid = this.props['flow'].id;
        $('#button_nodeadd_'+flowid).click(function(){
            $('#modal_nodeadd_'+flowid).on('show.bs.modal',function(){
                $('#form_nodeadd_'+flowid).find('input[type="text"]').val('');
                $('#form_nodeadd_'+flowid).find('textarea').html('');
                $('#form_nodeadd_'+flowid).find('textarea').val('');
            });
            $('#modal_nodeadd_'+flowid).modal('show');
            $('#modal_nodeadd_'+flowid).on('hidden.bs.modal',function(){
                $("#form_nodeadd_"+flowid)[0].reset();
            });
        });
    }
    endNodeOnChange(e){ // 勾选结束节点时,为 固定分配用户 赋默认值
        if (e.target.checked) {
            this.setState({assignUser : 'superallcandoman'});
        }
    }
    assignUserChange(e){
        this.setState({assignUser:e.target.value});
    }
    saveNode(){
        let flowid = this.props['flow'].id;
        // let nodeDefId = $('#form_nodeadd_'+flowid).find('[name="nodeDefId"]').val();
        // if(nodeDefId == '' || nodeDefId.split('-').length == 0 || nodeDefId.indexOf("audit-")!=0){
        //     alert('节点id格式错误');
        //     return ;
        // }
        let data = serializeformajax($('#form_nodeadd_'+flowid));
        let nodeobj = this.props['node'];
        ajaxreq($('#form_nodeadd_'+flowid).attr('action'),{
            type:'post',
            contentType:ajax_content_type,
            data:data,
            async:false,
            dataType:'text',
            success:(result) =>{
                $('#modal_nodeadd_'+flowid).modal('hide');
                nodeobj.refresh();
            }
        });
    }
    render(){
        return(
            <div>
                <button className={"btn btn-info pull-left"} style={{display:"none"}} id={"button_nodeadd_"+this.props['flow'].id}><span className="glyphicon glyphicon-plus"></span>
                    &nbsp; 添 加 节 点</button>
                <div className="modal fade" id={"modal_nodeadd_"+this.props['flow'].id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header" style={{backgroundColor:'#2083d4'}}>
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title" id="label_nodeadd" style={{color:'#fff'}}>
                                    + 添 加 节 点
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form action={adminPath+'/defination/nodes'} method={"post"} id={"form_nodeadd_"+this.props['flow'].id}>
                                    <input type={"hidden"} name={"flowId"} value={this.props["flow"].id}/>
                                    <div className="form form-horizontal row container-fluid">
                                        <div style={{display:'none'}} className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label"><font color="red">*</font> 节点id</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"text"} name="nodeDefId" className={"form-control"} placeholder={"audit-xx"}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label"><font color="red">*</font> 节点名称</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"text"} name="name" className={"form-control"}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">节点描述</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <textarea className={"form-control"} rows={"2"} name={"description"} style={{resize:'none'}}></textarea>
                                            </div>
                                        </div>
                                        <div className  ="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">固定分配用户</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"text"} className="form-control" onChange={this.assignUserChange} value={this.state.assignUser} name={"assignUser"}
                                                       placeholder={"如果需要固定分配用户请输入用户登录名"}/>
                                            </div>
                                        </div>
                                        <div style={{display:'none'}} className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">排序号</label>
                                            </div>
                                            <div className="col-lg-10">
                                                <input type={"number"} className="form-control" name={"sortNum"} min={"1"} max={"100"} placeholder={"1~100的整数"}/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-lg-10 col-lg-offset-2 clearfix">
                                                <div className="checkbox pull-left">
                                                    <label>
                                                        <input type="checkbox" name={"beginNode"} value={"true"}/> 起始节点
                                                    </label>
                                                </div>
                                                <div className="checkbox pull-left" style={{marginLeft:'20px'}}>
                                                    <label>
                                                        <input type="checkbox" name={"endNode"} onChange={this.endNodeOnChange} value={true}/> 结束节点
                                                    </label>
                                                </div>
                                                <div className="checkbox pull-left" style={{marginLeft:'20px'}}>
                                                    <label>
                                                        <input type="checkbox" name={"transferOut"}  value={true}/> 允许转出
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.saveNode} className="btn btn-primary">提 交</button>&nbsp;
                                <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NodeAdd;