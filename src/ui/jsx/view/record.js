import React, { Component, PropTypes} from 'react';
import { Window, Toolbar, Content } from "react-photonkit";
const Record = ( {ordid,usrid,invsid,recid})=>(
    <tr onClick={()=>{
      location.hash="#/About";}} >
         <td>{ordid}</td>
         <td>{usrid}</td>
         <td>{invsid}</td>
         <td>{recid}</td>
    </tr>
);
Record.propTypes = {
  ordid: PropTypes.string.isRequired,
  usrid: PropTypes.string.isRequired,
  invsid: PropTypes.string.isRequired,
  recid: PropTypes.string.isRequired
};

export default Record;
