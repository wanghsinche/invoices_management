import React, { Component, PropTypes } from 'react';
import { Pane, Input, TextArea, Button, CheckBox } from "../photon/photon";
import { postAndAdd } from '../redux/action';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { shell } from 'electron';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            User: '', name: '', num: '', recid: '',
            Mark: '', link: '',
            price: '', priceAll: '', buyDate: Date.now()/1000,
            invsid: '', invoicePrice: '', invoiceDate: 0, code: '',
            remind: true
        };
    }
    handleChange(obj){

        let newState = Object.assign({},this.state,obj);
        this.setState(newState);
    }

    handleClick() {

        if (confirm('sure?')) {
            this.props.postData(this.state);
        }
        
    }

    handleClear(){
        this.setState({
            User: '', name: '', num: '', recid: '',
            Mark: '', link: '',
            price: '', priceAll: '', buyDate: Date.now()/1000,
            invsid: '', invoicePrice: '', invoiceDate: 0, code: ''
        });
    }

    render() {
        let {
            recid, User, name, num,
            Mark, link,
            price, priceAll, buyDate,
            invoicePrice, invoiceDate, code,
            remind
        } = this.state;
        return (
            <Pane className="padded-more">
                <h2>Post</h2>
                <form className="grid grid-pad">
                    <div className="col-1-2"><Input label="User" value={User} onChange={(e)=>{this.handleChange({User:e.target.value});}}/></div>
                    <div className="col-1-2"><Input label="Good" value={name} onChange={(e)=>{this.handleChange({name:e.target.value});}}/></div>
                    <div className="col-1-2"><Input label="price" value={price} onChange={(e)=>{this.handleChange({price:e.target.value});}}/></div>
                    <div className="col-1-2"><Input label="Number" value={num} onChange={(e)=>{this.handleChange({num:e.target.value});}}/></div>
                    <div className="col-1-2"><div className="form-group"><label>BuyDate</label><DatePicker  dateFormat="YYYY-MM-DD" selected={moment.unix(buyDate)} onChange={(date) => { console.log(date.unix());this.handleChange({ buyDate: date.unix() }); }} /></div></div>
                    <div className="col-1-2"><Input label="priceAll" value={priceAll}  onChange={(e) => { this.handleChange({ priceAll: e.target.value }); }} /></div>
                    <div className="col-1-2"><Input label="invoicecode" value={code}  onChange={(e) => { this.handleChange({ code: e.target.value }); }} /></div>
                    <div className="col-1-2"><div className="form-group"><label>invoiceDate</label><DatePicker dateFormat="YYYY-MM-DD" selected={invoiceDate === 0 ? '' : moment.unix(invoiceDate)} onChange={(date) => { console.log(date.unix());this.handleChange({ invoiceDate: date.unix() }); }} /></div></div>
                    <div className="col-1-2"><Input label="invoicePrice" value={invoicePrice} onChange={(e) => { this.handleChange({ invoicePrice: e.target.value }); }} /></div>
                    <div className="col-5-12"><Input label="Link" value={link}  onChange={(e) => { this.handleChange({ link: e.target.value }); }} /></div>
                    <div className="col-1-12"><div className="form-group"><label></label><CheckBox label="remind" checked={remind}  onChange={(e) => { this.handleChange({ remind: e.target.checked }); }} /></div></div>
                    <div className="col-1-1"><TextArea label="Mark" value={Mark} style={{ resize: 'none' }}  onChange={(e)=>{this.handleChange({Mark:e.target.value});}}/></div>
                    <div className="col-1-1">
                        <div className="form-actions" style={{ 'textAlign': 'right' }}>
                            <Button type="submit" ptStyle="default" text="clear"  onClick={this.handleClear.bind(this)} />
                            <Button type="submit" ptStyle="primary" text="Submit" onClick={this.handleClick.bind(this)} />
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
        postData: (data) => {
            dispatch(postAndAdd(data));
        },
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Post);



