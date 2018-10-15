import React from 'react';
import ReactDom from 'react-dom';

/*
ReactDom.render(
    <h3>Hello,world!This is the first exam</h3>,
    document.getElementById("maincontent")
);*/


const ContainerRender = () =>{
    let now = new Date();
    return(
        <div>
            <span>This is new,now is {now.toLocaleString()}</span>
        </div>
    );
};

const formatDate = (date = new Date()) =>{
    let handleValue = (value) =>{
        return value<10?'0'+value:value;
    };
    let formattedStr = date.getFullYear()+'-'+handleValue(date.getMonth())+'-'+handleValue(date.getDay())+" "
        +handleValue(date.getHours())+':'+handleValue(date.getMinutes())+':'+handleValue(date.getSeconds());
    return(
        formattedStr
    );
};

class ContainerClassRender extends React.Component{
    render(){
        return(
            <div>
                <span>This is container class, now is {formatDate()}</span>
            </div>
        );
    }
}

class CounterBlock extends React.Component{
    constructor(){
        super();
        this.state = {counter:0,name:'最新菜单',createDate:new Date()};
    }
    componentDidMount(){
        alert(1);
    }
    render() {
        let listitems = (counter,name,createDate)=>{
            let renderContent = '';
            let contentarr = new Array();
            for(let i = 0 ;i<5; i++){
                renderContent = (<li className={"list-group-item"}>第{i+1}次,名称：{name},时间：{createDate.toDateString()}</li>);
                contentarr.push(renderContent);
            }
            return contentarr;
        };
        /*var listitems = (<li className={"list-group-item"}>1111</li>);*/
        return (
            <div>
                <ul className={"list-group"}>
                    {listitems(this.state.counter,this.state.name,this.state.createDate)}
                </ul>
            </div>
        );
    }
}

ReactDom.render(<ContainerClassRender/>,document.getElementById('maincontent'));
ReactDom.render(<CounterBlock/>,document.getElementById('counterblock'));