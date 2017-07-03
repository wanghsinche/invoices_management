import React, { Component, PropTypes} from 'react';
import { Pane, Input, TextArea  } from "../photon/photon";
const Post = ( {})=>{
    return (
        <Pane className="padded-more">
                <form>
                    <Input label="Order" />
                    <Input label="User" />
                    <Input label="Good" />
                    <Input label="Number" />
                    <TextArea label="Mark" style={{resize:'none'}}/>
                </form>
        </Pane>
    );
};


export default Post;
