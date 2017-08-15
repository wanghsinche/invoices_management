import React, { Component, PropTypes} from 'react';
import { Window, Toolbar, Content, Icon } from '../photon/photon';
import {getDetail} from '../redux/action';
import {connect} from 'react-redux';
import moment from 'moment';
const Record = ( {name, user, date,recid, code, priceall, seeDetail})=>(
    <tr onClick={()=>{
        seeDetail(recid);}} >
        <td style={{textAlign:'center'}}><Icon glyph="record" style={code?{color:'#34c84a'}:{color:'#fdbc40'}}/></td>
         <td>{recid}</td>
         <td>{name}</td>
         <td>{priceall}</td>
         <td>{user}</td>
         <td>{code}</td>
         <td>{moment(date).format('YYYY/MM/DD')}</td>
    </tr>
);

const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        seeDetail: (recid) => {
            dispatch(getDetail(recid));
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Record);


                            