import React,{ Component,Fragment } from 'react';
import {ajax_content_type, ajaxreq, refreshWin} from "../common";

class UploadFlowTemplate extends React.Component{
    constructor(){
        super();
        this.state={
            uploadedTemplate:true // 是否已经上传模板
        };
        this.startUpload = this.startUpload.bind(this);
        this.clickButton = this.clickButton.bind(this);
    }
    clickButton(){
        let { flowId } = this.props; // 获取父组件传过来的流程实例id
        $("#wordTemplateFiles_"+flowId).click();
    }
    componentDidMount() {
        let { flowId } = this.props; // 获取父组件传过来的流程实例id
        // 判断是否已经上传模板
        ajaxreq(adminPath+'/flowWordTemplet/uploadedTemplate/'+flowId,{type:'GET',async:false,success:(data)=>{
            this.setState({
                uploadedTemplate:data
            });
        }});
    }

    startUpload(){
        $('body').mLoading({
            text: "加载中",//加载文字，默认值：加载中...
            html: false,//设置加载内容是否是html格式，默认值是false
            mask: true//是否显示遮罩效果，默认显示
        });
        let { flowId } = this.props; // 获取父组件传过来的流程实例id
        //获取读取我文件的File对象
        var formData = new FormData(); // FormData 对象
        formData.append("files",$("#wordTemplateFiles_"+flowId)[0].files[0]);
        formData.append("flowId",flowId);
        $.ajax({
            type:"POST",
            url: adminPath+'/flowWordTemplet/upload',
            async: false,
            cache: false,
            // dataType:'json',
            processData:false,
            mimeType:"multipart/form-data",
            contentType: false, //不设置内容类型
            data:formData,
            success: function(result) {
                if (result == 'success') {
                    alert('文件上传成功!');
                    refreshWin(flowId);
                } else {
                    alert('文件上传失败.');
                }
            },
            error:function (result) {
                if (result.responseText == 'fileType') {
                    alert('上传文件类型仅支持"doc"、"docx"。');
                }
                return null;
            }
        });
    }
    render() {
        let { flowId } = this.props; // 获取父组件传过来的流程实例id
        return(
            <Fragment>
                <a onClick={this.clickButton} style={{lineHeight:"35px"}} href="#">
                    {/*还没有上传过word模板的显示红色*/}
                    <font style={{display:this.state.uploadedTemplate?"none":"block"}} title={"点击上传word模板"} color="red"><span className="glyphicon glyphicon-upload"></span>
                    &nbsp;暂未上传Word模板</font>
                    {/*已经上传过word模板的显示绿色*/}
                    <font style={{display:this.state.uploadedTemplate?"block":"none"}} title={"点击修改word模板"} color="green"><span className="glyphicon glyphicon-upload"></span>
                    &nbsp;已上传过Word模板</font>
                </a>
                <input id={"wordTemplateFiles_"+flowId} onChange={this.startUpload} style={{display:"none"}} type={"file"}/>
            </Fragment>
        )
    }
}

export default UploadFlowTemplate;