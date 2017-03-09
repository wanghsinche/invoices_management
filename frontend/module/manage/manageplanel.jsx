import React from 'react';
import {Link} from 'react-router';

class Manage extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			items : [],
			pagenum : 1,
			pagecurrent : 1,
			from : 0,
			to : 0,
			filter : ''
		};
	}
	filteFunc(word){
		this.setState({filter : word});
	}
	dateFunc(type, num){
		if (type === 'fdate') {
			this.setState({from: num});
		}
		if (type === 'tdate') {
			this.setState({to: num});
		}		
		
	}
	update(){
		if (this.state.from === 0 && this.state.to === 0) {
			return;
		}
		else{
			$.ajax({
				type:'GET',
				url:'/history',
				data:{
					fdate:parseInt(this.state.from, 10),
					tdate:parseInt(this.state.to, 10),
					userid:1,
					page:this.state.pagecurrent-1
				},
				dataType:'json',
				success:function (rs) {
					if (rs.msg === 'ok') {
						this.setState({
							items : rs.data,
							pagenum : 1 + rs.num / 10,
							pagecurrent : 1
						});
					}					
				}.bind(this)
			});
		}	
	}
	componentDidMount(){
		this.update();
	}
	render(){
		if (this.props.children) {
			return (
				<div className="manage">
					{this.props.children}
				</div>
				);
		}
		var out = this.state.items.map((o, i)=>{
			if (o.name.indexOf(this.state.filter) !== -1 ) {
				return (<Recorder data={o} key={i} />);
			}
		});
		return (
			<div className="manage">
				<DateSearcher fdate={this.state.from} tdate={this.state.to} handel={this.dateFunc.bind(this)} search={this.update.bind(this)} />
				<Filter handel={this.filteFunc.bind(this)} filter={this.state.filter} />
				<div className="content">
					{out}
				</div>
				<Page num={this.state.pagenum} current={this.state.pagecurrent} clickHandel={this.update.bind(this)} />
			</div>
			);

	}
}

class DateSearcher extends React.Component{
	handelChange(type, e){
		this.props.handel(type, parseInt(e.target.value, 10));
	}
	render(){
		return (
			<div className="searcher">
				<span>from</span>
				<input type="text" placeholder="date" value={this.props.fdate} onChange={this.handelChange.bind(this, 'fdate')} />
				<span>to</span>
				<input type="text" placeholder="date" value={this.props.tdate} onChange={this.handelChange.bind(this, 'tdate')} />
				<input type="button" value="search" onClick={this.props.search} />				
			</div>
			);

	}
}

class Filter extends React.Component{
	handel(e){
		this.props.handel(e.target.value);
	}
	render(){
		return (
			<div className="filter">
				<input type="text" placeholder="filter" onChange={this.handel.bind(this)} value={this.props.filter} />
			</div>
			);

	}
}

class Recorder extends React.Component{
	render(){
		var {name, priceAll, invsid, buyDate, id} = this.props.data; 
		return (
			<div className="recorder">
				<span>{name}</span>
				<span>{priceAll}</span>
				<span>{invsid}</span>
				<span>{buyDate}</span>
				<Link to={'/manage/detail?recordid='+id}  >detail</Link>
			</div>
			);

	}
}

class Page extends React.Component{
	clickPage(e){
		this.props.clickHandel(e.target.firstChild);
	}
	render(){
		var out = [];
		var temp;
		for (var i = 1; i <= this.props.num; i++){
			if(i === this.props.current){
				temp = (<a key={i} href="javascript:;" className="active">{i}</a>);
			}
			else{
				temp = (<a key={i} href="javascript:;">{i}</a>);
			}
			out.push(temp);
		}
		return (
			<div className="page" onClick={this.clickPage.bind(this)}>
				{out}
			</div>
			);

	}
}

export default Manage;