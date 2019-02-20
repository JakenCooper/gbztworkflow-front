import React,{ Fragment } from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax,CommonObj} from '../common';

class ConfigInfo extends React.Component{
    constructor(){
        super();
        this.state={flows:[],firstClick:true};
        this.saveBuss = this.saveBuss.bind(this);
    }
    componentDidMount(){
        $('#button_configinfo').click(function(){
            $('#modal_configinfo').on('show.bs.modal',function(){
                $('#hidden_configinfo_connection_busstblname').val('');
            });
            $('#modal_configinfo').modal('show');

            $('button#addBussColumn').click();
            $('button#addFileAttachTable').click();
        });

        ajaxreq(adminPath+'/connectConfig/load',{async:false, success:(data)=>{
                $('#div_configinfo_connection [name="bussDbHost"]').val(data.dataBaseIp);
                $('#div_configinfo_connection [name="bussDbPort"]').val(data.dataBasePort);
                $('#div_configinfo_connection [name="bussDbName"]').val(data.dataBaseName);
                $('#div_configinfo_connection [name="bussDbUserName"]').val(data.dataBaseUserName);
                $('#div_configinfo_connection [name="bussDbUserPwd"]').val(data.dataBasePassword);
                $('#div_configinfo_connection [name="moduleRootPath"]').val(data.modulePath);
                $('#div_configinfo_connection [name="id"]').val(data.id);
                $('#div_configinfo_connection select').val(data.dataBaseType);
        }});
    }
    saveBuss(){
        if(!confirm('确定保存配置信息?')){
            return;
        }
        var moduleRootPath = $('#div_configinfo_connection [name="moduleRootPath"]').val();
        // 判断模块路径是否以'/'结尾,若不是则自动添加
        if (moduleRootPath.charAt(moduleRootPath.length-1) != "/"){
            if (moduleRootPath.charAt(moduleRootPath.length-1) != "\\"){
                if (moduleRootPath != null || moduleRootPath != ''){
                    $('#div_configinfo_connection [name="moduleRootPath"]').val($('#div_configinfo_connection [name="moduleRootPath"]').val()+'/');
                }
            }
        }
        let dataBaseIp = $('#div_configinfo_connection [name="bussDbHost"]').val();
        let dataBasePort = $('#div_configinfo_connection [name="bussDbPort"]').val();
        let dataBaseName = $('#div_configinfo_connection [name="bussDbName"]').val();
        let dataBaseUserName = $('#div_configinfo_connection [name="bussDbUserName"]').val();
        let dataBasePassword = $('#div_configinfo_connection [name="bussDbUserPwd"]').val();
        let modulePath = $('#div_configinfo_connection [name="moduleRootPath"]').val();
        let id = $('#div_configinfo_connection [name="id"]').val();
        let dataBaseType = $('#div_configinfo_connection select').val();
        let oridata = {
            id:id,
            dataBaseIp:dataBaseIp,
            dataBasePort:dataBasePort,
            dataBaseName:dataBaseName,
            dataBaseUserName:dataBaseUserName,
            dataBasePassword:dataBasePassword,
            modulePath:modulePath,
            dataBaseType:dataBaseType
        }
        console.log(JSON.stringify(oridata));
        $.ajax({
            type:'post',
            url:adminPath+'/connectConfig/operation',
            dataType:'json',
            data: JSON.stringify(oridata),
            contentType:"application/json",
            success:function(data){
                if('success'== data.result){
                    alert('成功修改配置信息！');
                    refreshWin();
                }else{
                    alert('创建失败!!');
                    return false;
                }
            }
        });
    }
    render(){
        return(
            <Fragment>
                <button className="btn btn-info btn-group-justified" id="button_configinfo">
                    配 置 信 息
                </button>
                <div className="modal fade" id="modal_configinfo" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog mediummodal">
                        <div className="modal-content">
                            <div className="modal-header" style={{backgroundColor:'#2083d4'}}>
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title text-danger" id="myModalLabel" style={{color:'#fff',padding:0}}>
                                    + 配 置 信 息
                                </h4>
                            </div>
                            <div className="modal-body">
                                <div className="form form-horizontal row container-fluid">
    
                                    <div className="tab-content" style={{marginTop:'20px',paddingTop:'20px;'}}>
                                        <div className="tab-pane fade in active" id="div_configinfo_connection">
                                            <form action={adminPath+'/metadata/tables'} method={"post"} id={"form_configinfo_connection"}>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label className="control-label"><font color="red">*</font> 数据库类型</label>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <select name="bussDbType" className={"form-control"}>
                                                                <option value={"mysql"} selected>买涩口</option>
                                                                <option value={"oscar"}>神通数据库</option>
                                                            </select>
                                                            <input type="hidden" name="id" className={"form-control"}/>
                                                            {/*<input type="text" name="bussDbType" className={"form-control"} value={"mysql"}/>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label className="control-label"><font color="red">*</font> 数据库主机</label>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <input type="text" name="bussDbHost" className={"form-control"}  />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label className="control-label"><font color="red">*</font> 数据库端口</label>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <input type={"text"} name="bussDbPort" className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label className="control-label"><font color="red">*</font> 数据库名称</label>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <input type={"text"} name="bussDbName" className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label className="control-label"><font color="red">*</font> 用   户</label>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <input type={"text"} name="bussDbUserName" className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label className="control-label"><font color="red">*</font> 密   码</label>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <input type={"password"} name="bussDbUserPwd" className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-3 text-right">
                                                            <label className="control-label"><font color="red">*</font> 生成模块路径</label>
                                                        </div>
                                                        <div className="col-md-8">
                                                            <input type={"text"} name="moduleRootPath" placeholder={"填写文件生成路径"} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                
                                            </form>
    
                                        </div>
                                    </div>
                                </div>
                                {/*</form>*/}
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.saveBuss} className="btn btn-primary">提 交</button>&nbsp;
                                <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                            </div>
    
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default ConfigInfo;