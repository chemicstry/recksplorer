import React from 'react';
import moment from 'moment';

export default class NodeInfo extends React.Component {
    render() {
        var node = this.props.data;

        var uri = 'unknown';
        if (node.addresses.length)
            uri = node.pub_key + '@' + node.addresses[0].addr;

        return (
            <tbody>
                <tr>
                    <td>PubKey</td>
                    <td>{node.pub_key}</td>
                </tr>
                <tr>
                    <td>Alias</td>
                    <td>{node.alias.replace(/\0/g, '')}</td>
                </tr>
                <tr>
                    <td>URI</td>
                    <td>{uri}</td>
                </tr>
                <tr>
                    <td>Last Update</td>
                    <td>{moment(node.last_update*1000).format('MMMM Do YYYY, h:mm:ss a')}</td>
                </tr>
                <tr>
                    <td>Color</td>
                    <td>{node.color}</td>
                </tr>
            </tbody>
        );
    }
}
