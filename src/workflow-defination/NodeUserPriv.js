import React from 'react';
import ReactDom from 'react-dom';
import {ajaxreq,ajax_content_type,serializeformajax,refreshWin} from '../common';

class NodeUserPriv extends React.Component{
    changeEvent(e){
        console.log(e.target.value);
        let flowid = this.props["flow"].id;
        let nodeId =e.target.value;
      
        //请求后台根据nodeid 查找loginnames;
        //和oncahnge事件 请求同一个后台地址 获取节点对应的loginnames 渲染到tree上
        ajaxreq(adminPath+'/usernodepriv/tree/'+flowid+'/'+nodeId,{type:'GET',success:(data)=>{
                let userloginname = data.loginName;
                let nodetype =data.nodeType;
                var tag=',';
                let userprivdata = [];
                let nodes1 = this.treeobj.getNodes();
                var nodess =  this.treeobj.transformToArray(nodes1);
                this.treeobj.checkAllNodes(false);
                //默认多选
                var v=$(":radio[name='nodeUserPrivType']:checked").val();
                if(userloginname.indexOf("noone")==-1) {
                    if(nodetype.indexOf("multi")!=-1) {
                        //多人情况
                        $('#radio_node_user_priv_sin_' + flowid).attr("checked", false);
                        $('#radio_node_user_priv_mul_' + flowid).attr("checked", "true");
                        if (userloginname.indexOf(tag) != -1) {
                            //   $('#radio_node_user_priv_sin_' + flowid).attr("checked", "false");
                            let users = userloginname.split(",");
                            for (let s = 0; s < users.length; s++) {
                                userprivdata.push(users[s]);
                            }
                        } else {
                            userprivdata.push(userloginname);
                        }
                        for(let j=0;j<nodess.length;j++){
                            // alert(nodess.length);
                            for(let z=0;z<userprivdata.length;z++){
                                if(userprivdata[z] == nodess[j].value){
                                    this.treeobj.checkNode(nodess[j],true,true);
                                    break;
                                }
                            }
                        }
                    }else if(nodetype.indexOf("single")!=-1){
                        //单选框
                        $('#radio_node_user_priv_mul_' + flowid).attr("checked", false);
                        $('#radio_node_user_priv_sin_' + flowid).attr("checked", "true");
                        userprivdata.push(userloginname);
                        for(let j=0;j<nodess.length;j++){
                            // alert(nodess.length);
                            for(let z=0;z<userprivdata.length;z++){
                                if(userprivdata[z] == nodess[j].value){
                                    this.treeobj.checkNode(nodess[j],true,true);
                                    break;
                                }
                            }
                        }
                    }else{
                        $('#radio_node_user_priv_sin_' + flowid).attr("checked", false);
                        $('#radio_node_user_priv_mul_'+flowid).attr("checked",false);
                    }

                }else{
                    $('#radio_node_user_priv_sin_' + flowid).attr("checked", false);
                    $('#radio_node_user_priv_mul_'+flowid).attr("checked",false);
                }


            }});

    }
    constructor(){
        super();
        this.state={nodes:[],treedata:[]};
        this.saveNodeUserPriv = this.saveNodeUserPriv.bind(this);
        this.treerealdata = this.treerealdata.bind(this);
       
        
    }
    componentDidMount(){
        let flowid=this.props["flow"].id;
        let outer = this;
        $('#btn_model_'+flowid).click(function(){
            $('#modal_userpriv_'+flowid).modal('show');
        });
        let nodes = new Array();
        let treedata = null;
        ajaxreq(adminPath+'/defination/flows/'+flowid+'/nodes',{async:false,success:(data)=>{
            nodes=data;
        }});

        if(nodes.length >0){
            let firstnodeid = nodes[0].id;
            ajaxreq(adminPath+'/usernodepriv/'+flowid+'/'+firstnodeid,{async:false,success:(data)=>{
                    treedata=data;
            }});

           let  localsetting = {
                view:{
                    selectedMulti:false,
                    dblClickExpand:false,
                    showLine: true,
                    fontCss:{'color':'pink','font-weight':'bold'}
                },
                check:{
                    enable:true,
                    nocheckInherit:true,
                    chkStyle: "checkbox"
                },
                data:{
                    simpleData:{enable:true,
                        idKey: "id",
                        pIdKey: "parentId",
                        rootPId: "-1"
                 }},
                callback:{
                   beforeClick: function(treeId, treeNode) {
                       let zTree = outer.treeobj;
                       if (treeNode.isParent) {
                           zTree.expandNode(treeNode);//如果是父节点，则展开该节点
                       }else{
                           zTree.checkNode(treeNode, !treeNode.checked, true, true);//单击勾选，再次单击取消勾选
                       }
                   }
               }
           };
           
           //ztree 初始化
            var t = $("#user_tree_"+flowid);
            t = $.fn.zTree.init(t, localsetting, treedata);

            outer.treeobj = t;
            $('#btn_tree_select_all_'+flowid).click(function(){
                outer.treeobj.checkAllNodes(true);
            });
            $('#btn_tree_unselect_all_'+flowid).click(function(){
                outer.treeobj.checkAllNodes(false);
            });

           this.setState({nodes:nodes,treedata:treedata});
        }
    }


  
 
    //add by ym
    treerealdata(){
        let flowid = this.props["flow"].id;
        let nodeId =$('#select_user_priv_node_'+flowid).val();
       //请求后台根据nodeid 查找loginnames;
        //和oncahnge事件 请求同一个后台地址 获取节点对应的loginnames 渲染到tree上
        ajaxreq(adminPath+'/usernodepriv/tree/'+flowid+'/'+nodeId,{type:'GET',success:(data)=>{
            let userloginname = data.loginName;
            var tag=',';
            let userprivdata = [];
            let nodetype =data.nodeType;
            let nodes1 = this.treeobj.getNodes();
            var nodess =  this.treeobj.transformToArray(nodes1);
            if(userloginname.indexOf("noone")==-1) {
                if(nodetype.indexOf("multi")!=-1) {
                    //多人情况
                    $('#radio_node_user_priv_mul_' + flowid).attr("checked", "true");
                    if (userloginname.indexOf(tag) != -1) {
                        let users = userloginname.split(",");
                        for (let s = 0; s < users.length; s++) {
                            userprivdata.push(users[s]);
                        }
                    } else {
                        //多选下的一人情况
                        userprivdata.push(userloginname);
                    }
                    for(let j=0;j<nodess.length;j++){
                        for(let z=0;z<userprivdata.length;z++){
                            if(userprivdata[z] == nodess[j].value){
                                this.treeobj.checkNode(nodess[j],true,true);
                                break;
                            }
                        }
                    }
                }else if(nodetype.indexOf("single")!=-1){
                    //单选框
                    $('#radio_node_user_priv_sin_' + flowid).attr("checked", "true");
                    userprivdata.push(userloginname);
                    for(let j=0;j<nodess.length;j++){
                        for(let z=0;z<userprivdata.length;z++){
                            if(userprivdata[z] == nodess[j].value){
                                this.treeobj.checkNode(nodess[j],true,true);
                                break;
                            }
                        }
                    }
                }else{
                    $('#radio_node_user_priv_sin_' + flowid).attr("checked", false);
                    $('#radio_node_user_priv_mul_' + flowid).attr("checked", false);
                }
               
            }else{
                $('#radio_node_user_priv_sin_' + flowid).attr("checked", false);
                $('#radio_node_user_priv_mul_'+flowid).attr("checked",false);
            }
  
                 
            }});
    }
   
    saveNodeUserPriv(){
        let flowid = this.props["flow"].id;
        let nodes = this.treeobj.getCheckedNodes(true);
        let loginNames = new Array();
        for(var i=0;i<nodes.length;i++){
            if(nodes[i].value!='invalid'){
                loginNames.push(nodes[i].value);
            }
        }

        let userprivdata = [];
        let nodes1 = this.treeobj.getNodes();
        if(typeof nodes1 != 'undefined'){
            for(let j=0;j<nodes1.length;j++){
                for(let z=0;z<userprivdata.length;z++){
                    if(userprivdata[z].value == nodes1[j].value){
                        ztree.checkNode(node1[j],true,true);
                        break;
                    }
                }
            }
        }


        let nodeType= '';
        if($('#radio_node_user_priv_sin_'+flowid).is(':checked')){
            nodeType = 'single';
        }
        if($('#radio_node_user_priv_mul_'+flowid).is(':checked')){
            nodeType = 'multi';
        }
        let oridata = {
            flowId:flowid,
            nodeId:$('#select_user_priv_node_'+flowid).val(),
            nodeType:nodeType,
            loginNames:loginNames
        };
        $('body').mLoading({
            text: "加载中",//加载文字，默认值：加载中...
            html: false,//设置加载内容是否是html格式，默认值是false
            mask: true//是否显示遮罩效果，默认显示
        });
        ajaxreq(adminPath+'/usernodepriv',{type:'post',async:false,contentType:ajax_content_type,data:JSON.stringify(oridata),
            dataType:'text',success:(data)=>{
                if(data!='success'){
                    alert(data);
                }else{
                    alert('保存成功！');
                }
            }});
    }
    render(){
        let flowid=this.props["flow"].id;
        let nodeselectarr = new Array();
        let nodeselectcontent = '没有数据节点';
        if(this.state.nodes.length > 0){
            let allnodes = this.state.nodes;
           for(let [index,node] of allnodes.entries()){
                nodeselectcontent = (
                    <option value={node.id}>{node.name}</option>
                )
                nodeselectarr.push(nodeselectcontent);
            }
        }
        return(
            <div>
                <button onClick={this.treerealdata} id={"btn_model_"+flowid}  style={{display:"none"}}  className={"btn btn-primary pull-right marginright-normal "}><span className={"glyphicon glyphicon-pencil"}></span>
                    &nbsp;修改数据权限</button>
                <div className="modal fade" id={"modal_userpriv_"+flowid} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog mediummodal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title text-success" id="myModalLabel">
                                    <b>+ 修改数据权限</b>
                                </h4>
                            </div>
                            <div className="modal-body">
                                <div className="form form-horizontal row container-fluid">

                                    <form id={"form_nodeuserpriv_"+this.props["flow"].id}>
                                        <div className="form-group">
                                            <div className="col-lg-5 text-center">
                                                <select className={"form-control"}  onChange={(e)=>this.changeEvent(e)} id={"select_user_priv_node_"+this.props["flow"].id}>
                                                    {nodeselectarr}
                                                </select>
                                                <br/><br/>
                                                <div >
                                                    <input type={"radio"} id={"radio_node_user_priv_sin_"+this.props["flow"].id} name={"nodeUserPrivType"} value={"single"}/>
                                                        <label for={"radio_node_user_priv_sin_"+this.props["flow"].id}> &nbsp;&nbsp;单选</label> &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <input type={"radio"} id={"radio_node_user_priv_mul_"+this.props["flow"].id} name={"nodeUserPrivType"} value={"multi"}/>
                                                        <label for={"radio_node_user_priv_mul_"+this.props["flow"].id}>&nbsp;&nbsp;多选</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-5">
                                                &nbsp;&nbsp;
                                                <button type={"button"} id={"btn_tree_select_all_"+flowid} className={"btn btn-primary"}> 全 选 </button>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <button type={"button"} id={"btn_tree_unselect_all_"+flowid} className={"btn btn-danger"}> 反 选 </button>
                                                <br/>
                                                <div className="zTreeDemoBackground left" style={{maxHeight:'600px',overflowY:'auto'}}>
                                                    <ul id={"user_tree_"+this.props["flow"].id} className="ztree"></ul>
                                                </div>
                                            </div>
                                        </div>
                                    </form>


                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.saveNodeUserPriv} className="btn btn-primary">提 交</button>&nbsp;
                                <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NodeUserPriv;