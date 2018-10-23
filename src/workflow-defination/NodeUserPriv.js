import React from 'react';
import ReactDom from 'react-dom';
import {ajaxreq,ajax_content_type,serializeformajax,refreshWin} from '../common';

class NodeUserPriv extends React.Component{
    constructor(){
        super();
        this.state={nodes:[],treedata:[]};
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
            ajaxreq(adminPath+'/nodeuserpriv/'+flowid+'/'+firstnodeid,{async:false,success:(data)=>{
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


            var t = $("#user_tree_"+flowid);
            t = $.fn.zTree.init(t, localsetting, treedata);
            outer.treeobj = t;
            $('#btn_tree_select_all_'+flowid).click(function(){
                outer.treeobj.checkAllNodes(true);
            });
            $('#btn_tree_unselect_all_'+flowid).click(function(){
                outer.treeobj.checkAllNodes(false);
            });

            /*let nodes=outer.treeobj.getCheckedNodes(true);
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].value!='invalid'){
                    alert(nodes[i].value);
                }
            }*/



           this.setState({nodes:nodes,treedata:treedata});
        }
    }
    saveNodeUserPriv(){

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
                <button id={"btn_model_"+flowid} className={"btn btn-primary pull-right marginright-normal "}><span className={"glyphicon glyphicon-pencil"}></span>
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
                                                <select className={"form-control"}>
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