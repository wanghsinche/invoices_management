import React, { Component, PropTypes } from 'react';
import { postAndAdd,  refreshGoodAction, asyncAction} from '../redux/action';
import { connect } from 'react-redux';
import { Pane, Input, TextArea, Button,Toolbar,Actionbar, Icon } from "../photon/photon";
import {EmptyContent} from './modal';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const onChange = (dateString, { dateMoment, timestamp }) => {
  console.log(dateString);
};
 
let date = '2017-04-24';
 


class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '', User: '', name: '', Num: '',
            Mark: '', link: '',
            price: '', priceAll: '', buyDate: '2010-09-01',
            invoiceid: '', invoicePrice: '', invoiceDate: '2010-09-01',
            
        };
    }

    componentDidMount(){
        let fetchData = this.props.fetchData;
        fetchData();
        
    }
    
    componentWillReceiveProps(nextProps){
        let good;
        if(nextProps.record&&nextProps.record.ordid){
            good = this.getGood(nextProps.record.ordid);
            
            this.setState(good);
        }
    }

    getGood(id){
        let res =  this.props.goods.filter(function(v){
            return v.id == id;
        });
        res = res&&res[0];
        return res||{};
    }

    handleChange(obj) {

        let newState = Object.assign({}, this.state, obj);
        this.setState(newState);
    }
    render() {
        let {
            id, User, name, Num,
            Mark, link,
            price, priceAll, buyDate,
            invoiceid, invoicePrice, invoiceDate
        } = this.state,
            { handleSubmit } = this.props;
        return (
            <div style={{borderTop:'1px solid #dddbdd'}}>
                <h5 style={{margin: '10px 0 0 20px', 'fontWeight':'600','fontSize':'16px'}}><Icon glyph="credit-card"/>&nbsp;Detail:</h5>
                <div className="grid grid-pad" hidden={id !==''}>
                    <EmptyContent text="Please click an item"/>
                </div>
                <div className="grid grid-pad" hidden={id ===''}>
                    <div className="col-4-12"><Input label="Order" value={id} readonly /></div>
                    <div className="col-4-12"><Input label="Good" value={name} readonly /></div>
                    <div className="col-2-12"><Input label="price" value={price} onChange={(e) => { this.handleChange({ price: e.target.value }); }} /></div>
                    <div className="col-2-12"><Input label="Number" value={Num} onChange={(e) => { this.handleChange({ Num: e.target.value }); }} /></div>

                    <div className="col-4-12"><Input label="invoiceid" value={invoiceid} onChange={(e) => { this.handleChange({ invoiceid: e.target.value }); }} /></div>
                    <div className="col-4-12"><div className="form-group"><label>BuyDate</label><DatePicker disabled dateFormat="YYYY-MM-DD" selected={moment(buyDate)} onChange={(dateString, { dateMoment, timestamp }) => { this.handleChange({ buyDate: dateString }); }}  /></div></div>
                    <div className="col-2-12"><Input label="invoicePrice" value={invoicePrice} onChange={(e) => { this.handleChange({ invoicePrice: e.target.value }); }} /></div>
                    <div className="col-2-12"><Input label="User" value={User} disabled /></div>

                    <div className="col-4-12"><Input label="Mark" value={Mark}  onChange={(e) => { this.handleChange({ Mark: e.target.value }); }} /></div>
                    <div className="col-4-12"><div className="form-group"><label>invoiceDate</label><DatePicker dateFormat="YYYY-MM-DD" selected={moment(invoiceDate)} onChange={(dateString, { dateMoment, timestamp }) => { this.handleChange({ invoiceDate: dateString }); }}  /></div></div>
                    <div className="col-2-12"><Input label="priceAll" value={priceAll}  onChange={(e) => { this.handleChange({ priceAll: e.target.value }); }} /></div>
                    <div className="col-2-12"><Input label="link" value={link} readonly /></div>
                    
                    <div className="col-1-1">
                        <div className="toolbar-actions" style={{'textAlign':'right'}} >
                            <Button type="submit" ptStyle="btn-default btn-large" text="Cancel" />
                            <Button type="submit" ptStyle="btn-primary btn-large" text="OK" onClick={() => { handleSubmit(this.state); }} />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};



const mapStateToProps = (state) => {
    return {
        goods: state.rdsGoods,
        record: state.rdsCurrent
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData:()=>{
            dispatch(refreshGoodAction());
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail);



