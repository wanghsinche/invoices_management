import React from "react";
import { Toolbar, Actionbar, Button, ButtonGroup } from "../photon/photon";
import Page from './page';
import BtnGPR from './btngp';

class Header extends React.Component {
  render() {
    return (
      <Toolbar title="vortex">
        <Actionbar>
          
          <BtnGPR style={{}}>
            <Button glyph="home" />
            <Button glyph="github" />
          </BtnGPR>
          <Page style={{float:'right'}}/>
        </Actionbar>
      </Toolbar>
    );
  }
}

export default Header;