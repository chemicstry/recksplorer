import React from 'react';
import AppStyles from './App.css';
import { FormatCapacity } from './Utils.js';
import { observer } from 'mobx-react';

var styles = {
    container:{
        padding: '5px',
        fontSize: '11px',
        backgroundColor: '#FFFFFF'
    },
    tiny: {
        fontSize: '9px'
    }
}

@observer
export default class NetworkInfo extends React.Component {
    render() {
        const store = this.props.store;

        return (
        <div style={styles.container}>
            <table className={AppStyles.datatable}>
                <tbody>
                    <tr>
                        <td>Nodes</td>
                        <td>{store.nodeCount}</td>
                    </tr>
                    <tr>
                        <td>Channels</td>
                        <td>{store.channelCount}</td>
                    </tr>
                    <tr>
                        <td>Total Capacity</td>
                        <td>{FormatCapacity(store.totalCapacity, store.usdbtc)}</td>
                    </tr>
                    <tr>
                        <td>Total Fees</td>
                        <td style={styles.tiny}>too tiny</td>
                    </tr>
                </tbody>
            </table>
        </div>
        );
    }
}
