import React from 'react';

class Dashboard extends React.Component{
	render(){
		return (
			<div className="dashboard">
			{this.props.children}
			</div>
		);
	}
}

export default Dashboard;