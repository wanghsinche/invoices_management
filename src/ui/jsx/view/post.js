import React, { Component, PropTypes} from 'react';
import { Pane, Input, TextArea, Button  } from "../photon/photon";

const Post = ( {})=>{
    return (
        <Pane >
                <form className="grid grid-pad">
                    <div className="col-1-2"><Input label="Order" /></div>
                    <div className="col-1-2"><Input label="User" /></div>
                    <div className="col-1-2"><Input label="Good" /></div>
                    <div className="col-1-2"><Input label="Number" /></div>
                    <div className="col-1-1"><TextArea label="Mark" style={{resize:'none'}}/></div>
                    <div className="col-1-1">
                        <div className="form-actions" style={{'textAlign':'right'}}>
                            <Button  type="submit" ptStyle="default" text="Cancel"/>
                            <Button  type="submit" ptStyle="primary" text="OK" onClick={()=>{alert('sdf');}}/>
						</div>
                    </div>
                </form>
        </Pane>
    );
};


export default Post;
