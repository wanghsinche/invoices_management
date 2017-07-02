require('../../css/ui.css');
import React from 'react';
import { Window, Toolbar, Content,Actionbar, Button } from "react-photonkit";
import { connect } from 'react-redux';
import Record from './record';
import AddBtn from './addbtn';
import Tbody from './tbody';
import {Loading} from './modal';
import Page from './page';
import {requestStatus} from '../redux/action';
const App = ({loadingProps}) => {
    return (
        <Window>
            <Toolbar title="table" />
            <Content>
                <table className="table-striped">
                    <thead>
                        <tr>
                            <th>ordid</th>
                            <th>usrid</th>
                            <th>invsid</th>
                            <th>recid</th>
                        </tr>
                    </thead>
                    <Tbody />
                </table>
            </Content>
            <Page />
            {loadingProps&&<Loading />}
            <Toolbar ptType="footer">
                <Actionbar>
                    <AddBtn text="add1" usrid="wxz" />
                    <AddBtn text="add2" usrid="ggo" />
                    <AddBtn text="add3" usrid="seg" />
                    <AddBtn text="add4" usrid="cpp" />
                    
                </Actionbar>
            </Toolbar>
        </Window>
    );
};

const mapStateToProps = (state) => {
    return {
        loadingProps:  state.rdsAsync.status === requestStatus.REQUEST
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

const cntApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);


export default cntApp;

