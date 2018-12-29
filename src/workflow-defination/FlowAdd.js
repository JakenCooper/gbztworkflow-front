import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax,CommonObj} from '../common';

class FlowAdd extends React.Component{
    constructor(){
        super();
        this.state={flows:[],rootNodeText:'',attachTableList:[]};
        this.saveFlow = this.saveFlow.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }
    componentDidMount(){
        $('#button_flowadd').click(function(){
            $('#modal_flowadd').on('show.bs.modal',function(){
                //$('#form_flowadd').find('input').val('');
                $('#tab_flowadd').find('[data-toggle="tab"]:eq(0)').click();
                $('#hidden_flowadd_connection_busstblname').val('');
            });
            $('#modal_flowadd').modal('show');
            $('#modal_flowadd').on('hidden.bs.modal',function(){
                $("#form_flowadd_connection")[0].reset();
            });
        });

        ajaxreq(adminPath+'/metadata/defaults',{async:false, success:(data)=>{
            $('#div_flowadd_connection [name="bussDbHost"]').val(data.bussDbHost);
            $('#div_flowadd_connection [name="bussDbPort"]').val(data.bussDbPort);
            $('#div_flowadd_connection [name="bussDbName"]').val(data.bussDbName);
            $('#div_flowadd_connection [name="bussDbUserName"]').val(data.bussDbUserName);
            $('#div_flowadd_connection [name="bussDbUserPwd"]').val(data.bussDbUserPwd);
            $('#div_flowadd_connection [name="moduleRootPath"]').val(data.moduleRootPath);
            if(data.bussDbType == 'mysql'){
                $('#div_flowadd_connection select').val('mysql');
            }else if (data.bussDbType == 'oscar'){
                $('#div_flowadd_connection select').val('oscar');
            }
        }});
        let reqdata = serializeformajax($('#form_flowadd_connection'));
        ajaxreq(adminPath+'/metadata/tables',{
            type:'post',
            contentType:ajax_content_type,
            async:false,
            data:reqdata,
            dataType:'text',
            success:(data)=>{
                let treedata = JSON.parse(data);
                let tbArray=new Array();
                let endWith="attach";
                for(var i=0;i<treedata[0].nodes.length;i++){
                    let n=treedata[0].nodes[i].text.search(endWith);
                    if(n!=-1){
                        tbArray.push(treedata[0].nodes[i].text);
                    }
                }
                this.setState({
                    attachTableList:tbArray
                })
            }
        });

        $('#tab_flowadd').find('[data-toggle="tab"]:eq(1)').on('show.bs.tab',(e)=>{
            if ($('#form_flowadd_connection #flowName').val() == null || $('#form_flowadd_connection #flowName').val() == ''){
                alert('并没有填写流程名称！');
                return false;
            }
            var bussDbHost = $('#form_flowadd_connection [name="bussDbHost"]').val();
            if (bussDbHost == null || bussDbHost == ''){
                alert('并没有填写数据库主机！');
                return false;}
            // } else if (bussDbHost.match(exp)){
            //     alert('Ip地址不合法哦~');
            //     return false;
            // } 
            if ($('#form_flowadd_connection [name="bussDbPort"]').val() == null || $('#form_flowadd_connection [name="bussDbPort"]').val() == ''){
                alert('并没有填写端口号！');
                return false;
            } 
            if ($('#form_flowadd_connection [name="bussDbUserName"]').val() == null || $('#form_flowadd_connection [name="bussDbUserName"]').val() == ''){
                alert('并没有填写用户！');
                return false;
            } 
            if ($('#form_flowadd_connection [name="bussDbName"]').val() == null || $('#form_flowadd_connection [name="bussDbName"]').val() == ''){
                alert('并没有填写数据库名称！');
                return false;
            } 
            if ($('#form_flowadd_connection [name="bussDbUserPwd"]').val() == null || $('#form_flowadd_connection [name="bussDbUserPwd"]').val() == ''){
                alert('并没有填写密码！');
                return false;
            }
            if ($('#form_flowadd_connection [name="moduleName"]').val() == null || $('#form_flowadd_connection [name="moduleName"]').val() == ''){
                alert('并没有填写模块英文名！');
                return false;
            }
            if ($('#form_flowadd_connection [name="moduleNameCn"]').val() == null || $('#form_flowadd_connection [name="moduleNameCn"]').val() == ''){
                alert('并没有填写模块中文名！');
                return false;
            }
            var moduleRootPath = $('#form_flowadd_connection [name="moduleRootPath"]').val();
            if (moduleRootPath == null || moduleRootPath == ''){
                alert('并没有填写模块路径！');
                return false;
            }
            // 判断模块路径是否以'/'结尾,若不是则自动添加
            if (moduleRootPath.charAt(moduleRootPath.length-1) != "/"){
                if (moduleRootPath.charAt(moduleRootPath.length-1) != "\\"){
                    if (moduleRootPath != null || moduleRootPath != ''){
                        $('#form_flowadd_connection [name="moduleRootPath"]').val($('#form_flowadd_connection [name="moduleRootPath"]').val()+'/');
                    }
                } 
            }
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
                    let columns = treesection.treeview('getEnabled');
                    for (let i = 0; i < columns.length; i++) {
                        if (i<1){
                            let text = columns[i].text.replace(/\&nbsp\;/g,'');
                            this.setState({
                                rootNodeText:text
                            })
                            return
                        } 
                    }
                    // treesection.treeview('disableNode', [ 0, { silent: true } ]);
                    // $('#tree').treeview('revealNode', [ 0, { silent: true } ]);
                    // treesection.treeview('expandAll', { levels: 2, silent: true });
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
            let tableselections = treesection.treeview('getSelected');
            if(tableselections.length == 0){
                alert('先选择业务表！');
                return false;
            }
            for (let i = 0; i < tableselections.length; i++) {
                let text = tableselections[i].text.replace(/\&nbsp\;/g,'');
                if (text == this.state.rootNodeText){
                    alert('不能选择根节点!!!');
                    return false;
                }
            }
            let selectedTableName = tableselections[0].text.replace(/\&nbsp\;/g,'');
            $('#hidden_flowadd_connection_busstblid').val( tableselections[0].nodeId);
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
                    let columns = columnsection.treeview('getEnabled');
                    for (let i = 0; i < columns.length; i++) {
                        if (i<1){
                            let text = columns[i].text.replace(/\&nbsp\;/g,'');
                            this.setState({
                                rootNodeText:text
                            })
                            return
                        }
                    }
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
        for (let i = 0; i < columns.length; i++) {
            let text = columns[i].text.replace(/\&nbsp\;/g,'');
            if (text == this.state.rootNodeText){
                alert('不能选择根节点!!!');
                return false;
            }
        }
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
        var attachTableName=$("#attachTableName option:selected").text();
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
    allCheckBoxChange(e){ // 全选
        let columnsection = $('#div_flowadd_columnselection > div');
        let columns = columnsection.treeview('getEnabled');
        if (e.target.checked) {
            for (let i = 1; i < columns.length; i++) {
                columnsection.treeview('selectNode', [i, {silent: true}]);
            }
        }else { // 反选(暂时无法反选..)
            let columnssss = columnsection.treeview('getSelected');
            for (let i = 1; i < columnssss.length; i++) {
                console.log(columnssss[i].nodeId);
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
    render(){
        return(
            <div className="modal fade" id="modal_flowadd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog mediummodal">
                    <div className="modal-content">
                        <div className="modal-header" style={{backgroundColor:'#2083d4'}}>
                            <button type="button" className="close" data-dismiss="modal"
                                    aria-hidden="true">&times;</button>
                            <h4 className="modal-title text-danger" id="myModalLabel" style={{color:'#fff'}}>
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
                                                        <label className="control-label"><font color="red">*</font> 流程名称</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} id={"flowName"} value={this.state.flows.flowName} onChange={this.inputChange} name="flowName" className={"form-control"} />
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
                                                        <input type="text" value={this.state.flows.bussDbHost} onChange={this.inputChange} name="bussDbHost" className={"form-control"}  />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label"><font color="red">*</font> 数据库端口</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} value={this.state.flows.bussDbPort} onChange={this.inputChange} name="bussDbPort" className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label"><font color="red">*</font> 数据库名称</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} value={this.state.flows.bussDbName} onChange={this.inputChange} name="bussDbName" className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label"><font color="red">*</font> 用   户</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} value={this.state.flows.bussDbUserName} onChange={this.inputChange} name="bussDbUserName" className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label"><font color="red">*</font> 密   码</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"password"} value={this.state.flows.bussDbUserPwd} onChange={this.inputChange} name="bussDbUserPwd" className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label"><font color="red">*</font> 模块名称（英）</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} value={this.state.flows.moduleName} onChange={this.inputChange} name="moduleName" className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label"><font color="red">*</font> 模块名称（中）</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} value={this.state.flows.moduleNameCn} onChange={this.inputChange} name="moduleNameCn" className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label"><font color="red">*</font> 模块路径</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} value={this.state.flows.moduleRootPath} onChange={this.inputChange} name="moduleRootPath" placeholder={"填写文件生成路径"} className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">form_key</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <input type={"text"} value={this.state.flows.formKey} name="formKey" onChange={this.inputChange} placeholder={"不确定就不要填写！"} className={"form-control"}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="col-lg-2 text-right">
                                                        <label className="control-label">附件表</label>
                                                    </div>
                                                    <div className="col-lg-10">
                                                        <select  name="attachfileTableName" className={"form-control"} id={"attachTableName"}>
                                                            {
                                                                this.state.attachTableList.map((item, i) => {
                                                                    return (
                                                                        <option key={i} value={item.replace(/\&nbsp\;/g,'')}>
                                                                            {item.replace(/\&nbsp\;/g,'')}
                                                                        </option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>

                                        <div className="tab-pane fade" id="div_flowadd_tableselection">
                                            <input id="input_flowadd_tableselection_search" type={"text"} className={"form-control"} placeholder="搜索表名..."/><br/>
                                            <div className={"overflowy"}></div>
                                        </div>
                                        <div className="tab-pane fade" id="div_flowadd_columnselection">
                                            全选 : <input onChange={this.allCheckBoxChange.bind(this)} name={"asdasd"} type="checkBox" /><br/>
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