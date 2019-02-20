import React,{ Fragment } from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax,CommonObj} from '../common';

class BussAdd extends React.Component{
    constructor(){
        super();
        this.state={
            flows:[],
            firstClick:true,
            trCount:[1]
        };
        this.saveBuss = this.saveBuss.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.addFileAttachTable=this.addFileAttachTable.bind(this);
        this.firstKeyUp=this.firstKeyUp.bind(this);
    }
    componentDidMount(){
        $('#button_bussadd').click(function(){
            $('#modal_bussadd').on('show.bs.modal',function(){
                $('#tab_bussadd').find('[data-toggle="tab"]:eq(1)').click();
                $('#hidden_bussadd_connection_busstblname').val('');
            });
            $('#modal_bussadd').modal('show');

            $('button#addBussColumn').click();
            $('button#addFileAttachTable').click();
        });
        
        ajaxreq(adminPath+'/connectConfig/load',{async:false, success:(data)=>{
                $('#div_flowadd_connection [name="bussDbHost"]').val(data.dataBaseIp);
                $('#div_flowadd_connection [name="bussDbPort"]').val(data.dataBasePort);
                $('#div_flowadd_connection [name="bussDbName"]').val(data.dataBaseName);
                $('#div_flowadd_connection [name="bussDbUserName"]').val(data.dataBaseUserName);
                $('#div_flowadd_connection [name="bussDbUserPwd"]').val(data.dataBasePassword);
                $('#div_flowadd_connection [name="moduleRootPath"]').val(data.modulePath);
                $('#div_flowadd_connection select').val(data.dataBaseType);
        }});

        $('#tab_bussadd').find('[data-toggle="tab"]:eq(1)').on('show.bs.tab',(e)=>{
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
        let columnarr = new Array();
        let attachColumnarr=new Array();
        let nameNotLegitimate = false; // 字段名称是否合法
        let columnRepeat = false; // 字段重复
        $.each( $('#tbl_bussadd_tableselection_tbody [name="columnName"]'),function(index,ele){
            // 获取所有选择timestamp 类型的字段,在(非必要)字段后拼一个_timestamp 标记
            let eleVal = $(ele).val();
            try {
                if($(ele).parent().parent().attr('id').indexOf('trItem') >= 0){
                    if($(ele).parent().parent().find('select[name="columnType"]')[0].value == 'timestamp'){
                        eleVal += '_timestamp';
                    }
                }
            } catch (e) {
            }
            if(eleVal == '' || /^[0-9]+$/.test(eleVal)) {
                nameNotLegitimate = true;
            }
            for (var i = 0; i < columnarr.length; i++) { // 判断字段是否重复
                if(columnarr[i] == eleVal){
                    columnRepeat = true;
                    break;
                }
            }
            columnarr.push(eleVal);
        });
        if (nameNotLegitimate) {
            alert('字段名称不合法儿~');
            return false;
        }
        if (columnRepeat){
            alert('字段名称重复儿~');
            return false;
        }
        $.each( $('#fileAttachTable [name="columnNameAttach"]'),function(index,ele){
            attachColumnarr.push($(ele).val());
        });
        let columntypearr = new Array();
        let lengthNotLegitimate = false; // 长度不合法
        $.each($('#tbl_bussadd_tableselection_tbody [name="columnType"]'),function(index,ele){ // 类型
            let eleval = $(ele).val();
            let columnLength = $(ele).parent().parent().find('input[name="columnLength"]').val();
            let maxLength = $(ele).parent().parent().find('input#maxLength').val();
            let decimalMaxLength = $(ele).parent().parent().find('input#decimalMaxLength').val();
            // 1. maxLength >= decimalMaxLength
            // 2. maxLength <= 65
            // 3. decimalMaxLength <= 30 <=-53
            if ((eleval == 'varchar' && columnLength == '')||    // 字段长度不能为空
              (eleval == 'decimal' && decimalMaxLength == '')||
              (eleval == 'decimal' && maxLength == '')){  // decimal
                lengthNotLegitimate =  true;
            }
            maxLength = parseInt(maxLength);
            decimalMaxLength = parseInt(decimalMaxLength);
            if(!isNaN(parseInt(columnLength)) && eleval == 'varchar') { // 拼接varchar 长度
                eleval += '('+columnLength+')';
            }else if(!isNaN(decimalMaxLength) &&!isNaN(maxLength) && eleval == 'decimal') { // 拼接decimal 长度
                if(maxLength < decimalMaxLength || maxLength >= 65 || decimalMaxLength > 30 ||decimalMaxLength < -53){ // 长度不合法
                    lengthNotLegitimate =  true;
                }
                eleval += '('+maxLength+','+decimalMaxLength+')';
            }
          
            if($(ele).parent().siblings().find('input[type="radio"]').is(':checked')) {
                eleval+=' primary key ';
            }
            columntypearr.push(eleval);
        });
        if (lengthNotLegitimate){
            alert('字段长度不合法儿~');
            return false;
        }
        let attachColumntypearr=new Array();
        $.each($('#fileAttachTable [name="columnTypeAttach"]'),function(index,ele){
            let elevalAttach = $(ele).val();
            if($(ele).parent().siblings().find('input[type="radio"]').is(':checked')) {
                elevalAttach+=' primary key ';
            }
            attachColumntypearr.push(elevalAttach);
        });

        // if(columnarr.length == 0 || columntypearr.length == 0){
        if(columnarr.length != columntypearr.length){
            alert('并没有填写全部数据~');
            return false;
        }
        if(columnarr.length <= 12 || columntypearr.length <= 12){
            alert('并没有添加任何列儿');
            return false;
        }

        var tableName = window.prompt("请输入你的表名 ~","");
        if (tableName == '' || tableName == null) {
            // alert('表名不合法儿~');
            return false;
        }
        $('#form_bussadd_tableselection [name="attachBussTableName"]').val(tableName+'_attach');
        let attachBussTableName=$('#form_bussadd_tableselection [name="attachBussTableName"]').val();
        let oridata = {
            bussTableName:tableName,
            bussColumns:columnarr,
            bussDbHost:$('#div_flowadd_connection [name="bussDbHost"]').val(),
            bussDbPort:$('#div_flowadd_connection [name="bussDbPort"]').val(),
            bussDbName:$('#div_flowadd_connection [name="bussDbName"]').val(),
            bussDbUserName:$('#div_flowadd_connection [name="bussDbUserName"]').val(),
            bussDbUserPwd:$('#div_flowadd_connection [name="bussDbUserPwd"]').val(),
            bussModelPath:$('#div_flowadd_connection [name="moduleRootPath"]').val(),
            bussColumnsType:columntypearr,
            attachBussTableName:attachBussTableName,
            attachBussColumns:attachColumnarr,
            attachBussColumnsType:attachColumntypearr
        }
        let reqdata = serializeformajax($('#form_bussadd_connection'),oridata);
        let { setTableName } = this.props;
        ajaxreq(adminPath+'/metadata/create',{
            type:'post',
            async:false,
            contentType:ajax_content_type,
            data:reqdata,
            dataType:'json',
            success:function(data){
                if(data.charge){
                    alert('成功创建业务表 '+tableName+' ！');
                    $('#modal_bussadd').modal('hide');
                    $('#modal_flowadd').modal('show');
                    // 将刚建好的表名传给父组件
                    setTableName(tableName);
                    // refreshWin();
                }else{
                    alert(data.message);
                    return false;
                }
            }
        });
    }
    firstKeyUp(e){
      e.target.value = e.target.value.replace(/\D/g,'');
    }
    fristDelete(i,e){
        $('#trItem'+i).remove();
    }
    selectOnChange(i,e){
        // 设置字段长度
      if(e.target.value == 'decimal') { // decimal 添加新的框
        $('#trItem'+i+' .columnLength').hide();
        $('#decimalDiv'+i).show();
      }else if (e.target.value != 'varchar') { // 如 int bigint
        $('#trItem'+i+' .columnLength').show();
        $('#trItem'+i+' .columnLength').val('');
        $('#trItem'+i+' .columnLength').attr("readOnly",true);
        $('#decimalDiv'+i).hide();
      }else {
          $('#trItem'+i+' .columnLength').show();
          $('#trItem'+i+' .columnLength').val(255);
          $('#trItem'+i+' .columnLength').attr("readOnly",false);
          $('#decimalDiv'+i).hide();
      }
    }
    addColumn(){
      this.setState((preState) =>{ // preState参数为改变之前的state
        let newList = preState.trCount;
        newList.push(preState.trCount.length+1);
        return{
          trCount:newList
        }
      });
    }
    addFileAttachTable() {
        $("#fileAttachTable").empty();
        let content =
            '<tr>' +
            '<td>附件表字段<span class="glyphicon glyphicon-hand-right"></span></td>' +
            '<td></td>' +
            '<td class="text-center"></td>' +
            '<td class="text-center"></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="id"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="varchar(255)"/></td>' +
            '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselectAttach" value="1" checked> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="file_name"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="varchar(255)"/></td>' +
            // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselectAttach" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="file_realUrl"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="varchar(255)"/></td>' +
            // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselectAttach" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="file_url"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="varchar(255)"/></td>' +
            // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="procInsId"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="varchar(255)"/></td>' +
            // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselectAttach" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="flow_name"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="varchar(255)"/></td>' +
            // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselectAttach" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="create_date"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="timestamp"/></td>' +
            // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselectAttach" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="upload_by"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="varchar(255)"/></td>' +
            // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselectAttach" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td><input type="text" name="columnNameAttach" class="form-control input-sm" value="del_flag"/></td>' +
            '<td><input type="text" name="columnTypeAttach" class="form-control input-sm" value="varchar(255)"/></td>' +
            // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselectAttach" value="1"> 选择</label></div></td>' +
            '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
            '</tr>' +
            '<tr>' +
            '<td>附件表字段<span class="glyphicon glyphicon-hand-left"></span></td>' +
            '<td></td>' +
            '<td class="text-center"></td>' +
            '<td class="text-center"></td>' +
            '</tr>' +
            '<tr>'
        ;
        $('#fileAttachTable').append(content);
    }

        addBussColumn(){
            if(typeof window.tbl_bussadd_tableselection_func_deltr == 'undefined'){
                let delTr = (ele) =>{
                    $(ele).parent().parent().remove();
                };
                window.tbl_bussadd_tableselection_func_deltr = delTr;
            }
            let idexiststag = false;
            let articlesizeexiststag = false;
            let procinsidexiststag = false;

            let createdateexiststag = false;
            let fileNameExiststag=false;
            let fileRealUrlExiststag=false;
            let fileUrlExiststag=false;
            let uploadByExiststag=false;
            let draftDefultUserExistTag=false;
            let defultCreateTimeExistTag=false;
            let titleexiststag=false;
            let remarksExistTag=false;
            let fileTypeExistTag=false;
            let fromUnitExistTag=false;
            
            // 正文必要字段
            let textAddrExiststag=false;
            let textTypeExiststag=false;
            let textContentExiststag=false;
            let textRealurlExiststag=false;
            let wordsCountExiststag=false;

            //转出必要字段
            let documentTypeTag=false;
            let sealUnitNameTag=false;
            let referenceNumTag=false;
            let urgentLevelTag=false;
            
            // 流程类型(收发文标记)
            let flowTypeExiststag=false;
            
            // 总序号
            let TotalSeqExiststag=false;

            $.each($('#tbl_bussadd_tableselection_tbody td input[name="columnName"]'),function(index,ele){
                if($(ele).val() == 'id'){
                    idexiststag = true;
                }
                if($(ele).val() == 'title'){
                    titleexiststag = true;
                }
                if($(ele).val() == 'remarks'){
                    remarksExistTag = true;
                }
                if($(ele).val() == 'file_type'){
                    fileTypeExistTag = true;
                }
                if($(ele).val() == 'from_unit'){
                    fromUnitExistTag = true;
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
                if($(ele).val() == 'defult_user'){
                    draftDefultUserExistTag = true;
                }

                if($(ele).val() == 'defult_create_time'){
                    defultCreateTimeExistTag = true;
                }
                
                if($(ele).val() == 'text_addr'){
                    textAddrExiststag = true;
                }
                if($(ele).val() == 'text_type'){
                    textTypeExiststag = true;
                }
                if($(ele).val() == 'text_content'){
                    textContentExiststag = true;
                }
                if($(ele).val() == 'text_realurl'){
                    textRealurlExiststag = true;
                }
                if($(ele).val() == 'words_count'){
                    wordsCountExiststag = true;
                }
                if($(ele).val() == 'total_seq'){
                    TotalSeqExiststag = true;
                }

                if($(ele).val() == 'document_type'){
                    documentTypeTag = true;
                }
                if($(ele).val() == 'seal_unit_name'){
                    sealUnitNameTag = true;
                }

                if($(ele).val() == 'reference_num'){
                    referenceNumTag = true;
                }

                if($(ele).val() == 'flow_type'){
                    flowTypeExiststag = true;
                }
                
                if($(ele).val() == 'urgent_level'){
                    urgentLevelTag = true;
                }


            });
            if(!idexiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="id"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(36)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                        '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="36" class="form-control input-sm"/>' +
                    '</td>' +
                    '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" checked> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!titleexiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="title"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                        '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="500" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!remarksExistTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="remarks"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                        '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="255" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!fileTypeExistTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="file_type"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                        '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="255" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!fromUnitExistTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="from_unit"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                        '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="255" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!articlesizeexiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="article_size"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(200)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="200" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!procinsidexiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="proc_ins_id"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(100)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="100" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!createdateexiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="create_date"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="timestamp"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="timestamp">timestamp</option>' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!draftDefultUserExistTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="defult_user"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(255)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="255" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!defultCreateTimeExistTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="defult_create_time"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(255)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">    timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="255" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            
            if(!textAddrExiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="text_addr"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(255)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="255" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!textTypeExiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="text_type"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(10)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="10" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!textContentExiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="text_content"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(1000)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="1000" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!textRealurlExiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="text_realurl"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(255)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="255" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!wordsCountExiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="words_count"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(11)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="11" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!TotalSeqExiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="total_seq"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(11)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="int">int</option>' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="11" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }

            if(!documentTypeTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="document_type"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="500" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!sealUnitNameTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="seal_unit_name"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="500" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!referenceNumTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="reference_num"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="500" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!urgentLevelTag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="urgent_level"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="500" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }
            if(!flowTypeExiststag){
                let content = '<tr style="display:none;">' +
                    '<td><input type="text" name="columnName" class="form-control input-sm" value="flow_type"/></td>' +
                    // '<td><input type="text" name="columnType" class="form-control input-sm" value="varchar(500)"/></td>' +
                    '<td>' +
                    '<select class="form-control" name="columnType">' +
                    '<option value ="varchar">varchar</option>' +
                    '<option value ="longtext">longtext</option>' +
                    '<option value ="int">int</option>' +
                    '<option value ="BIGINT">BIGINT</option>' +
                    '<option value ="decimal">decimal</option>' +
                    '<option value ="timestamp">timestamp</option>' +
                    '</select>' +
                    '</td>' +
                    '<td class="text-center">' +
                    '<input type="number" name="columnLength" onkeyup="this.value=this.value.replace(/\\D/g,\'\')" value="1" class="form-control input-sm"/>' +
                    '</td>' +
                    // '<td class="text-center"><div class="radio"><label><input type="radio" name="pkselect" value="1" disabled> 选择</label></div></td>' +
                    '<td class="text-center"><buttron type="button" class="btn btn-danger btn-sm" onclick="(function(){window.tbl_bussadd_tableselection_func_deltr(arguments[0]);})(this)">删 除</buttron></td>' +
                    '</tr>';
                $('#tbl_bussadd_tableselection_tbody').append(content);
            }

        }
        render(){
            return(
                <Fragment>
                    <button style={{display:'none'}} className="btn btn-info btn-group-justified" id="button_bussadd">
                        添 加 业 务 表
                    </button>
                    <div className="modal fade" id="modal_bussadd" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog mediummodal">
                            <div className="modal-content">
                                <div className="modal-header" style={{backgroundColor:'#2083d4'}}>
                                    <button type="button" className="close" data-dismiss="modal"
                                            aria-hidden="true">&times;</button>
                                    <h4 className="modal-title text-danger" id="myModalLabel" style={{color:'#fff',padding:0}}>
                                        + 添 加 业 务 表
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form form-horizontal row container-fluid">
    
                                        <ul style={{display:'none'}} className="nav nav-tabs" id={"tab_bussadd"}>
                                            <li className="active"><a href="#div_bussadd_connection" className={"text-danger"} data-toggle="tab">
                                                <strong> ☞ 第一步：连接信息</strong></a></li>
                                            <li><a href="#div_bussadd_tableselection"  className={"text-danger"} data-toggle="tab">
                                                <strong> ☞ 第二步：填写基本信息</strong></a></li>
                                        </ul>
    
    
                                        <div className="tab-content"  style={{marginTop:'20px'}}>
                                            <div className="tab-pane fade in active" id="div_bussadd_connection">
                                                <form action={adminPath+'/metadata/tables'} method={"post"} id={"form_bussadd_connection"}>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-md-3 text-right">
                                                                <label className="control-label">* 数据库类型</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                {/*<select name="bussDbType" className={"form-control"}>*/}
                                                                    {/*<option value={"mysql"} selected>买涩口</option>*/}
                                                                    {/*<option value={"oscar"}>神通数据库</option>*/}
                                                                {/*</select>*/}
                                                                <input type="text" name="bussDbType" className={"form-control"} value={"oscar"}/>
                                                            </div>
                                                        </div>
    
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-md-3 text-right">
                                                                <label className="control-label">* 数据库主机</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input type="text" name="bussDbHost" className={"form-control"}  />
                                                            </div>
                                                        </div>
    
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-md-3 text-right">
                                                                <label className="control-label">* 数据库端口</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input type={"text"} name="bussDbPort" className={"form-control"}/>
                                                            </div>
                                                        </div>
    
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-md-3 text-right">
                                                                <label className="control-label">* 数据库名称</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input type={"text"} name="bussDbName" className={"form-control"}/>
                                                            </div>
                                                        </div>
    
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-md-3 text-right">
                                                                <label className="control-label">* 用   户</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input type={"text"} name="bussDbUserName" className={"form-control"}/>
                                                            </div>
                                                        </div>
    
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="row">
                                                            <div className="col-md-3 text-right">
                                                                <label className="control-label">* 密   码</label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input type={"password"} name="bussDbUserPwd" className={"form-control"}/>
                                                            </div>
                                                        </div>
    
                                                    </div>
                                                </form>
    
                                            </div>
    
                                            <div className="tab-pane fade" id="div_bussadd_tableselection">
                                                <div className={"overflowy"} >
                                                    <form id={"form_bussadd_tableselection"} method={"post"} action={adminPath+"/metadata/create"}>
                                                        {/*<div className="row" style={{marginRight:0}}>*/}
                                                            {/*<div className={"col-md-3 text-right"}>*/}
                                                                {/*<label className={"control-label"} style={{marginTop:10}}>业务表名称：</label>*/}
                                                                {/*<label className={"control-label"} style={{marginTop:10,display:'none'}}>附件表名称：</label>*/}
                                                            {/*</div>*/}
                                                            {/*<div className={"col-md-8"}>*/}
                                                                {/*<input type={"text"} className={"form-control"} name={"bussTableName"} style={{marginTop:10}}/>*/}
                                                                <input type={"text"} className={"form-control"} name={"attachBussTableName"} placeholder={"tableName_attach"} style={{marginTop:10,display:'none'}}/>
                                                            {/*</div>*/}
                                                        {/*</div>*/}
                                                        <button type={"button"} className={"btn btn-primary pull-right"} id={"addFileAttachTable"} onClick={this.addFileAttachTable} style={{display:'none',marginRight:'20px'}}> <span className="glyphicon glyphicon-plus"></span>&nbsp;添 加 附 件 表</button>
                                                        {/*<button id={"addColumn"} type={"button"} onClick={this.addColumn}  className={"btn btn-primary pull-right"} style={{marginRight:'20px'}}>*/}
                                                            {/*<span className="glyphicon glyphicon-plus"></span>&nbsp;添 加 列*/}
                                                        {/*</button>*/}
                                                        <button type={"button"} onClick={this.addBussColumn} id={'addBussColumn'}  className={"btn btn-info pull-right"} style={{display:'none',marginRight:'20px'}}>
                                                            <span className="glyphicon glyphicon-compressed"></span>&nbsp;添加基础业务字段
                                                        </button>
                                                        <table className={"table table-hover table-bordered clearfix"} id={"tbl_bussadd_tableselection"}>
                                                            <thead>
                                                            <tr>
                                                                <td className={"text-center"} style={{width:'30%'}}><strong>列名</strong></td>
                                                                <td className={"text-center"} style={{width:'30%'}}><strong>类型</strong></td>
                                                                <td className={"text-center"} style={{width:'15%'}}><strong>字段长度</strong></td>
                                                                <td className={"text-center"} style={{width:'15%'}}><strong>操作</strong></td>
                                                            </tr>
                                                            </thead>
                                                            <tbody id={"tbl_bussadd_tableselection_tbody"}>
                                                            {
                                                              this.state.trCount.map((item, i) => {
                                                                return (
                                                                  <tr id={'trItem'+i}>
                                                                    <td><input type="text" name="columnName" className="form-control input-sm"/>
                                                                        <input type={"hidden"} name={"columnName_timestamp"}/></td>
                                                                    <td>
                                                                      <select onChange={this.selectOnChange.bind(this,i)} className="form-control" name="columnType">
                                                                        <option value="varchar">varchar</option>
                                                                        <option value="longtext">longtext</option>
                                                                        <option value="int">int</option>
                                                                        <option value="BIGINT">BIGINT</option>
                                                                        <option value="decimal">decimal</option>
                                                                        <option value="timestamp">timestamp</option>
                                                                      </select>
                                                                    </td>
                                                                    <td className="text-center">
                                                                      <input type="number" name="columnLength" onKeyUp={this.firstKeyUp}
                                                                             defaultValue={"255"} className="form-control input-sm columnLength"/>
                                                                             <div id={'decimalDiv'+i} style={{display:'none'}}>
                                                                               {/*decimal(a,b)
                                                                                  a指定指定小数点左边和右边可以存储的十进制数字的最大个数，最大精度38。
                                                                                  b指定小数点右边可以存储的十进制数字的最大个数。小数位数必须是从 0 到 a之间的值。默认小数位数是 0。*/}
                                                                               <input type={'number'} onKeyUp={this.firstKeyUp} id={'maxLength'} style={{marginRight:'5px',width:'50px'}}/>
                                                                               <input type={'number'} onKeyUp={this.firstKeyUp} id={'decimalMaxLength'} style={{width:'50px'}}/>
                                                                             </div>
                                                                    </td>
                                                                    <td className="text-center">
                                                                      <buttron type="button" className="btn btn-danger btn-sm" onClick={this.fristDelete.bind(this,i)}>删 除</buttron>
                                                                    </td>
                                                                  </tr>
                                                                );
                                                              })
                                                            }
                                                            </tbody>
                                                            <tbody style={{display:'none'}} id={"fileAttachTable"}>
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
                                    <buttron id={"addColumn"} type="button" className="btn btn-success" onClick={this.addColumn}>添 加 列</buttron>&nbsp;
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
    export default BussAdd;