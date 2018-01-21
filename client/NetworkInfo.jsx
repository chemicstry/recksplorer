import React from 'react';

var styles = {
    container:{
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '5px',
        fontSize: '11px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #891AFF',
        borderRight: '1px solid #891AFF'
    }
}

export default class NetworkInfo extends React.Component {
    render() {
        return (
        <div className={styles.container}>
        </div>
        );
    }
}
