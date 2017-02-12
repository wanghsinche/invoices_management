import React from 'react';
import Nav from './module/nav/nav.jsx';

class App extends React.Component{
	render() {	
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12 col-sm-12">
						<h1>test</h1>
					</div>
				</div>
				<div className="row">
					<div className="col-md-2 col-sm-2">
						<Nav />
					</div>
					<div className="col-md-10 col-sm-10">
						{this.props.children}
					</div>					
				</div>
			</div>
		);
	}
}; 
export default App;
