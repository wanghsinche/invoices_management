import React from 'react';
import {Link} from 'react-router';


export class SimpleItem extends React.Component{
	render(){
		return (
			<li role="presentation" className="">
				<Link to={this.props.to}>{this.props.name}</Link>
			</li>
		);
	}
}

export class DropdownItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			'expand' : false
		};
	}
	trigger(){
		this.setState({
			'expand' : !this.state.expand
		});
	}
	render(){
		return (
			<li role="presentation" className="">
					<a onClick={this.trigger.bind(this)} href="javascript:;">{this.props.name}</a>
					<ul className="nav nav-pills nav-stacked" style={this.state.expand?{display:'block'}:{display:'none'}}>
						{this.props.children}
					</ul>
			</li>
		);
	}
}


