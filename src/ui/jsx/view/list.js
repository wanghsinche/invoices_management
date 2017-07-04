import React from 'react';
import { Pane  } from "../photon/photon";
import Tbody from './tbody';

const App = ({}) => {
    return (
        <Pane className="">
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
        </Pane>
    );
};





export default App;

