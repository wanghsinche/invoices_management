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
            goodcode: '',
            buyDate: 0,
            code: '',
            content: '',
            date: 0,
            goodid: '',
            invoiceDate: 0,
            invoicePrice: '',
            invoiceid: '',
            link: '',
            markid: '',
            name: '',
            num: '',
            price: '',
            priceall: '',
            recid: '',
            type: '',
            userid: '',
            username: '',
            canEdit: false
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            goodcode: nextProps.goodcode || '',
            buyDate: nextProps.buyDate || 0,
            code: nextProps.code || '',
            content: nextProps.content || '',
            date: nextProps.date || 0,
            goodid: nextProps.goodid || '',
            invoiceDate: nextProps.invoiceDate || 0,
            invoicePrice: nextProps.invoicePrice || '',
            invoiceid: nextProps.invoiceid || '',
            link: nextProps.link || '',
            markid: nextProps.markid || '',
            name: nextProps.name || '',
            num: nextProps.num || '',
            price: nextProps.price || '',
            priceall: nextProps.priceall || '',
            recid: nextProps.recid || '',
            type: nextProps.type || '',
            userid: nextProps.userid || '',
            username: nextProps.username
        });

    }


    handleChange(obj) {

        let newState = Object.assign({}, this.state, obj);
        this.setState(newState);
    }

    handleClick() {
        var data = {}, msg='';
        if (!this.state.canEdit) {
            this.setState({
                canEdit: true
            });
        }
        else {
            data.price = this.state.price;
            data.priceall = this.state.priceall;
            data.num = this.state.num;
            data.invscode = this.state.code;
            data.invsdate = this.state.invoiceDate;
            data.type = this.state.type;
            data.invsprice = this.state.invoicePrice;
            data.link = this.state.link;
            data.content = this.state.content;
            
            Object.keys(data).forEach(function(key){
                if(!data[key]){
                    msg += key + '，';
                }
            });
            if(!!msg){
                msg+='字段为空，';
            }
            if (confirm(msg+'是否提交?')) {
                this.setState({
                    canEdit: false
                });

                this.props.postData(this.state.recid, data);
            }
        }
    }

    handleCancel() {
        this.setState({
            canEdit: false
        });
    }

    render() {
        let {
            goodcode,
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
                <h5 style={{ margin: '10px 0 0 20px', 'fontWeight': '600', 'fontSize': '16px' }}><Icon glyph="credit-card" />&nbsp;订单详情</h5>
                <div className="grid grid-pad" hidden={recid !== ''}>
                    <EmptyContent text="选择订单查看详情" />
                </div>
                <div className="grid grid-pad" hidden={recid === ''}>
                    <div className="col-4-12"><Input label="订单号" disabled={!canEdit}  value={goodcode} readOnly /></div>
                    <div className="col-4-12"><Input label="名称"  disabled={!canEdit} value={name} readOnly /></div>
                    <div className="col-2-12"><Input label="单价" value={price} disabled={!canEdit} onChange={(e) => { this.handleChange({ price: e.target.value }); }} /></div>
                    <div className="col-2-12"><Input label="数量" value={num} disabled={!canEdit} onChange={(e) => { this.handleChange({ num: e.target.value }); }} /></div>

                    <div className="col-4-12"><Input label="备注"  disabled={!canEdit} value={content} readOnly={!canEdit} onChange={(e) => { this.handleChange({ content: e.target.value }); }} /></div>
                    <div className="col-4-12"><div className="form-group"><label>Link</label>
                        {canEdit ?
                            <input className="form-control" style={{ color: '#6db3fd' }} value={link} onChange={(e) => { this.handleChange({ link: e.target.value }); }} />
                            :
                            <span className="form-control" style={{ color: '#6db3fd', overflow: 'hidden', display: 'block' }} data-src={link} onClick={() => { if (link) { shell.openExternal(link); } }}>订单链接</span>
                        }
                    </div></div>

                    <div className="col-2-12"><Input label="总金额" value={priceall} disabled={!canEdit} onChange={(e) => { this.handleChange({ priceall: e.target.value }); }} /></div>
                    <div className="col-2-12"><div className="form-group"><label>购买日期</label>
                        <DatePicker disabled dateFormat="YYYY-MM-DD" selected={moment(buyDate)} onChange={(date) => { this.handleChange({ buyDate: date.valueOf() }); }} />
                    </div></div>


                    <div className="col-4-12"><Input label="发票号码" value={code}  disabled={!canEdit} readOnly={!canEdit} onChange={(e) => { this.handleChange({ code: e.target.value }); }} /></div>
                    <div className="col-2-12"><Input label="发票类型" value={type}  disabled={!canEdit} readOnly={!canEdit} onChange={(e) => { this.handleChange({ type: e.target.value }); }} /> </div>
                    <div className="col-2-12"><Input label="买家" value={username} disabled /></div>
                    <div className="col-2-12"><Input label="发票金额" value={invoicePrice} disabled={!canEdit} onChange={(e) => { this.handleChange({ invoicePrice: e.target.value }); }} /></div>
                    <div className="col-2-12"><div className="form-group"><label>发票上交日期</label><DatePicker disabled={!canEdit} dateFormat="YYYY-MM-DD" selected={invoiceDate === 0 ? '' : moment(invoiceDate)} onChange={(date) => { this.handleChange({ invoiceDate: date.valueOf() }); }} /></div></div>
                    <div className="col-1-1">
                        <div className="form-actions" >
                            {canEdit && <Button type="submit" ptStyle="btn-default btn-large" text="取消" onClick={this.handleCancel.bind(this)} />}
                            <Button type="submit" ptStyle="btn-primary btn-large" text={canEdit ? '提交' : '修改'} onClick={this.handleClick.bind(this)} />
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
        postData: (recid, data) => {
            dispatch(postAndAdd(recid, data));
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail);



