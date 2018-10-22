import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax,CommonObj} from '../common';

class FlowAdd extends React.Component{
    constructor(){
        super();
        this.state={flows:[]};
        this.saveFlow = this.saveFlow.bind(this);
    }
    componentDidMount(){
        $('#button_flowadd').click(function(){
            $('#modal_flowadd').on('show.bs.modal',function(){
                //$('#form_flowadd').find('input').val('');
                $('#tab_flowadd').find('[data-toggle="tab"]:eq(0)').click();
                $('#hidden_flowadd_connection_busstblname').val('');
            });
            $('#modal_flowadd').modal('show');
        });

        ajaxreq(adminPath+'/metadata/defaults',{async:false, success:(data)=>{
            $('#div_flowadd_connection [name="bussDbHost"]').val(data.bussDbHost);
            $('#div_flowadd_connection [name="bussDbPort"]').val(data.bussDbPort);
            $('#div_flowadd_connection [name="bussDbName"]').val(data.bussDbName);
            $('#div_flowadd_connection [name="bussDbUserName"]').val(data.bussDbUserName);
            $('#div_flowadd_connection [name="bussDbUserPwd"]').val(data.bussDbUserPwd);
            if(data.bussDbType == 'mysql'){
                $('#div_flowadd_connection select').val('mysql');
            }else if (data.bussDbType == 'oscar'){
                $('#div_flowadd_connection select').val('oscar');
            }
        }});

        $('#tab_flowadd').find('[data-toggle="tab"]:eq(1)').on('show.bs.tab',(e)=>{
            let reqdata = serializeformajax($('#form_flowadd_connection'));
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
                    /*if($('#hidden_flowadd_connection_busstblid').val() != ''){
                        treesection.treeview('selectNode',[$('#hidden_flowadd_connection_busstblid').val(),{silent:true}]);
                    }*/
                }
            });
        });

        $('#input_flowadd_tableselection_search').on('keydown',(e)=>{
            e.stopPropagation();
            if(e.keyCode != 13){
                return;
            }
            let treesection = $('#div_flowadd_tableselection > div');
            let searchcontent = $('#input_flowadd_tableselection_search').val();
            if(searchcontent == ''){
                treesection.treeview(CommonObj.genTreeView(true,this.treedata_tables));
            }

            let result = treesection.treeview('search', [ searchcontent, {
                ignoreCase: true,     // case insensitive
                exactMatch: false,    // like or equals
                revealResults: false,  // reveal matching nodes
            }]);
            if(result.length > 0){
                treesection.treeview(CommonObj.genTreeView(true,result));
            }
        });

        $('#tab_flowadd').find('[data-toggle="tab"]:eq(2)').on('show.bs.tab',(e)=>{
            //alert($('#tab_flowadd').find('[data-toggle="tab"]:eq(2)').length);
            let treesection = $('#div_flowadd_tableselection > div');
            let tableselections = treesection.treeview('getSelected', 0);
            if(tableselections.length == 0){
                alert('先选择业务表！');
                return false;
            }

            let selectedTableName = tableselections[0].text.replace(/\&nbsp\;/g,'');
            $('#hidden_flowadd_connection_busstblid').val( tableselections[0].nodeid);
            $('#hidden_flowadd_connection_busstblname').val(selectedTableName);
            let reqdata = serializeformajax($('#form_flowadd_connection'));

            ajaxreq(adminPath+'/metadata/columns',{
                type:'post',
                contentType:ajax_content_type,
                async:false,
                data:reqdata,
                dataType:'text',
                success:(data)=>{
                    let treedata = JSON.parse(data);
                    let columnsection = $('#div_flowadd_columnselection > div');
                    columnsection.treeview(CommonObj.genTreeView(false,treedata));
                    //treesection.treeview('selectNode',[3,{silent:true}]);
                }
            });
        });
    }
    saveFlow(){
        if(!confirm('确认创建流程？')){
            return;
        }
        let tablename = $('#hidden_flowadd_connection_busstblname').val();
        let columnsection = $('#div_flowadd_columnselection > div');
        let columns = columnsection.treeview('getSelected', 0);
        if(tablename == ''){
            alert('并没有选择业务表！');
            return ;
        }
        if(columns.length == 0){
            alert('并没有选择业务字段范围！');
            return ;
        }
        let flowname = $('#form_flowadd_connection input[name="flowName"]').val();
        if(flowname == ''){
            alert('并没有填写流程名称！');
            return ;
        }
        let columnnamearr = new Array();
        for(let [index,ele] of columns.entries()){
            columnnamearr.push(ele.text.replace(/\&nbsp\;/g,''));
        }

        let oridata = {
            bussTableName:tablename,
            bussColumns:columnnamearr
        }

        let reqdata = serializeformajax($('#form_flowadd_connection'),oridata);
        ajaxreq(adminPath+'/defination/flows',{
            type:'post',
            contentType:ajax_content_type,
            data:reqdata,
            async:false,
            dataType:'text',
            success:(result) =>{
                refreshWin();
            }
        });
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
                            </h4>
                        </div>
                        <div className="modal-body">
                            {/*<form action={adminPath+'/defination/flows'} method={"post"} id={"form_flowadd"}>*/}
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
                                            <form action={adminPath+'/metadata/tables'} method={"post"} id={"form_flowadd_connection"}>
                                                <input type={"hidden"} name={"bussTableName"} id={"hidden_flowadd_connection_busstblname"}/>
                                                <input type={"hidden"}  id={"hidden_flowadd_connection_busstblid"}/>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">* 流程名称</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} name="flowName" className={"form-control"} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">* 数据库类型</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <select name="bussDbType" className={"form-control"}>
                                                            <option value={"mysql"} selected>mysql</option>
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
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">* 模块名称（英）</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} name="moduleName" className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">* 模块名称（中）</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} name="moduleNameCn" className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">* 模块路径</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} name="moduleRootPath" className={"form-control"}/>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>

                                        <div className="tab-pane fade" id="div_flowadd_tableselection">
                                            <input id="input_flowadd_tableselection_search" type={"text"} className={"form-control"} placeholder="搜索表名..."/><br/>
                                            <div className={"overflowy"}></div>
                                        </div>
                                        <div className="tab-pane fade" id="div_flowadd_columnselection">
                                            <div className={"overflowy"}></div>
                                        </div>
                                    </div>


                                </div>
                            {/*</form>*/}
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