import React from "react";
import { ButtonGroup } from "../photon/photon";
export default class BtnGPR extends ButtonGroup{
    render(){
        let props = this.props;
        return (
            <div className="btn-group"  {...props}>
				{this.props.children}
			</div>
        );

    }
}