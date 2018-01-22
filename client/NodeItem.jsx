import React from 'react';
import FontAwesome from 'react-fontawesome';

export default class NodeItem extends React.Component {
    render() {
        return (
            <li>
                <FontAwesome name='circle' />
                <a href="javascript:void(0)" onClick={this.props.onClick}>{this.props.data.pub_key.substring(0,18)}</a>
            </li>
        );
    }
}
