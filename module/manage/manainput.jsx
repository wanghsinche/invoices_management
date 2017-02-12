import InputPanel from './../inputpanel/inputpanel.jsx';

class manaInput extends InputPanel{
	pullData(){
		console.log(this.props.location.query);
	}
}

export default manaInput;