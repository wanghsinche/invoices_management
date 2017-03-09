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
						  <input ref="priceBox" onChange={this.changeFunc.bind(this, 'priceBox', 'price')} type="text" className="form-control" placeholder="price" value={this.props.price} />
						</div>
					</div>
					<div className="col-md-6 col-sm-6">
						<div className="input-group">
						  <span className="input-group-addon">priceAll</span>
						  <input ref="priceAllBox" onChange={this.changeFunc.bind(this, 'priceAllBox', 'price')} type="text" className="form-control" placeholder="priceAll" value={this.props.priceAll} />
						</div>
					</div>	
					<div className="col-md-6 col-sm-6">
						<div className="input-group">
						  <span className="input-group-addon">date</span>
						  <input ref="numBox" onChange={this.changeFunc.bind(this, 'numBox', 'num')} type="text" className="form-control" placeholder="num" value={this.props.num} />
						</div>
					</div>	
					<div className="col-md-6 col-sm-6">
						<div className="input-group">
						  <span className="input-group-addon">date</span>
						  <input ref="dateBox" onChange={this.changeFunc.bind(this, 'dateBox', 'buyDate')} type="text" className="form-control" placeholder="date" value={this.props.buyDate} />
						</div>
					</div>															
				</div>
			</div>
		);
	}
}

export default Order;