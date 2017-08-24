import React, { Component, PropTypes } from 'react';
import { Window, Toolbar, Content, Pane, Input, Icon, Button, ListGroup, ListItem, Actionbar } from "../photon/photon";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import { refreshState, changePswd, exportFile, createUser, changeUser } from '../redux/action';
import { remote, ipcRenderer } from 'electron';


class About extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        password: '',
                        passwordAgain: '',
                        from: Date.now() - 1000 * 60 * 60 * 24 * 30,
                        to: Date.now(),
                        newcode: '',
                        newname: '',
                        newemail: ''
                };
        }
        componentDidMount() {
                ipcRenderer.on('asynchronous-reply', (event, arg) => {
                        alert('保存成功');
                });
        }
        passwordChange() {
                if (this.state.password !== this.state.passwordAgain) {
                        alert('输入不一致');
                }
                else if (this.state.password.length !== 6) {
                        console.log(this.state.password.length);
                        alert('密码限制六位');
                }
                else {
                        this.props.handleChangePswd(this.state.password);
                }
        }
        docxExport() {
                this.props.handleExportFile('docx', this.state.from, this.state.to);
        }
        csvExport() {
                this.props.handleExportFile('csv', this.state.from, this.state.to, this.props.accessList.map(v => v.userid));
        }
        userCreate() {
                if (this.state.newcode && this.state.newname && this.state.newemail) {
                        if (!/^\d+$/.test(this.state.newcode)) {
                                alert('学号必须为数字');
                        }
                        else if (!/\S+@\S+\.\S+/.test(this.state.newemail)) {
                                alert('邮箱格式错误');
                        }
                        else {
                                this.props.handleCreateUser(this.state.newcode, this.state.newname, this.state.newemail);
                        }
                }
                else {
                        alert('用户信息不全');
                }

        }
        userChange(userid, e){
                if(this.props.role === 'superuser'){
                        this.props.handleChangeUser(userid, e.target.checked);
                }
                else{
                        alert('普通用户无法修改权限');
                }
        }
        render() {
                let { password, passwordAgain, from, to, newcode, newemail, newname } = this.state, accessList = this.props.accessList;
                return (
                        <Pane >
                                <div className="grid grid-pad">
                                        <div className="col-1-3">
                                                <h5 style={{}}><Icon glyph="credit-card" />&nbsp;修改密码</h5>
                                                <Input label="新密码" type="password" onChange={(e) => { this.setState({ password: e.target.value }); }} />
                                                <Input label="再次输入" type="password" onChange={(e) => { this.setState({ passwordAgain: e.target.value }); }} />
                                                <Button type="submit" ptStyle="btn-primary btn-large" text="确定修改" onClick={(e) => { this.passwordChange(); }} />
                                        </div>
                                        <div className="col-1-3">
                                                <h5 style={{}}><Icon glyph="credit-card" />&nbsp;导出文档</h5>
                                                <div className="form-group">
                                                        <label>开始日期</label><DatePicker dateFormat="YYYY-MM-DD" selected={moment(from)} onChange={(date) => { this.setState({ from: date.valueOf() }); }} />
                                                </div>
                                                <div className="form-group">
                                                        <label>截至日期</label><DatePicker dateFormat="YYYY-MM-DD" selected={moment(to)} onChange={(date) => { this.setState({ to: date.valueOf() }); }} />
                                                </div>
                                                <div className="form-actions">
                                                        <Button type="submit" ptStyle="btn-primary btn-large" text="入库单导出" onClick={() => { this.csvExport(); }} />
                                                        {this.props.role === 'superuser' && <Button type="submit" ptStyle="btn-primary btn-large" text="汇总单导出" onClick={() => { this.docxExport(); }} />}
                                                </div>

                                        </div>
                                        <div className="col-1-3">
                                                <h5 style={{}}><Icon glyph="credit-card" />&nbsp;新建用户</h5>
                                                <Input label="学号" type="input" value={newcode} onChange={(e) => { this.setState({ newcode: e.target.value }); }} />
                                                <Input label="姓名" type="input" value={newname} onChange={(e) => { this.setState({ newname: e.target.value }); }} />
                                                <Input label="邮箱" type="email" value={newemail} onChange={(e) => { this.setState({ newemail: e.target.value }); }} />
                                                <Button type="submit" ptStyle={this.props.role === 'superuser' ? 'btn-large btn-primary' : 'btn-large btn-default'} text={this.props.role === 'superuser' ? '创建用户' : '仅管理员可用'} disabled={this.props.role !== 'superuser'} onClick={this.userCreate.bind(this)} />
                                        </div>

                                        <div className="col-8-12">
                                                <h5 style={{}}><Icon glyph="credit-card" />&nbsp;用户管理{this.props.role === 'superuser'?'':'（非管理员只能看到自己）'}</h5>
                                                <div style={{ overflow: 'auto', height: '300px', border: '1px solid #c3c3c3', margin: '0 0 10px 0' }}>
                                                        <table className="table-striped" >
                                                                <thead>
                                                                        <tr>
                                                                                <th>学号</th>
                                                                                <th>姓名</th>
                                                                                <th>管理员权限</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        {
                                                                                accessList.map(v => (
                                                                                        <tr key={v.code}>
                                                                                                <td>{v.code}</td>
                                                                                                <td>{v.name}</td>
                                                                                                <td><input type="checkbox" checked={v.role === 'superuser'} onChange={this.userChange.bind(this, v.userid)}/></td>
                                                                                        </tr>
                                                                                ))
                                                                        }


                                                                </tbody>
                                                        </table>
                                                </div>
                                                <div className="form-actions" >
                                                        <Button type="submit" ptStyle="btn-primary btn-large" text="刷新列表" onClick={this.props.handleRefreshState.bind(this)}/>
                                                </div>
                                        </div>
                                </div>

                        </Pane>
                );
        }
}



const mapStateToProps = (state) => {
        return state.rdsInfo;
};

const mapDispatchToProps = (dispatch) => {
        return {
                handleChangePswd(pswd) {
                        dispatch(changePswd(pswd));
                },
                handleExportFile(type, from, to, users) {
                        dispatch(exportFile(type, from, to, users));
                },
                handleCreateUser(code, name, email) {
                        dispatch(createUser(code, name, email));
                },
                handleRefreshState(){
                        dispatch(refreshState());
                },
                handleChangeUser(userid, superuser){
                        dispatch(changeUser(userid, superuser));
                }
        };
};



export default connect(
        mapStateToProps,
        mapDispatchToProps
)(About);
