import React, { Component, PropTypes } from 'react';
import { Pane, Input, TextArea, Button, CheckBox,Icon } from "../photon/photon";
import { putNewRecord } from '../redux/action';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { shell } from 'electron';
class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodcode: '',
            name: '',
            price: '',
            priceall: '',
            num: '',
            buyDate: Date.now(),
            invscode: '',
            invsprice: '',
            invsdate: '',
            type: '',
            link: '',
            content: '',
            mailFlag: true,
            lastpost: 0
        };
    }
    handleChange(obj) {
        let newState = Object.assign({}, this.state, obj);
        this.setState(newState);
    }

    handleClick() {
        var data = Object.assign({}, this.state);
        if(Date.now() - data.lastpost < 10000 ){
            alert('提交过于频繁，请稍后再试');
        }
        else if (!data.goodcode || !data.name || !data.priceall||!data.price || !data.num || !data.link) {
            alert('必填字段不完整，订单号，商品名称，单价，总价，数量，链接均为必填。');
            
        }
        else if(!/https?:\/\//.test(data.link)){
            alert('错误的链接地址');
            
        }
        else {
            if (confirm('sure?')) {
                this.props.postData(data);
                this.setState({
                    lastpost: Date.now()
                });
            }
        }


    }

    handleClear() {
        this.setState({
            goodcode: '',
            name: '',
            price: '',
            priceall: '',
            num: '',
            buyDate: Date.now(),
            invscode: '',
            invsprice: '',
            invsdate: '',
            type: '',
            link: '',
            content: '',
            mailFlag: true
        });
    }

    render() {
        let {
            goodcode,
            name,
            price,
            priceall,
            num,
            buyDate,
            invscode,
            invsprice,
            invsdate,
            type,
            link,
            content,
            mailFlag
        } = this.state;
        return (
            
            <Pane className="">
                <form className="grid grid-pad">
                    <div className="col-1-1"><h4><Icon glyph="doc-text-inv" />&nbsp;添加新订单</h4></div>
                    <div className="col-1-2"><Input label="订单号" value={goodcode} onChange={(e) => { this.handleChange({ goodcode: e.target.value }); }} /></div>
                    <div className="col-1-2"><Input label="名称" value={name} onChange={(e) => { this.handleChange({ name: e.target.value }); }} /></div>
                    <div className="col-1-2"><Input label="单价" value={price} onChange={(e) => { this.handleChange({ price: e.target.value }); }} /></div>
                    <div className="col-1-2"><Input label="数量" value={num} onChange={(e) => { this.handleChange({ num: e.target.value }); }} /></div>
                    <div className="col-1-2"><div className="form-group"><label>购买日期</label><DatePicker dateFormat="YYYY-MM-DD" selected={moment(buyDate)} onChange={(date) => { console.log(date.valueOf()); this.handleChange({ buyDate: date.valueOf() }); }} /></div></div>
                    <div className="col-1-2"><Input label="总金额" value={priceall} onChange={(e) => { this.handleChange({ priceall: e.target.value }); }} /></div>
                    <div className="col-1-2"><Input label="发票号码" value={invscode} onChange={(e) => { this.handleChange({ invscode: e.target.value }); }} /></div>
                    <div className="col-1-2"><div className="form-group"><label>发票上交日期</label><DatePicker dateFormat="YYYY-MM-DD" selected={invsdate && moment(invsdate)} onChange={(date) => { console.log(date.valueOf()); this.handleChange({ invsdate: date.valueOf() }); }} /></div></div>
                    <div className="col-1-2"><Input label="发票金额" value={invsprice} onChange={(e) => { this.handleChange({ invsprice: e.target.value }); }} /></div>
                    <div className="col-5-12"><Input label="Link" value={link} onChange={(e) => { this.handleChange({ link: e.target.value }); }} /></div>
                    <div className="col-1-12"><div className="form-group"><label></label><CheckBox label="提醒老师付款" checked={mailFlag} onChange={(e) => { this.handleChange({ mailFlag: e.target.checked }); }} /></div></div>
                    <div className="col-1-1"><TextArea label="备注" value={content} style={{ resize: 'none' }} onChange={(e) => { this.handleChange({ content: e.target.value }); }} /></div>
                    <div className="col-1-1">
                        <div className="form-actions">
                            <Button type="submit" ptStyle="btn-default  btn-large" text="取消" onClick={this.handleClear.bind(this)} />
                            <Button type="submit" ptStyle="btn-primary  btn-large" text="提交" onClick={this.handleClick.bind(this)} />
                        </div>
                    </div>
                </form>
            </Pane>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        loged: !!state.rdsInfo.loged,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        postData: (data) => {
            dispatch(putNewRecord(data));
        },
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Post);



