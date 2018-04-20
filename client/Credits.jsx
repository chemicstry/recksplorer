import React from 'react';
import AppStyles from './App.css';
import LNTips from './LNTips.jsx';

var styles = {
    container:{
        padding: '5px',
        fontSize: '11px',
        backgroundColor: '#FFFFFF'
    },
}

export default class Credits extends React.Component {
    render() {
        return (
        <div style={styles.container}>
            <table className={AppStyles.datatable}>
                <tbody>
                    <tr>
                        <td>Author:</td>
                        <td><a href="https://github.com/chemicstry/recksplorer" target="_blank">chemicstry</a></td>
                    </tr>
                    <tr>
                        <td>LTC customization:</td>
                        <td><a href="https://github.com/Jasonhcwong/recksplorer" target="_blank">JasonWong</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
        );
    }
}
