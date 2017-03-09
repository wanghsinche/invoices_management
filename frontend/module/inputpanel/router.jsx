import Order from './component/order.jsx';
import Invoice from './component/invoice.jsx';
import InputPanel from './inputpanel.jsx';
import { hashHistory } from 'react-router';
import LinkBox from './linkbox.jsx';

let routerOrder = {
	path : 'order',
	component : Order
};

let routerInvoice = {
	path : 'invoice',
	component : Invoice
};

let routerInput = {
	path : 'inputpanel/:linkid',
	component : LinkBox,
	// indexRoute : {onEnter:(nextstate, replace)=>{replace(hashHistory.getCurrentLocation().pathname+'/order');}},
	// childRoutes : [
	// 	routerOrder,
	// 	routerInvoice
	// ]
};

export default routerInput;