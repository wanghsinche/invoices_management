import React from 'react';
import {Link} from 'react-router';

class Manage extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			items : [],
			pagenum : 1,
			pagecurrent : 1,
			from : '3',
			to : '4',
			filter : ''
		};
	}
	filteFunc(word){
		this.setState({filter : word});
	}
	update(page){
		this.setState({
			items : [
				{name : 'oo', price : 1, num : 1, date : 33, recordid : 1},
				{name : 'oo3', price : 1, num : 1, date : 33, recordid : 2},
				{name : 'oof', price : 1, num : 1, date : 333, recordid : 3}
			],
			pagenum : 2,
			pagecurrent : 1
		});		
	}
	componentDidMount(){
		this.update(1);
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
				<DateSearcher />
				<Filter handel={this.filteFunc.bind(this)} />
				<div className="content">
					{out}
				</div>
				<Page num={this.state.pagenum} current={this.state.pagecurrent} clickHandel={this.update.bind(this)} />
			</div>
			);

	}
}

class DateSearcher extends React.Component{
	render(){
		return (
			<div className="searcher">
				<span>from</span>
				<input type="text" placeholder="date" />
				<span>to</span>
				<input type="text" placeholder="date" />
				<input type="button" value="search" />				
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
				<input type="text" placeholder="filter" onChange={this.handel.bind(this)} />
			</div>
			);

	}
}

class Recorder extends React.Component{
	render(){
		var {name, price, num, date, recordid} = this.props.data; 
		return (
			<div className="recorder">
				<span>{name}</span>
				<span>{price}</span>
				<span>{num}</span>
				<span>{date}</span>
				<Link to={'/manage/detail?recordid='+recordid}  >detail</Link>
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