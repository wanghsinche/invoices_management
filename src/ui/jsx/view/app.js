require('../../css/ui.css');
import React from 'react';
import { Window, Toolbar, Content } from "react-photonkit";
import { connect } from 'react-redux';
import Record from './record';
import AddBtn from './addbtn';
const App = ({recordHash}) => {
    let recordls = [], recid, tmp, empty;
    for (recid in recordHash){
        if(recordHash.hasOwnProperty(recid)){
            tmp = recordHash[recid];
            recordls.push(
                <Record key={recid} ordid={tmp.ordid} usrid={tmp.usrid} invsid={tmp.invsid} recid={tmp.recid} />
            );
        }
    }

    if(recordls.length === 0){
        empty = (<tr><td>empty</td><td>empty</td><td>empty</td><td>empty</td></tr>);
    }
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
                    <tbody>
                        {empty||recordls}
                    </tbody>
                </table>
            </Content>
            <Toolbar ptType="footer">
                <AddBtn text="add1" usrid="wxz"/>
                <AddBtn text="add2" usrid="ggo"/>
                <AddBtn text="add3" usrid="seg"/>
                <AddBtn text="add4" usrid="cpp"/>
            </Toolbar>
        </Window>
    );    
};

const mapStateToProps = (state) => {
    return {
        recordHash: state.rdsRecords
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

