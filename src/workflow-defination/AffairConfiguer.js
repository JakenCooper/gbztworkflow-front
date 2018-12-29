import React from 'react';
import ReactDom from 'react-dom';
import {refreshWin,ajaxreq,ajax_content_type,serializeformajax} from '../common';

class AffairConfiguer extends React.Component{
    constructor(){
        super();
        this.state={
            List:[]
        }
        this.handleSumit=this.handleSumit.bind(this);

    }

    componentDidMount(){
        let flowId = this.props['flow'].id;
        $('#btn_affairConfiguer_'+flowId).click(function(){
            $('#affairConfiguer_'+flowId).modal('show');
        });
        this.refresh()
    }
    changeValue(index,e){
        let inputValue = e.target.value;
        this.setState((preState) =>{ // preState参数为改变之前的state
            let list = [...preState.List];
            list[index].chColName = inputValue;
            return{
                List:list
            }
        },() =>{ // setState的箭头回调函数
            console.log(this.state.inputValue);
        });
    }
  
  
  
  
    handleSumit(){
        let flowId = this.props['flow'].id;
        var args = {};
        $("#affairConfiguerTable"+this.props['flow'].id+" tr:gt(0)").each(function(i){

            var data = new Object();
            $(this).find("select[jsonName],input[jsonName]").each(function(){
                var name = $(this).attr("jsonName");
                data[name]= $(this).val();
            });
            args[i]=data;
        });
        var affairConfiguers=JSON.stringify(args);
        let nodeobj = this.props['node'];
        $.ajax({
            type:'post',
            url:adminPath+'/affairConfiguer/update',
            dataType:'json',
            data:{"affairConfiguers":affairConfiguers},
            success:function(data){
                if(data){
                    alert("事务查询配置成功");
                    $('#affairConfiguer_'+flowId).modal('hide');
                }else{
                    alert("配置失败");
                }

            }
        });
    }
    refresh(){
        let flowId = this.props["flow"].id;
        let afrInfo=this;
        $.ajax({
            type:'post',
            url:adminPath+'/affairConfiguer/'+flowId+'/list',
            dataType:'json',
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success:function(data){
                afrInfo.setState({List:data});
            }
        });
    }
    render(){
        let tableInfo=new Array();
        let tableContent=null;
        const option=["模糊查询","精确查询","左匹配","右匹配"];
        const isUsed=["禁用","启用"];
        for(let [index,affairConfiguer] of this.state.List.entries()){
        tableContent =(
            <tr className={"active"}>
                <td className={"vertial-center"} style={{display:'none'}}>{affairConfiguer.id}   <input type={"hidden"} name={"id"} value={affairConfiguer.id} jsonName="id"/></td>
                <td className={"vertial-center"} >{affairConfiguer.colName} <input type={"hidden"} name={"colName"} value={affairConfiguer.colName} jsonName="colName"/></td>
                <td className={"vertial-center"}>

                    <input type={"text"} className={"form-control"} value={affairConfiguer.chColName} jsonName="chColName" onChange={this.changeValue.bind(this,index)}/>
                </td>
                <td className={"vertial-center"}>
                    <select className={"form-control input-sm"}  jsonName="searchType">
                        {
                            option.map((item, i) => {
                                return (
                                    <option key={item.id}   selected= {affairConfiguer.searchType===item?"selected":""}>
                                        {item}
                                    </option>
                                );
                            })
                        }
                    </select>
                </td>
                <td className={"vertial-center"}>
                    <select className={"form-control input-sm isUsed"} jsonName="isUsed">
                        {
                            isUsed.map((item, i) => {
                                return (
                                    <option key={item.id}   selected= {affairConfiguer.isUsed===item?"selected":""}>
                                        {item}
                                    </option>
                                );
                            })
                        }
                    </select>
                </td>
            </tr>
        );


            tableInfo.push(tableContent);
        }

        return(
            <div>
                <button className={"btn btn-success "} style={{display:"none"}} id={"btn_affairConfiguer_"+this.props["flow"].id}><span className="glyphicon glyphicon-wrench"></span>
                   事务查询配置</button>
                <div className="modal fade" id={"affairConfiguer_"+this.props["flow"].id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog " style={{width:1100}} >
                        <div className="modal-content">
                            <div className="modal-header" style={{backgroundColor:'#2083d4'}}>
                                <button type="button" className="close" data-dismiss="modal"
                                        aria-hidden="true">&times;</button>
                                <h4 className="modal-title" id="label_nodeadd" style={{color:'#fff'}}>
                                    + 事务查询配置
                                </h4>
                            </div>
                            <div className="modal-body overflowy">
                                <form action={adminPath+'/affairConfiguer/update'} method={"post"} id={"affairConfiguerForm"+this.props['flow'].id}>
                                    <input type={"hidden"} name={"flowId"} value={this.props["flow"].id}/>
                                    <table className={"table table-hover"} id={"affairConfiguerTable"+this.props['flow'].id}>

                                        <thead className={"bg-info text-lg"}>
                                        <tr>
                                            <td style={{width:'10%',display:'none'}}><strong>id</strong></td>
                                            <td style={{width:'10%'}}><strong>字段名称</strong></td>
                                            <td style={{width:'20%'}}><strong>字段说明</strong></td>
                                            <td style={{width:'20%'}}><strong>查询类型</strong></td>
                                            <td style={{width:'20%'}}><strong>是否启用</strong></td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tableInfo}
                                        </tbody>

                                    </table>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button"  className="btn btn-primary" onClick={this.handleSumit} id={"btn"+this.props['flow'].id}>提 交</button>&nbsp;
                                <button type="button" className="btn btn-warning" data-dismiss="modal">关 闭</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AffairConfiguer;