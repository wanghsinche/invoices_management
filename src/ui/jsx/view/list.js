import React from 'react';
import { Pane  } from "../photon/photon";
import Tbody from './tbody';
import Page from './page';
const App = ({}) => {
    return (
        <Pane className="padded-more">
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
            <Page />
        </Pane>
    );
};





export default App;

