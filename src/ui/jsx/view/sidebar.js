import React from "react";
import {  Pane, NavGroup, NavTitle, NavGroupItem } from "../photon/photon";
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {pageShowAction} from '../redux/action';
 
class NavLink extends NavGroupItem {
  constructor(props){
    super(props);
  }

	render() {
    let result = super.render.call(this);
    let props = result.props, className = result.props.className;
		const icon = this.getIconComponent();

		return (
			<Link {...props} className={className}>
				{icon}{this.props.text}
			</Link>
		);
	}
}

class Sidebar extends React.Component {


  render() {
    let onSelectRedux = this.props.onSelectRedux;
    return (
      <Pane ptSize="sm" sidebar>
        <NavGroup activeKey={'Home'} onSelect={
          (key)=>{onSelectRedux(key);}
        }>
          <NavTitle>nav group icon &amp; text</NavTitle>
          <NavLink eventKey={'Home'} glyph="home" text="Home" to="/"/>
          <NavLink eventKey={'List'} glyph="doc-text-inv" text="List" to="/List"/>
          <NavLink eventKey={'About'} glyph="info-circled" text="About" to="/About"/>
          <NavLink eventKey={'Post'} glyph="plus-circled" text="Post" to="/Post"/>
        </NavGroup>
      </Pane>
    );
  }
}

const mapStateToProps = (state) => {
  return{

  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectRedux: (key) => {
            if(key === 'List'){
              dispatch(pageShowAction(true));
            }
            else{
              dispatch(pageShowAction(false));
            }
            
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);;

