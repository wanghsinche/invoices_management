import React from 'react';
import {Link} from 'react-router';
import Order from './component/order.jsx';
import Invoice from './component/invoice.jsx';
import PubSub from 'pubsub-js';

var valueChangeMsg;

class InputPanel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			id : '',
			name : '',
			date : '',
			invoicePrice : 0,
			orderPrice : 0,		
			current : 'order'
		};
	}
	handelLiClick(msg, e){
		this.setState({
			current : msg
		})
	}
	publishValueChange(stateObject){
		PubSub.publish('valueChange', stateObject);
	}
	submitData(e){
		var data = JSON.stringify(this.state);
		console.log(data);
	}
	pullData(){
		return;
	}
	componentDidMount(){
		this.pullData();
		valueChangeMsg = PubSub.subscribe('valueChange', (msg, stateObject)=>{
			this.setState(stateObject);
		});
	}
	componentWillUnmount(){
		PubSub.unsubscribe(valueChangeMsg);
	}
	render(){	
		let out;
		if(this.state.current === 'order'){
			out = (<Order date={this.state.date} name={this.state.name} orderPrice={this.state.orderPrice} handeler={this.publishValueChange} />);
		}
		if(this.state.current === 'invoice'){
			out = (<Invoice id={this.state.id} invoicePrice={this.state.invoicePrice} handeler={this.publishValueChange} />);
		}		  	
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					 <h3 className="panel-title">input panel</h3>
	  			</div>			
				<div className="panel-body">
					<ul className="nav nav-tabs">
					  <li onClick={this.handelLiClick.bind(this, 'order')} className={this.state.current === 'order'?'active':'normal'}><a href="javascript:;">order</a></li>
					  <li onClick={this.handelLiClick.bind(this, 'invoice')} className={this.state.current === 'invoice'?'active':'normal'}><a href="javascript:;">invoice</a></li>
					</ul>	
					{out}											
				</div>
				<div className="panel-footer">						
						<div className="btn-group">
							<button className="btn btn-default" type="button" onClick={this.submitData.bind(this)}>submit</button>
						</div>				
	  			</div>											
  			</div>	
		);
	}
}

export default InputPanel;
