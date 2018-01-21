import React from 'react';
import AppStyles from './App.css';

var styles = {
    container:{
        position: 'fixed',
        bottom: 0,
        left: 0,
        padding: '5px',
        fontSize: '11px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #891AFF',
        borderRight: '1px solid #891AFF'
    }
}

export default class ObjectInfo extends React.Component {
    render() {
        return (
        <div style={styles.container}>
            <table className={AppStyles.datatable}>
                {this.props.children}
            </table>
        </div>
        );
    }
}
