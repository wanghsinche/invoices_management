import React from 'react';
import { Pane,  Toolbar, Actionbar, Button, CheckBox} from "../photon/photon";
import Tbody from './tbody';
import Page from './page';
import Detail from './detail';
const App = ({}) => {
    return (
        <div className="pane" style={{overflow:'hidden'}}>
            <div >
                <Toolbar>
                    <Actionbar>
                        <Button ptStyle="btn-dropdown btn-default" glyph="user"/>
                        <Button ptStyle="btn-dropdown btn-default" glyph="clock"/>
                        <Button ptStyle="btn-dropdown btn-default" glyph="newspaper" text="invoice"/>
                        <Page style={{float:'right'}}/>
                    </Actionbar>
                </Toolbar >
            </div>
            <div style={{overflow:'auto',height:'320px'}}>
                <table className="table-striped" >
                    <thead>
                        <tr>
                            <th>发票状态</th>
                            <th>编号</th>
                            <th>名称</th>
                            <th>总金额</th>
                            <th>用户</th>
                            <th>发票号码</th>
                            <th>日期</th>
                        </tr>
                    </thead>
                    <Tbody />
                </table>
            </div>
            <Detail/>
        </div>

    );
};





export default App;

