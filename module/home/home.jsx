import React from 'react';
import PubSub from 'pubsub-js';
import Auth from './../../services/auth.js';

var cookieChangeMsg;

class Home extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			'login' : false,
			'id' : ''
		}
	}
	checkLog(){
		var id = ''
		if(Auth.islogin()){
			this.setState({
				'login' : true,
				'id' : Auth.getName()
			});
		}
		else{
			this.setState({
				'login' : false,
				'id' : ''
			});		
		}
	}
	componentDidMount(){
		cookieChangeMsg = PubSub.subscribe('cookieChange', this.checkLog.bind(this));
		this.checkLog();
	}
	componentWillUnmount(){
		PubSub.unsubscribe(cookieChangeMsg);
	}
	render(){
		return (
			<div className="home">
			{
				this.state.login?
				(<Welcome id={this.state.id} />):
				(<LoginBox />)
			}
			</div>
		);
	}
}

class Welcome extends React.Component{
	logout(){
		Auth.logout();
		PubSub.publish('cookieChange');
	}
	render(){
		return (
			<div className="jumbotron">
				<h2>welcome</h2>
				<p><strong>{this.props.id}</strong></p>
				<p><input className="btn btn-primary btn-lg" type="button" value="logout" onClick={this.logout.bind(this)} /></p>
			</div>
		);
	}
}

class LoginBox extends React.Component{
	login(){
		var id = this.refs.idbox.value.trim();
		Auth.login(id);
		PubSub.publish('cookieChange');		
	}
	render(){
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					 <h3 className="panel-title">login</h3>
	  			</div>			
				<div className="panel-body">
					<div className="input-group">
						<span className="input-group-addon">name</span>
						<input id="name" type="text" placeholder="name"  className="form-control"/>	
						<span className="input-group-addon">id</span>
						<input id="id" type="text" placeholder="id" ref="idbox" className="form-control"/>	
					</div>			
				</div>
				<div className="panel-footer">
					<button className="btn btn-primary"  onClick={this.login.bind(this)}  type="button">Go!</button>
				</div>
  			</div>	
		);
	}
}

export default Home;