import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Icon } from "react-photonkit";
const itStyle = {
    position: "fixed",
    top: "40%",
    left: "45%",
    "fontSize": "50px",
    "zIndex": 99, animation: "2s rotate linear infinite"
};
class Loading extends Component {

    render() {
        return (<Icon glyph="arrows-ccw" style={itStyle} />);
    }
}

Loading.propTypes = {
};

const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export { Loading };
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(loading);

