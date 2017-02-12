import React from 'react';
import {Link} from 'react-router';

class Invoice extends React.Component{
	changeFunc(name, keyName, e){
		var obj = this.refs[name];
		var stateObject = {};
		stateObject[keyName] = obj.value;
		this.props.handeler(stateObject);
	}
	render(){
		return (
			<div>		
				<div className="invoice" style={{margin:'20px'}}>
					<div className="col-md-6 col-sm-6">
						<div className="input-group">
						  <span className="input-group-addon">id</span>
						  <input ref="idBox" onChange={this.changeFunc.bind(this, 'idBox', 'id')} type="text" className="form-control" placeholder="id" value={this.props.id} />
						</div>
					</div>
					<div className="col-md-6 col-sm-6">
						<div className="input-group">
						  <span className="input-group-addon">price</span>
						  <input ref="invoicePriceBox" onChange={this.changeFunc.bind(this, 'invoicePriceBox', 'invoicePrice')} type="text" className="form-control" placeholder="price" value={this.props.invoicePrice} />
						</div>
					</div>			
				</div>
			</div>
		);
	}
}

export default Invoice;