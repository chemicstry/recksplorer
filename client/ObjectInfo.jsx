import React from 'react';
import styles from './ObjectInfo.css';

export default class ObjectInfo extends React.Component {
    render() {
        return (
        <div className={styles.container}>
            <table className={styles.table}>
                {this.props.children}
            </table>
        </div>
        );
    }
}
