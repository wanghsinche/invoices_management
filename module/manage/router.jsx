import Manage from './manageplanel.jsx';
import manaInput from './manainput.jsx';

let routerInput = {
	path : 'detail',
	component : manaInput
};

let routerManage = {
	path : 'manage',
	component : Manage,
	childRoutes : [
		routerInput
	]
};

export default routerManage;