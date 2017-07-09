import React, { Component, PropTypes } from 'react';
import { postAndAdd, refreshListAction, updateList } from '../redux/action';
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
            User: '', name: '', num: '', recid: '',
            Mark: '', link: '',
            price: '', priceAll: '', buyDate: moment(),
            invsid: '', invoicePrice: '', invoiceDate: '', code: '',
            canEdit: false
        };
    }

    componentDidMount() {
        let fetchData = this.props.fetchData;
        fetchData();

    }

    componentWillReceiveProps(nextProps) {
        let good, user, mark, invs;
        if (nextProps.record && nextProps.record.goodid) {
            good = this.getGood(nextProps.record.goodid);
            user = this.getUser(nextProps.record.usrid);
            mark = this.getMark(nextProps.record.markid);
            invs = this.getInvs(nextProps.record.invsid);
            this.setState(Object.assign({}, good, {
                recid: nextProps.record.recid,
                User: user.name,
                Mark: mark.content,
                link: mark.link,
                code: invs.code,
                invoicePrice: invs.price,
                invoiceDate: invs.createDate
            }));
        }
    }
    getinfo(id, fieldid, category) {
        let res = this.props[category].find(function (v) {
            return v[fieldid] == id;
        });
        return res || {};
    }

    getGood(id) {
        return this.getinfo(id, 'id', 'goods');
    }

    getUser(id) {
        return this.getinfo(id, 'id', 'users');
    }

    getMark(id) {
        let res = this.getinfo(id, 'id', 'marks');
        return Object.assign({ content: '' }, res);

    }
    getInvs(id) {
        let res = this.getinfo(id, 'id', 'invs');
        return Object.assign({
            code: "",
            price: "",
            createDate: ""
        }, res);

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

    render() {
        let {
            recid, User, name, num,
            Mark, link,
            price, priceAll, buyDate,
            invoicePrice, invoiceDate, code,
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

                    <div className="col-4-12"><Input label="Mark" value={Mark} readOnly={!canEdit} onChange={(e) => { this.handleChange({ Mark: e.target.value }); }} /></div>
                    <div className="col-4-12"><div className="form-group"><label>BuyDate</label><DatePicker disabled dateFormat="YYYY-MM-DD" selected={moment(buyDate)} onChange={(dateString, { dateMoment, timestamp }) => { this.handleChange({ buyDate: dateString }); }} /></div></div>
                    <div className="col-2-12"><Input label="priceAll" value={priceAll} disabled={!canEdit} onChange={(e) => { this.handleChange({ priceAll: e.target.value }); }} /></div>

                    <div className="col-2-12"><Input label="User" value={User} disabled /></div>

                    <div className="col-4-12"><Input label="invoicecode" value={code} readOnly={!canEdit} onChange={(e) => { this.handleChange({ code: e.target.value }); }} /></div>
                    <div className="col-4-12"><div className="form-group"><label>invoiceDate</label><DatePicker disabled={!canEdit} dateFormat="YYYY-MM-DD" selected={invoiceDate === '' ? '' : moment(invoiceDate)} onChange={(dateString, { dateMoment, timestamp }) => { this.handleChange({ invoiceDate: dateString }); }} /></div></div>
                    <div className="col-2-12"><Input label="invoicePrice" value={invoicePrice} disabled={!canEdit} onChange={(e) => { this.handleChange({ invoicePrice: e.target.value }); }} /></div>

                    <div className="col-2-12"><div className="form-group"><label>Link</label>
                        {canEdit?
                            <input className="form-control" style={{ color: '#6db3fd' }} value={link} onChange={(e) => { this.handleChange({ link: e.target.value }); }} />
                            :
                            <span className="form-control" style={{ color: '#6db3fd' }} data-src={link} onClick={() => { if(link){shell.openExternal(link);} }}>{link}</span>
                        }
                    </div></div>

                    <div className="col-1-1">
                        <div className="toolbar-actions" style={{ 'textAlign': 'right' }} >
                            {canEdit && <Button type="submit" ptStyle="btn-default btn-large" text="Cancel" />}
                            <Button type="submit" ptStyle="btn-primary btn-large" text={canEdit ? 'OK' : 'Edit'} onClick={this.handleClick.bind(this)} />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
};



const mapStateToProps = (state) => {
    return {
        users: state.rdsList.users,
        goods: state.rdsList.goods,
        record: state.rdsCurrent,
        marks: state.rdsList.marks,
        invs: state.rdsList.invs
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data) => {
            
            dispatch(postAndAdd(data));
        },
        fetchData: () => {
            dispatch(refreshListAction());
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail);



