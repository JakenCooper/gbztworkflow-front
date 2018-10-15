import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from '../common';

class FlowAdd extends React.Component{
    constructor(){
        super();
        this.saveFlow = this.saveFlow.bind(this);
    }
    componentDidMount(){
        $('#button_flowadd').click(function(){
            $('#modal_flowadd').on('show.bs.modal',function(){
                $('#form_flowadd').find('input').val('');
            });
            $('#modal_flowadd').modal('show');
        });

      /*  $('[name="title_flowadd"]').click(function(){
            alert(arguments.length);
        });*/
    }
    saveFlow(){
        let data = serializeformajax($('#form_flowadd'));
        ajaxreq($('#form_flowadd').attr('action'),{
            type:'post',
            contentType:ajax_content_type,
            data:data,
            async:false,
            dataType:'text',
            success:(result) =>{
                refreshWin();
            }
        });
    }
    saveFlow1(e){
        // $('#tab_flowadd').find('li:eq(1)').find('a').click();
        e.preventDefault();
        return false;
    }
    render(){
        return(
            <div className="modal fade" id="modal_flowadd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog mediummodal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"
                                    aria-hidden="true">&times;</button>
                            <h4 className="modal-title text-danger" id="myModalLabel">
                                + 添 加 流 程
                                &nbsp;&nbsp;<strong> [囍囍]  ╮(￣▽￣| ")╭  [囍囍]</strong>
                            </h4>
                        </div>
                        <div className="modal-body">
                            <form action={adminPath+'/defination/flows'} method={"post"} id={"form_flowadd"}>
                                <div className="form form-horizontal row container-fluid">

                                    <ul className="nav nav-tabs" id={"tab_flowadd"}>
                                        <li className="active"><a href="#div_flowadd_connection" className={"text-danger"} data-toggle="tab">
                                            <strong> ☞ 第一步：连接信息</strong></a></li>
                                        <li><a href="#div_flowadd_tableselection"  className={"text-danger"} data-toggle="tab">
                                            <strong> ☞ 第二步：选择业务表</strong></a></li>
                                        <li><a href="#div_flowadd_columnselection"  className={"text-danger"} data-toggle="tab">
                                            <strong> ☞ 第三步：确定业务字段范围</strong></a></li>
                                    </ul>


                                    <div className="tab-content" style={{marginTop:'20px',paddingTop:'20px;'}}>
                                        <div className="tab-pane fade in active" id="div_flowadd_connection">
                                            <div className="form-group">
                                                <div className="col-lg-2 text-right">
                                                    <label className="control-label">* 流程名称</label>
                                                </div>
                                                <div className="col-lg-10">
                                                    <input type={"text"} name="flowName" className={"form-control"}/>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-2 text-right">
                                                    <label className="control-label">* 数据库类型</label>
                                                </div>
                                                <div className="col-lg-10">
                                                    <select name="bussDbType" className={"form-control"}>
                                                        <option value={"mysql"} selected>mysql</option>
                                                        <option value={"oscar"}>神通</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-2 text-right">
                                                    <label className="control-label">* 数据库主机</label>
                                                </div>
                                                <div className="col-lg-10">
                                                    <input type={"text"} name="bussDbHost" className={"form-control"}/>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-2 text-right">
                                                    <label className="control-label">* 数据库端口</label>
                                                </div>
                                                <div className="col-lg-10">
                                                    <input type={"text"} name="bussDbPort" className={"form-control"}/>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-2 text-right">
                                                    <label className="control-label">* 数据库名称</label>
                                                </div>
                                                <div className="col-lg-10">
                                                    <input type={"text"} name="bussDbName" className={"form-control"}/>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-2 text-right">
                                                    <label className="control-label">* 用   户</label>
                                                </div>
                                                <div className="col-lg-10">
                                                    <input type={"text"} name="bussDbUserName" className={"form-control"}/>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-lg-2 text-right">
                                                    <label className="control-label">* 密   码</label>
                                                </div>
                                                <div className="col-lg-10">
                                                    <input type={"password"} name="bussDbUserPwd" className={"form-control"}/>
                                                </div>
                                            </div>


                                        </div>

                                        <div className="tab-pane fade" id="div_flowadd_tableselection">
                                            fdsfds
                                        </div>
                                        <div className="tab-pane fade" id="div_flowadd_columnselection">
                                            cxbcvxbvcx
                                        </div>
                                    </div>


                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <span className={"text-danger"}><strong> ☞ 第四步：点按钮！ </strong></span>
                            <button type="button" onClick={this.saveFlow} className="btn btn-primary">提 交</button>&nbsp;
                            <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default FlowAdd;