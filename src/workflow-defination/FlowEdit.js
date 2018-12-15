import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax,CommonObj} from '../common';

class FlowEdit extends React.Component{
    constructor(){
        super();
        this.state={flows:[],flowBuss:[],rootNodeName:''};

        this.saveFlow = this.saveFlow.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }
    componentDidMount(){
        let flowid = this.props['flowid'];
        let input = this;
        $('#button_flowEdit_'+flowid).click(function(){
            // 通过 flowid 查询数据
            ajaxreq(adminPath+'/defination/flows/'+flowid,{type:'GET',success:(flowss)=>{
                input.setState({
                    flows: flowss
                });
            }});
            $('#modal_flowEdit_'+flowid).on('show.bs.modal',function(){
                //$('#form_flowadd').find('input').val('');
                $('#tab_flowEdit_'+flowid).find('[data-toggle="tab"]:eq(0)').click();
                $('#hidden_flowEdit_connection_busstblname_'+flowid).val('');
            });
            $('#modal_flowEdit_'+flowid).modal('show');
            $('#modal_flowEdit_'+flowid).on('hidden.bs.modal',function(){
                $("#form_flowEdit_connection_"+flowid)[0].reset();
            });
        });

        ajaxreq(adminPath+'/metadata/defaults',{async:false, success:(data)=>{
            $('#div_flowEdit_connection_'+flowid+' [name="bussDbHost"]').val(data.bussDbHost);
            $('#div_flowEdit_connection_'+flowid+' [name="bussDbPort"]').val(data.bussDbPort);
            $('#div_flowEdit_connection_'+flowid+' [name="bussDbName"]').val(data.bussDbName);
            $('#div_flowEdit_connection_'+flowid+' [name="bussDbUserName"]').val(data.bussDbUserName);
            $('#div_flowEdit_connection_'+flowid+' [name="bussDbUserPwd"]').val(data.bussDbUserPwd);
            $('#div_flowEdit_connection_'+flowid+' [name="moduleRootPath"]').val(data.moduleRootPath);
            if(data.bussDbType == 'mysql'){
                $('#div_flowEdit_connection_'+flowid+' select').val('mysql');
            }else if (data.bussDbType == 'oscar'){
                $('#div_flowEdit_connection_'+flowid+' select').val('oscar');
            }
        }});

        $('#tab_flowEdit_'+flowid).find('[data-toggle="tab"]:eq(1)').on('show.bs.tab',(e)=>{
            if ($('#form_flowEdit_connection_'+flowid+' [name="flowName"]').val() == null || $('#form_flowEdit_connection_'+flowid+'  [name="flowName"]').val() == ''){
                alert('并没有填写流程名称！');
                return false;
            }
            var bussDbHost = $('#form_flowEdit_connection_'+flowid+' [name="bussDbHost"]').val();
            if (bussDbHost == null || bussDbHost == ''){
                alert('并没有填写数据库主机！');
                return false;}
            if ($('#form_flowEdit_connection_'+flowid+' [name="bussDbPort"]').val() == null || $('#form_flowEdit_connection_'+flowid+' [name="bussDbPort"]').val() == ''){
                alert('并没有填写端口号！');
                return false;
            }
            if ($('#form_flowEdit_connection_'+flowid+' [name="bussDbUserName"]').val() == null || $('#form_flowEdit_connection_'+flowid+' [name="bussDbUserName"]').val() == ''){
                alert('并没有填写用户！');
                return false;
            }
            if ($('#form_flowEdit_connection_'+flowid+' [name="bussDbName"]').val() == null || $('#form_flowEdit_connection_'+flowid+' [name="bussDbName"]').val() == ''){
                alert('并没有填写数据库名称！');
                return false;
            }
            if ($('#form_flowEdit_connection_'+flowid+' [name="bussDbUserPwd"]').val() == null || $('#form_flowEdit_connection_'+flowid+' [name="bussDbUserPwd"]').val() == ''){
                alert('并没有填写密码！');
                return false;
            }
            if ($('#form_flowEdit_connection_'+flowid+' [name="moduleName"]').val() == null || $('#form_flowEdit_connection_'+flowid+' [name="moduleName"]').val() == ''){
                alert('并没有填写模块英文名！');
                return false;
            }
            if ($('#form_flowEdit_connection_'+flowid+' [name="moduleNameCn"]').val() == null || $('#form_flowEdit_connection_'+flowid+' [name="moduleNameCn"]').val() == ''){
                alert('并没有填写模块中文名！');
                return false;
            }
            var moduleRootPath = $('#form_flowEdit_connection_'+flowid+' [name="moduleRootPath"]').val();
            if (moduleRootPath == null || moduleRootPath == ''){
                alert('并没有填写模块路径！');
                return false;
            }
            // 判断模块路径是否'/'结尾,若不是则自动添加
            if (moduleRootPath.charAt(moduleRootPath.length-1) != "/"){
                if ( moduleRootPath.charAt(moduleRootPath.length-1) != "\\"){
                    if (moduleRootPath != null || moduleRootPath != ''){
                        $('#form_flowEdit_connection_'+flowid+' [name="moduleRootPath"]').val($('#form_flowEdit_connection_'+flowid+' [name="moduleRootPath"]').val()+'/');
                    }
                }
            }
            let reqdata = serializeformajax($('#form_flowEdit_connection_'+flowid));
            $('#input_flowEdit_tableselection_search_'+flowid).val('');
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
                    let treesection = $('#div_flowEdit_tableselection_'+flowid+' > div');
                    treesection.treeview(CommonObj.genTreeView(true,treedata));
                    // 根据表名,设置默认选中业务表
                    let tableName = $('#bussTableName_'+flowid).val();
                    let columns = treesection.treeview('getEnabled');
                    var rootNodeText = '';
                    for (let i = 1; i < columns.length; i++) {
                        // 此处获取根节点的名字,防止第三步选择根节点
                        rootNodeText = columns[0].text.replace(/\&nbsp\;/g,'');
                        let text = columns[i].text.replace(/\&nbsp\;/g,'');
                        if (tableName == text) {
                            treesection.treeview('selectNode', [i, {silent: true}]);
                        }
                    }
                    this.setState({
                        rootNodeName:rootNodeText
                    });
                    //alert(result.length);
                    /*if($('#hidden_flowadd_connection_busstblid').val() != ''){
                        treesection.treeview('selectNode',[$('#hidden_flowadd_connection_busstblid').val(),{silent:true}]);
                    }*/
                }
            });
            // let height = $($('#input_flowEdit_tableselection_search_'+flowid).nextAll('div.overflowy')).find($('ul.list-group')[0]).width();
            // console.log(height);
        });

        $('#input_flowEdit_tableselection_search_'+flowid).on('keydown',(e)=>{
            e.stopPropagation();
            if(e.keyCode != 13){
                return;
            }
            let treesection = $('#div_flowEdit_tableselection_'+flowid+' > div');
            let searchcontent = $('#input_flowEdit_tableselection_search_'+flowid).val();
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

        $('#tab_flowEdit_'+flowid).find('[data-toggle="tab"]:eq(2)').on('show.bs.tab',(e)=>{
            let treesection = $('#div_flowEdit_tableselection_'+flowid+' > div');
            let tableselections = treesection.treeview('getSelected');
            if(tableselections.length == 0){
                alert('先选择业务表！');
                return false;
            }
            for (let i = 0; i < tableselections.length; i++) {
                if (tableselections[i].nodeId == '0'  && tableselections[i].text.replace(/\&nbsp\;/g,'') == this.state.rootNodeName){
                    alert('不能选择根节点!!!');
                    return false;
                }
            }
            let selectedTableName = tableselections[0].text.replace(/\&nbsp\;/g,''); // 选择的表名
            
            $('#hidden_flowEdit_connection_busstblid_'+flowid).val( tableselections[0].nodeId);
            $('#hidden_flowEdit_connection_busstblname_'+flowid).val(selectedTableName);
            let reqdata = serializeformajax($('#form_flowEdit_connection_'+flowid));
            
            ajaxreq(adminPath+'/defination/flows/findAllByFlowId',{
                type:'post',
                async:false,
                data:{'currentflowid':flowid},
                dataType:'text',
                success:(data)=>{
                    let treedata = JSON.parse(data);
                    this.setState({
                        flowBuss: treedata
                    });
                }
            });

            ajaxreq(adminPath+'/metadata/columns',{
                type:'post',
                contentType:ajax_content_type,
                async:false,
                data:reqdata,
                dataType:'text',
                success:(data)=>{
                    let treedata = JSON.parse(data);
                    let columnsection = $('#div_flowEdit_columnselection_'+flowid+' > div');
                    columnsection.treeview(CommonObj.genTreeView(false,treedata));
                    // 根据表名,设置默认选中业务字段
                    let flowBuss = this.state.flowBuss;
                    
                    let historyTableName = $('#bussTableName_'+flowid).val(); // 历史表名
                    if (selectedTableName == historyTableName) { // 如果选择的表名与历史表名不一致,则不默认选中任何字段
                        let columns = columnsection.treeview('getEnabled');
                        for (let i = 1; i < columns.length; i++) {
                            let text = columns[i].text.replace(/\&nbsp\;/g,'');
                            for (let j = 0; j < flowBuss.length; j++) {
                                if (flowBuss[j].columnName == text) {
                                    columnsection.treeview('selectNode', [i, {silent: true}]);
                                }
                            }
                        }
                    }
                    //treesection.treeview('selectNode',[3,{silent:true}]);
                }
            });
        });
        
    }
    allCheckBoxChange(flowid,e){
        let columnsection = $('#div_flowEdit_columnselection_'+flowid+' > div');
        let columns = columnsection.treeview('getEnabled');
        if (e.target.checked) {
            for (let i = 1; i < columns.length; i++) {
                columnsection.treeview('selectNode', [i, {silent: true}]);
            }
        }else { // 反选(暂时无法反选..)
            let columnssss = columnsection.treeview('getSelected');
            for (let i = 1; i < columnssss.length; i++) {
                columnsection.treeview('toggleNodeChecked', [ columnssss[i].nodeId, { silent: true } ]);
            }
            columnsection.treeview('uncheckAll', { silent: true });
        }
    }
    inputChange(e){
        let attrname = $(e.target).attr('name');
        this.setState({
            flows:{attrname:e.target.value}
        });
    }
    saveFlow(flowid,event){
        let tablename = $('#hidden_flowEdit_connection_busstblname_'+flowid).val();
        let columnsection = $('#div_flowEdit_columnselection_'+flowid+' > div');
        let columns = columnsection.treeview('getSelected', 0);
        if(tablename == ''){
            alert('并没有选择业务表！');
            return ;
        }
        if(columns.length == 0){
            alert('并没有选择业务字段范围！');
            return ;
        }
        let flowname = $('#form_flowEdit_connection_'+flowid+' input[name="flowName"]').val();
        if(flowname == ''){
            alert('并没有填写流程名称！');
            return ;
        }
        if(!confirm('确认修改流程？')){
            return;
        }
        let columnnamearr = new Array();
        for(let [index,ele] of columns.entries()){
            columnnamearr.push(ele.text.replace(/\&nbsp\;/g,''));
        }

        // 业务表必须包含的字段：id title article_size proc_ins_id create_date
        let idtag = false;
        let titletag = false;
        let articlesizetag = false;
        let procinsidtag = false;
        let createdate = false;

        for(let[index,ele] of columnnamearr.entries()){
            if(ele == 'id'){
                idtag = true;
            }
            if(ele == 'title'){
                titletag = true;
            }
            if(ele == 'article_size'){
                articlesizetag = true;
            }
            if(ele == 'proc_ins_id'){
                procinsidtag = true;
            }
            if(ele == 'create_date'){
                createdate = true;
            }
        }
        if(!idtag){alert('没有找到id字段，提交失败');return ;};
        if(!titletag){alert('没有找到标题字段，提交失败');return ;};
        if(!articlesizetag){alert('没有找到文号字段，提交失败');return ;};
        if(!procinsidtag){alert('没有找到流程实例id字段，提交失败');return ;};
        if(!createdate){alert('没有找到创建时间字段，提交失败');return ;};

        let oridata = {
            bussTableName:tablename,
            bussColumns:columnnamearr,
            id:flowid
        }

        let reqdata = serializeformajax($('#form_flowEdit_connection_'+flowid),oridata);
        ajaxreq(adminPath+'/defination/flows',{
            type:'post',
            contentType:ajax_content_type,
            data:reqdata,
            async:false,
            dataType:'text',
            success:(result) =>{
                alert(result);
                refreshWin();
            }
        });
    }
    render(){
        let flowid = this.props['flowid'];
        return(
            <div>
                 <button style={{display:"none"}} className={"btn btn-warning pull-left marginleft-normal"} id={"button_flowEdit_"+flowid}><span className={"glyphicon glyphicon-leaf"}></span>
                        &nbsp;编辑流程</button>
                <div className="modal fade" id={"modal_flowEdit_"+flowid} tabIndex="-1" role="dialog" aria-labelledby={"myModalLabel_"+flowid}
                     aria-hidden="true">
                    <div className="modal-dialog mediummodal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title text-danger" id={"myModalLabel_"+flowid}><span className={"glyphicon glyphicon-pencil"}></span>
                                    &nbsp; 修 改 流 程
                                </h4>
                            </div>
                            <div className="modal-body">
                                {/*<form action={adminPath+'/defination/flows'} method={"post"} id={"form_flowadd"}>*/}
                                    <div className="form form-horizontal row container-fluid">
        
                                        <ul className="nav nav-tabs" id={"tab_flowEdit_"+flowid}>
                                            <li className="active"><a href={"#div_flowEdit_connection_"+flowid} className={"text-danger"} data-toggle="tab">
                                                <strong> ☞ 第一步：连接信息</strong></a></li>
                                            <li><a href={"#div_flowEdit_tableselection_"+flowid}  className={"text-danger"} data-toggle="tab">
                                                <strong> ☞ 第二步：选择业务表</strong></a></li>
                                            <li><a href={"#div_flowEdit_columnselection_"+flowid}  className={"text-danger"} data-toggle="tab">
                                                <strong> ☞ 第三步：确定业务字段范围</strong></a></li>
                                        </ul>
        
        
                                        <div className="tab-content" style={{marginTop:'20px',paddingTop:'20px;'}}>
                                            <div className="tab-pane fade in active" id={"div_flowEdit_connection_"+flowid}>
                                                <form action={adminPath+'/metadata/tables'} method={"post"} id={"form_flowEdit_connection_"+flowid}>
                                                    <input type={"hidden"} name={"bussTableName"} id={"hidden_flowEdit_connection_busstblname_"+flowid}/>
                                                    <input type={"hidden"}  id={"hidden_flowEdit_connection_busstblid_"+flowid}/>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 流程名称</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"text"} name="flowName" onChange={this.inputChange} value={this.state.flows.flowName} className={"form-control"} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 数据库类型</label>
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
                                                            <label className="control-label"><font color="red">*</font> 数据库主机</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type="text" name="bussDbHost" onChange={this.inputChange} value={this.state.flows.bussDbHost} className={"form-control"}  />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 数据库端口</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"text"} name="bussDbPort" onChange={this.inputChange} value={this.state.flows.bussDbPort} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 数据库名称</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"text"} name="bussDbName" onChange={this.inputChange} value={this.state.flows.bussDbName} className={"form-control"}/>
                                                            <input type={"text"} style={{display:'none'}} id={"bussTableName_"+flowid} name={"bussTableName_"+flowid} value={this.state.flows.bussTableName} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 用   户</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"text"} name="bussDbUserName" onChange={this.inputChange} value={this.state.flows.bussDbUserName} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 密   码</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"password"} name="bussDbUserPwd" onChange={this.inputChange} value={this.state.flows.bussDbUserPwd} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 模块名称（英）</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"text"} name="moduleName" onChange={this.inputChange} value={this.state.flows.moduleName} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 模块名称（中）</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"text"} name="moduleNameCn" onChange={this.inputChange} value={this.state.flows.moduleNameCn} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label"><font color="red">*</font> 模块路径</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"text"} name="moduleRootPath" onChange={this.inputChange} value={this.state.flows.moduleRootPath} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="col-lg-2 text-right">
                                                            <label className="control-label">form_key</label>
                                                        </div>
                                                        <div className="col-lg-10">
                                                            <input type={"text"} name="formKey" onChange={this.inputChange} value={this.state.flows.formKey} placeholder={"不确定就不要填写！"} className={"form-control"}/>
                                                        </div>
                                                    </div>
                                                </form>
        
                                            </div>
        
                                            <div className="tab-pane fade" id={"div_flowEdit_tableselection_"+flowid}>
                                                <input id={"input_flowEdit_tableselection_search_"+flowid} type={"text"} className={"form-control"} placeholder="搜索表名..."/><br/>
                                                <div className={"overflowy"}></div>
                                            </div>
                                            <div className="tab-pane fade" id={"div_flowEdit_columnselection_"+flowid}>
                                                全选 : <input onChange={this.allCheckBoxChange.bind(this,flowid)} name={"asdasd"} type="checkbox" /><br/>
                                                <div className={"overflowy"}></div>
                                            </div>
                                        </div>
        
        
                                    </div>
                                {/*</form>*/}
                            </div>
                            <div className="modal-footer">
                                <span className={"text-danger"}><strong> ☞ 第四步：点按钮！ </strong></span>
                                <button type="button" onClick={this.saveFlow.bind(this,flowid)} className="btn btn-primary">提 交</button>&nbsp;
                                <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                            </div>
        
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FlowEdit;