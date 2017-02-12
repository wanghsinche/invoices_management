import React from 'react';

class About extends React.Component{
	render(){
		return (
			<div className="about">
				<h2>about</h2>
				{this.props.children}
			</div>
		);
	}
}

export default About;

