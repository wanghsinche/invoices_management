import React, { Component, PropTypes} from 'react';
import { Window, Toolbar, Content } from "react-photonkit";
const About = ()=>(
        <Window>
            <Toolbar title="about" ptType="head"/>
            <Content>
                about
            </Content>
        </Window>
);


export default About;
