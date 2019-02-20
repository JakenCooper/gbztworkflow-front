const ajax_content_type = 'application/json;charset=UTF-8';

const ajaxreqerrorhandle  = (xhr,textStatus,errorThrown) =>{
    var code = xhr.status;
    let info = '';
    if(code == 400){
        info = '请求参数错误';
    }else if(code ==401 || code == 403){
        info = '权限验证失败';
    }else if(code == 404){
        info = '找不到对应的资源！';
    }else if(code == 405){
        info = '请求方式错误';
    }else if(code == 409){
        info = '资源已被锁定，请再次请求';
    }else if(code == 500){
        info = '服务器内部错误';
    }else if(code == 502){
        info = '网关错误';
    }else if(code == 0){
        info = '未知错误，请检查错误日志';
    }else{
        info = '请求成功或者忽略，code === '+code;
    }
    console.log(info);
    if(alert_tag && info.indexOf('code') == -1){
        console.log("------------------- 真的未知错误！。。。。"+info);
        //alert(info);
    }
};

const ajaxreqcomp =() =>{
    $('body').mLoading('hide');
};

const ajaxreq = (url,{type='get',async=true,contentType='application/x-www-form-urlencoded;charset=UTF-8',
data={},dataType='json',xhrFields={withCredentials: true},success=function(){},error=ajaxreqerrorhandle
    ,complete=ajaxreqcomp}={}) => {
    //$('body').mLoading('show');
    console.log('=========  准备请求url：：：： '+url);
    $.ajax({
        url:url,
        type:type,
        async:async,
        contentType:contentType,
        data:data,
        dataType:dataType,
        xhrFields:xhrFields,
        success:success,
        error:error,
        complete:complete
    });
};

// ele can be any jquery obj
const serializeformajax = (ele,data={}) => {
    let formdata = ele.serializeArray();
    let obj = {};
    $.each(formdata,function(i,v){
        obj[v.name] = v.value;
    });
    Object.assign(obj,data);
    return JSON.stringify(obj);
}

// 刷新的时候传个FlowId 则在刷新完毕之后,自动跳转至对应流程. 
const refreshWin = (flowId) =>{
    console.log(!typeof(flowId) == undefined || null != flowId || '' != flowId);
    if (!typeof(flowId) == undefined || null != flowId || '' != flowId) {
        window.location.reload();
        localStorage.setItem('flowId',flowId);
    }else {
        window.location.reload();
        localStorage.setItem('flowId',null);
    }
};

const CommonObj ={
    genTreeView : (singleselect,data)=>{
        return {data:data,multiSelect : singleselect?false:true,
            showCheckbox : false,
            selectedBackColor:'#1abc9c',selectedColor:'#000000',showIcon:false};
    }
};



export {ajaxreq,ajax_content_type,serializeformajax,refreshWin,CommonObj};