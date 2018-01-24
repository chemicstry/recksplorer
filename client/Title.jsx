import React from 'react';
import AppStyles from './App.css';
import { FormatCapacity } from './Utils.js';
import { observer } from 'mobx-react';

var styles = {
    container:{
        padding: '5px',
        fontSize: '14px',
        backgroundColor: '#891AFF',
        color: '#FFFFFF'
    }
}

@observer
export default class Title extends React.Component {
    render() {
        return (
        <div style={styles.container}>
            {this.props.children}
        </div>
        );
    }
}
