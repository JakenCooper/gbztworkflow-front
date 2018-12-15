import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax,CommonObj} from '../common';

class FlowAdd extends React.Component{
    constructor(){
        super();
        this.state={flows:[]};
        this.saveBuss = this.saveBuss.bind(this);
        this.addColumn = this.addColumn.bind(this);
    }
    componentDidMount(){
        $('#button_bussadd').click(function(){
            $('#modal_bussadd').on('show.bs.modal',function(){
                $('#tab_bussadd').find('[data-toggle="tab"]:eq(0)').click();
                $('#hidden_bussadd_connection_busstblname').val('');
            });
            $('#modal_bussadd').modal('show');
            $('#modal_bussadd').on('hidden.bs.modal',function(){
                $("#form_bussadd_connection")[0].reset();
            });
        });

        ajaxreq(adminPath+'/metadata/defaults',{async:false, success:(data)=>{
            $('#div_bussadd_connection [name="bussDbHost"]').val(data.bussDbHost);
            $('#div_bussadd_connection [name="bussDbPort"]').val(data.bussDbPort);
            $('#div_bussadd_connection [name="bussDbName"]').val(data.bussDbName);
            $('#div_bussadd_connection [name="bussDbUserName"]').val(data.bussDbUserName);
            $('#div_bussadd_connection [name="bussDbUserPwd"]').val(data.bussDbUserPwd);
            if(data.bussDbType == 'mysql'){
                $('#div_bussadd_connection select').val('mysql');
            }else if (data.bussDbType == 'oscar'){
                $('#div_bussadd_connection select').val('oscar');
            }
        }});

        $('#tab_flowadd').find('[data-toggle="tab"]:eq(1)').on('show.bs.tab',(e)=>{
            /*let reqdata = serializeformajax($('#form_flowadd_connection'));
            $('#input_flowadd_tableselection_search').val('');
            ajaxreq(adminPath+'/metadata/tables',{
                type:'post',
                contentType:ajax_content_type,
                async:false,
                data:reqdata,
                dataType:'text',
                success:(data)=>{
                    let treedata = JSON.parse(data);
                    this.treedata_tables = treedata;
                    this.treedata_tables_map = new Map();
                    for(let [index,ele] of treedata.entries()){
                        this.treedata_tables_map.set(ele.name,ele);
                    }
                    let treesection = $('#div_flowadd_tableselection > div');
                    treesection.treeview(CommonObj.genTreeView(true,treedata));

                    //alert(result.length);
                    /!*if($('#hidden_flowadd_connection_busstblid').val() != ''){
                        treesection.treeview('selectNode',[$('#hidden_flowadd_connection_busstblid').val(),{silent:true}]);
                    }*!/
                }
            });*/
        });

    }
    saveBuss(){
        if(!confirm('确定创建业务表？')){
            return;
        }

        let tableName = $('#form_bussadd_tableselection [name="bussTableName"]').val();
        if(tableName.length == 0 ){
            alert('并没有填写表名儿');
            return false;
        }
        let columnarr = new Array();
       $.each( $('#tbl_bussadd_tableselection_tbody [name="columnName"]'),function(index,ele){
            columnarr.push($(ele).val());
        });
        let columntypearr = new Array();
        $.each($('#tbl_bussadd_tableselection_tbody [name="columnType"]'),function(index,ele){
            let eleval = $(ele).val();
            if($(ele).parent().siblings().find('input[type="radio"]').is(':checked')) {
                eleval+=' primary key ';
            }
            columntypearr.push(eleval);
        });

        if(columnarr.length == 0 || columntypearr.length == 0){
            alert('并没有添加任何列儿');
            return false;
        }
        if(columnarr.length != columntypearr.length){
            alert('并没有填写全部数据~');
            return false;
        }
       let oridata = {
            bussTableName:tableName,
            bussColumns:columnarr,
            bussColumnsType:columntypearr
        }

        let reqdata = serializeformajax($('#form_bussadd_connection'),oridata);
        ajaxreq(adminPath+'/metadata/create',{
            type:'post',
            async:false,
            contentType:ajax_content_type,
            data:reqdata,
            dataType:'json',
            success:function(data){
                if(data.charge){
                    alert('成功创建业务表！');
                    refreshWin();
                }else{
                    alert(data.message);
                    return false;
                }
            }
        });
    }
    addColumn(){
        // close package,need IIFE
        if(typeof window.tbl_bussadd_tableselection_func_deltr == 'undefined'){
            let delTr = (ele) =>{
                $(ele).parent().parent().remove();
            };
            window.tbl_bussadd_tableselection_func_deltr = delTr;
        }
        let content = '<tr>' +
            '<td><input type="text" name="columnName" class="form-control input-sm"/></td>' +
            '<td><input type="text" name="columnType" class="form-control input-sm"/></td>' +
            '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>';
        $('#tbl_bussadd_tableselection_tbody').append(content);
    }

    addBussColumn(){
        if(typeof window.tbl_bussadd_tableselection_func_deltr == 'undefined'){
            let delTr = (ele) =>{
                $(ele).parent().parent().remove();
            };
            window.tbl_bussadd_tableselection_func_deltr = delTr;
        }
        let idexiststag = false;
        let titleexiststag = false;
        let articlesizeexiststag = false;
        let procinsidexiststag = false;
        let createdateexiststag = false;
        $.each($('#tbl_bussadd_tableselection_tbody td input[name="columnName"]'),function(index,ele){
            if($(ele).val() == 'id'){
                idexiststag = true;
            }
            if($(ele).val() == 'title'){
                titleexiststag = true;
            }
            if($(ele).val() == 'article_size'){
                articlesizeexiststag = true;
            }
            if($(ele).val() == 'proc_ins_id'){
                procinsidexiststag = true;
            }
            if($(ele).val() == 'create_date'){
                createdateexiststag = true;
            }
        });
        if(!idexiststag){
            let content = '<tr>' +
                '<td><input type="text" name="columnName" class="form-control input-sm" value="id"/></td>' +
                '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(36)"/></td>' +
                '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" checked> 选择</label></div></td>' +
                '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                '</tr>';
            $('#tbl_bussadd_tableselection_tbody').append(content);
        }
        if(!titleexiststag){
            let content = '<tr>' +
                '<td><input type="text" name="columnName" class="form-control input-sm" value="title"/></td>' +
                '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                '</tr>';
            $('#tbl_bussadd_tableselection_tbody').append(content);
        }
        if(!articlesizeexiststag){
            let content = '<tr>' +
                '<td><input type="text" name="columnName" class="form-control input-sm" value="article_size"/></td>' +
                '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(200)"/></td>' +
                '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                '</tr>';
            $('#tbl_bussadd_tableselection_tbody').append(content);
        }
        if(!procinsidexiststag){
            let content = '<tr>' +
                '<td><input type="text" name="columnName" class="form-control input-sm" value="proc_ins_id"/></td>' +
                '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(100)"/></td>' +
                '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                '</tr>';
            $('#tbl_bussadd_tableselection_tbody').append(content);
        }
        if(!createdateexiststag){
            let content = '<tr>' +
                '<td><input type="text" name="columnName" class="form-control input-sm" value="create_date"/></td>' +
                '<td><input type="text" name="columnType" class="form-control input-sm" value="datetime"/></td>' +
                '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                '</tr>';
            $('#tbl_bussadd_tableselection_tbody').append(content);
        }
    }
    render(){
        return(
            <div className="modal fade" id="modal_bussadd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog mediummodal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"
                                    aria-hidden="true">&times;</button>
                            <h4 className="modal-title text-danger" id="myModalLabel">
                                + 添 加 业 务 表
                            </h4>
                        </div>
                        <div className="modal-body">
                                <div className="form form-horizontal row container-fluid">

                                    <ul className="nav nav-tabs" id={"tab_bussadd"}>
                                        <li className="active"><a href="#div_bussadd_connection" className={"text-danger"} data-toggle="tab">
                                            <strong> ☞ 第一步：连接信息</strong></a></li>
                                        <li><a href="#div_bussadd_tableselection"  className={"text-danger"} data-toggle="tab">
                                            <strong> ☞ 第二步：填写基本信息</strong></a></li>
                                    </ul>


                                    <div className="tab-content" style={{marginTop:'20px',paddingTop:'20px;'}}>
                                        <div className="tab-pane fade in active" id="div_bussadd_connection">
                                            <form action={adminPath+'/metadata/tables'} method={"post"} id={"form_bussadd_connection"}>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">* 数据库类型</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <select name="bussDbType" className={"form-control"}>
                                                            <option value={"mysql"} selected>买涩口</option>
                                                            <option value={"oscar"}>神通数据库</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">* 数据库主机</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type="text" name="bussDbHost" className={"form-control"}  />
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
                                            </form>

                                        </div>

                                        <div className="tab-pane fade" id="div_bussadd_tableselection">
                                            <div className={"overflowy"} >
                                                <form id={"form_bussadd_tableselection"} method={"post"} action={adminPath+"/metadata/create"}>
                                                    <div >
                                                        <div className={"col-lg-2 text-right"}>
                                                            <label className={"control-label"}>业务表名称：</label>
                                                        </div>
                                                        <div className={"col-lg-10"}>
                                                            <input type={"text"} className={"form-control"} name={"bussTableName"}/>
                                                        </div>
                                                    </div>
                                                    <br/><br/><br/>
                                                    <button type={"button"} onClick={this.addColumn}  className={"btn btn-primary pull-right"}>
                                                        <span className="glyphicon glyphicon-plus"></span>&nbsp;添 加 列
                                                    </button>
                                                    <button type={"button"} onClick={this.addBussColumn}  className={"btn btn-info pull-right"} style={{marginRight:'20px'}}>
                                                        <span className="glyphicon glyphicon-compressed"></span>&nbsp;添加基础业务字段
                                                    </button>
                                                    <br/><br/>
                                                    <table className={"table table-hover table-bordered clearfix"} id={"tbl_bussadd_tableselection"}>
                                                        <thead>
                                                        <tr>
                                                            <td className={"text-center"} style={{width:'30%'}}><strong>列名</strong></td>
                                                            <td className={"text-center"} style={{width:'30%'}}><strong>类型</strong></td>
                                                            <td className={"text-center"} style={{width:'15%'}}><strong>主键</strong></td>
                                                            <td className={"text-center"} style={{width:'15%'}}><strong>操作</strong></td>
                                                        </tr>
                                                        </thead>
                                                        <tbody id={"tbl_bussadd_tableselection_tbody"}>

                                                        </tbody>
                                                    </table>
                                                </form>
                                            </div>
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
        );
    }
}

export default FlowAdd;