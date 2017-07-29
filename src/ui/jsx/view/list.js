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
                            <th>done</th>
                            <th>name</th>
                            <th>usrid</th>
                            <th>invsid</th>
                            <th>recid</th>
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

