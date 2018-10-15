import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from '../common';

class NodeAdd extends React.Component{
    constructor(){
        super();
        this.saveNode = this.saveNode.bind(this);
    }
    componentDidMount(){
        let flowid = this.props['flow'].id;
        $('#button_nodeadd').click(function(){
            $('#modal_nodeadd_'+flowid).on('show.bs.modal',function(){
                $('#form_nodeadd_'+flowid).find('input[type="text"]').val('');
                $('#form_nodeadd_'+flowid).find('textarea').html('');
                $('#form_nodeadd_'+flowid).find('textarea').val('');
            });
            $('#modal_nodeadd_'+flowid).modal('show');
        });
    }
    saveNode(){
        let flowid = this.props['flow'].id;
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
                <button className={"btn btn-info pull-right"} id={"button_nodeadd"}><span className="glyphicon glyphicon-plus"></span>
                    &nbsp; 添 加 节 点</button>
                <div className="modal fade" id={"modal_nodeadd_"+this.props['flow'].id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title" id="label_nodeadd">
                                    + 添 加 节 点
                                </h4>
                            </div>
                            <div className="modal-body">
                                <form action={adminPath+'/defination/nodes'} method={"post"} id={"form_nodeadd_"+this.props['flow'].id}>
                                    <input type={"hidden"} name={"flowId"} value={this.props["flow"].id}/>
                                    <div className="form form-horizontal row container-fluid">
                                        <div className="form-group">
                                            <div className="col-lg-2 text-right">
                                                <label className="control-label">* 节点名称</label>
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
                                        <div className="form-group">
                                            <div className="col-lg-10 col-lg-offset-2 clearfix">
                                                <div className="checkbox pull-left">
                                                    <label>
                                                        <input type="checkbox" name={"beginNode"} value={"true"}/> 起始节点
                                                    </label>
                                                </div>
                                                <div className="checkbox pull-left" style={{marginLeft:'20px'}}>
                                                    <label>
                                                        <input type="checkbox" name={"endNode"} value={true}/> 结束节点
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