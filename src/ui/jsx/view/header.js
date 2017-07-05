import React from "react";
import { Toolbar, Actionbar, Button, ButtonGroup } from "../photon/photon";
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
        </Actionbar>
      </Toolbar>
    );
  }
}

export default Header;