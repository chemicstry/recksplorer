import React from 'react';
import AppStyles from './App.css';

var styles = {
    container:{
        padding: '5px',
        fontSize: '11px',
        backgroundColor: '#FFFFFF'
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
