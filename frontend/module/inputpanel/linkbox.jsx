import React from 'react';
import PubSub from 'pubsub-js';

class LinkBox extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			good: {
				goodid: 0,
				name: '',
				price: 0,
				priceAll: 0,
				num: 0,
				buyDate: 0
			},
			invs: {
				invsid: 0,
				price: 0,
				createDate: 0
			}
		};
	}
	componentDidMount(){
		$.ajax({
			method: 'get',
			url: '/link/' + this.props.params.linkid,
			success: function (rs) {
				// body...
				if (rs.msg === 'ok') {
					this.setState({
						good: rs.data.good,
						invs: rs.data.invs
					});
				}
			}.bind(this)
		});
	}
	render(){
		return (
			<div>
				<Good data={this.state.good} />
				<Invs data={this.state.invs} />
				<button>go</button>
			</div>
		);
	}
}

class Good extends React.Component{
	render(){
		let out = JSON.stringify(this.props.data);
		return (
			<div>{out}</div>
		);
	}
}
class Invs extends React.Component{
	render(){
		let out = JSON.stringify(this.props.data);
		return (
			<div>{out}</div>
		);
	}
}

export default LinkBox;