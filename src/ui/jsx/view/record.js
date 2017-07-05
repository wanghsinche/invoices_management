import React, { Component, PropTypes} from 'react';
import { Window, Toolbar, Content, Icon } from '../photon/photon';
import {setCurrentAction} from '../redux/action';
import {connect} from 'react-redux';
const Record = ( {done,ordid,usrid,invsid,recid,seeDetail})=>(
    <tr onClick={()=>{
        seeDetail({done,ordid,usrid,invsid,recid});}} >
        <td style={{textAlign:'center'}}><Icon glyph="record" style={done?{color:'#34c84a'}:{color:'#fdbc40'}}/></td>
         <td>{ordid}</td>
         <td>{usrid}</td>
         <td>{invsid}</td>
         <td>{recid}</td>
    </tr>
);
Record.propTypes = {
  done: PropTypes.bool.isRequired,
  ordid: PropTypes.string.isRequired,
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


