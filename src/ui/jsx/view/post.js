import React, { Component, PropTypes } from 'react';
import { Pane, Input, TextArea, Button } from "../photon/photon";
import { postAndAdd } from '../redux/action';
import { connect } from 'react-redux';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Order:'',User:'',Good:'',Num:'',Mark:''
        };
    }
    handleChange(obj){

        let newState = Object.assign({},this.state,obj);
        this.setState(newState);
    }
    render() {
        let { Order,User,Good,Num,Mark} = this.state,
        {handleSubmit} = this.props;
        return (
            <Pane className="padded-more">
                <h2>Post</h2>
                <form className="grid grid-pad">
                    <div className="col-1-2"><Input label="Order" value={Order} onChange={(e)=>{this.handleChange({Order:e.target.value});}}/></div>
                    <div className="col-1-2"><Input label="User" value={User} onChange={(e)=>{this.handleChange({User:e.target.value});}}/></div>
                    <div className="col-1-2"><Input label="Good" value={Good} onChange={(e)=>{this.handleChange({Good:e.target.value});}}/></div>
                    <div className="col-1-2"><Input label="Number" value={Num} onChange={(e)=>{this.handleChange({Num:e.target.value});}}/></div>
                    <div className="col-1-1"><TextArea label="Mark" value={Mark} style={{ resize: 'none' }}  onChange={(e)=>{this.handleChange({Mark:e.target.value});}}/></div>
                    <div className="col-1-1">
                        <div className="form-actions" style={{ 'textAlign': 'right' }}>
                            <Button type="submit" ptStyle="default" text="Cancel" />
                            <Button type="submit" ptStyle="primary" text="OK" onClick={() => {handleSubmit(this.state); }} />
                        </div>
                    </div>
                </form>
            </Pane>
        );
    }
};

const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleSubmit: (data) => {
            dispatch(postAndAdd(data));
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Post);



