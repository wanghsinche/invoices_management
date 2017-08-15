import React, { Component, PropTypes } from 'react';
import { postAndAdd, getDetail } from '../redux/action';
import { connect } from 'react-redux';
import { Pane, Input, TextArea, Button, Toolbar, Actionbar, Icon } from "../photon/photon";
import { EmptyContent } from './modal';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { shell } from 'electron';





class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyDate:0,
            code: '',
            content: '',
            date:0,
            goodid:'',
            invoiceDate:0,
            invoicePrice:'',
            invoiceid:'',
            link:'',
            markid:'',
            name:'',
            num:'',
            price:'',
            priceall:'',
            recid:'',
            type:'',
            userid:'',
            username:'',
            canEdit: false
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            buyDate:nextProps.buyDate||0,
            code: nextProps.code||'',
            content: nextProps.content||'',
            date:nextProps.date||0,
            goodid:nextProps.goodid||'',
            invoiceDate:nextProps.invoiceDate||0,
            invoicePrice:nextProps.invoicePrice||'',
            invoiceid:nextProps.invoiceid||'',
            link:nextProps.link||'',
            markid:nextProps.markid||'',
            name:nextProps.name||'',
            num:nextProps.num||'',
            price:nextProps.price||'',
            priceall:nextProps.priceall||'',
            recid:nextProps.recid||'',
            type:nextProps.type||'',
            userid:nextProps.userid||'',
            username:nextProps.username
        });
        
    }
    

    handleChange(obj) {

        let newState = Object.assign({}, this.state, obj);
        this.setState(newState);
    }

    handleClick() {
        if (!this.state.canEdit) {
            this.setState({
                canEdit: true
            });
        }
        else {
            if (confirm('sure?')) {
                this.setState({
                    canEdit: false
                });
                this.props.postData(this.state);
            }

        }
    }

    handleCancel(){
        this.setState({
            canEdit:false
        });
    }

    render() {
        let {
            buyDate,
            code,
            content,
            date,
            goodid,
            invoiceDate,
            invoicePrice,
            invoiceid,
            link,
            markid,
            name,
            num,
            price,
            priceall,
            recid,
            type,
            userid,
            username,
            canEdit
        } = this.state;
        return (
            <div style={{ borderTop: '1px solid #dddbdd' }}>
                <h5 style={{ margin: '10px 0 0 20px', 'fontWeight': '600', 'fontSize': '16px' }}><Icon glyph="credit-card" />&nbsp;Detail:</h5>
                <div className="grid grid-pad" hidden={recid !== ''}>
                    <EmptyContent text="Please click an item" />
                </div>
                <div className="grid grid-pad" hidden={recid === ''}>
                    <div className="col-4-12"><Input label="Order" value={recid} readOnly /></div>
                    <div className="col-4-12"><Input label="Good" value={name} readOnly /></div>
                    <div className="col-2-12"><Input label="price" value={price} disabled={!canEdit} onChange={(e) => { this.handleChange({ price: e.target.value }); }} /></div>
                    <div className="col-2-12"><Input label="Number" value={num} disabled={!canEdit} onChange={(e) => { this.handleChange({ num: e.target.value }); }} /></div>

                    <div className="col-4-12"><Input label="Mark" value={content} readOnly={!canEdit} onChange={(e) => { this.handleChange({ content: e.target.value }); }} /></div>
                    <div className="col-4-12"><div className="form-group"><label>BuyDate</label><DatePicker disabled dateFormat="YYYY-MM-DD" selected={moment(buyDate)} onChange={(date) => { this.handleChange({ buyDate: date.valueOf() }); }} /></div></div>
                    <div className="col-2-12"><Input label="priceAll" value={priceall} disabled={!canEdit} onChange={(e) => { this.handleChange({ priceall: e.target.value }); }} /></div>

                    <div className="col-2-12"><Input label="User" value={username} disabled /></div>

                    <div className="col-4-12"><Input label="invoicecode" value={code} readOnly={!canEdit} onChange={(e) => { this.handleChange({ code: e.target.value }); }} /></div>
                    <div className="col-4-12"><div className="form-group"><label>invoiceDate</label><DatePicker disabled={!canEdit} dateFormat="YYYY-MM-DD" selected={invoiceDate === 0 ? '' : moment(invoiceDate)} onChange={(date) => { this.handleChange({ invoiceDate: date.valueOf() }); }} /></div></div>
                    <div className="col-2-12"><Input label="invoicePrice" value={invoicePrice} disabled={!canEdit} onChange={(e) => { this.handleChange({ invoicePrice: e.target.value }); }} /></div>

                    <div className="col-2-12"><div className="form-group"><label>Link</label>
                        {canEdit?
                            <input className="form-control" style={{ color: '#6db3fd' }} value={link} onChange={(e) => { this.handleChange({ link: e.target.value }); }} />
                            :
                            <span className="form-control" style={{ color: '#6db3fd',overflow:'hidden' }} data-src={link} onClick={() => { if(link){shell.openExternal(link);} }}>订单链接</span>
                        }
                    </div></div>

                    <div className="col-1-1">
                        <div className="toolbar-actions" style={{ 'textAlign': 'right' }} >
                            {canEdit && <Button type="submit" ptStyle="btn-default btn-large" text="Cancel" onClick={this.handleCancel.bind(this)}/>}
                            <Button type="submit" ptStyle="btn-primary btn-large" text={canEdit ? 'OK' : 'Edit'} onClick={this.handleClick.bind(this)} />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};



const mapStateToProps = (state) => {
    return state.rdsCurrent;
};

const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data) => {
            dispatch(postAndAdd(data));
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail);



