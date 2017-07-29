import React, { Component, PropTypes} from 'react';
import { Window, Toolbar, Content, Icon } from '../photon/photon';
import {setCurrentAction} from '../redux/action';
import {connect} from 'react-redux';
const Record = ( {name, goodid,usrid,invsid,recid,markid,seeDetail})=>(
    <tr onClick={()=>{
        seeDetail({goodid,usrid,invsid,recid,markid});}} >
        <td style={{textAlign:'center'}}><Icon glyph="record" style={invsid.trim()!==''?{color:'#34c84a'}:{color:'#fdbc40'}}/></td>
         <td>{name}</td>
         <td>{usrid}</td>
         <td>{invsid}</td>
         <td>{recid}</td>
    </tr>
);
Record.propTypes = {
  goodid: PropTypes.string.isRequired,
  usrid: PropTypes.string.isRequired,
  invsid: PropTypes.string.isRequired,
  recid: PropTypes.string.isRequired
};
const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        seeDetail: (record) => {
            dispatch(setCurrentAction(record));
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Record);


