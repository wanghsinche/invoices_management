import Order from './component/order.jsx';
import Invoice from './component/invoice.jsx';
import InputPanel from './inputpanel.jsx';
import { hashHistory } from 'react-router';

let routerOrder = {
	path : 'order',
	component : Order
};

let routerInvoice = {
	path : 'invoice',
	component : Invoice
};

let routerInput = {
	path : 'inputpanel',
	component : InputPanel,
	// indexRoute : {onEnter:(nextstate, replace)=>{replace(hashHistory.getCurrentLocation().pathname+'/order');}},
	// childRoutes : [
	// 	routerOrder,
	// 	routerInvoice
	// ]
};

export default routerInput;