import React from 'react';
import {Link} from 'react-router';
class Order extends React.Component{
	changeFunc(name, keyName, e){
		var obj = this.refs[name];
		var stateObject = {};
		stateObject[keyName] = obj.value;
		this.props.handeler(stateObject);
	}	
	render(){
		return (
			<div>			
				<div className="order" style={{margin:'20px'}}>
					<div className="col-md-6 col-sm-6">
						<div className="input-group">
						  <span className="input-group-addon">product</span>
						  <input ref="nameBox" onChange={this.changeFunc.bind(this, 'nameBox', 'name')} type="text" className="form-control" placeholder="product" value={this.props.name} />
						</div>
					</div>
					<div className="col-md-6 col-sm-6">
						<div className="input-group">
						  <span className="input-group-addon">price</span>
						  <input ref="orderPriceBox" onChange={this.changeFunc.bind(this, 'orderPriceBox', 'orderPrice')} type="text" className="form-control" placeholder="price" value={this.props.orderPrice} />
						</div>
					</div>
					<div className="col-md-6 col-sm-6">
						<div className="input-group">
						  <span className="input-group-addon">date</span>
						  <input ref="dateBox" onChange={this.changeFunc.bind(this, 'dateBox', 'date')} type="text" className="form-control" placeholder="date" value={this.props.date} />
						</div>
					</div>					
				</div>
			</div>
		);
	}
}

export default Order;