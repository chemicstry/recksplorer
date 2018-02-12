import React from 'react';
import FontAwesome from 'react-fontawesome';
import FA from 'font-awesome/css/font-awesome.css';

var styles = {
    container:{
        padding: '5px',
        fontSize: '11px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #891AFF'
    },
    input: {
        width: '100%',
        boxSizing: 'border-box'
    },
    results: {
        maxHeight: '400px',
        overflowY: 'scroll'
    },
    ul: {
        listStyleType: 'none',
        padding: 0
    },
    li: {
        padding: '5px',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#EEE'
        }
    },
    text: {
        paddingLeft: '10px'
    }
}

class NodeItem extends React.Component {
    render() {
        return (
            <li style={styles.li} onClick={this.props.onClick}>
                <FontAwesome name='circle' cssModule={FA} />
                <span style={styles.text}>{this.props.data.alias.replace(/\0/g, '').substring(0, 18)}</span>
            </li>
        );
    }
}

class ChannelItem extends React.Component {
    render() {
        return (
            <li style={styles.li} onClick={this.props.onClick}>
                <FontAwesome name='link' cssModule={FA} />
                <span style={styles.text}>{this.props.data.channel_id}</span>
            </li>
        );
    }
}

export default class Search extends React.Component {
    state = {
        searchText: '',
        results: []
    }

    onSearchTextChange(event)
    {
        const store = this.props.store;
        const value = event.target.value.toUpperCase();

        if (!value.length)
        {
            this.setState({
                searchText: value,
                results: []
            });

            return;
        }

        var nodes = store.networkData.nodes.filter(node => {
            return node.pub_key.toUpperCase().includes(value) || node.alias.toUpperCase().includes(value) || (node.addresses.length && node.addresses[0].addr.toUpperCase().includes(value));
        });

        var channels = store.networkData.edges.filter(edge => {
            return edge.channel_id.toUpperCase().includes(value) || edge.chan_point.toUpperCase().includes(value);
        });

        var results = [
            ...nodes,
            ...channels
        ];

        this.setState({
            searchText: value,
            results: results
        });
    }

    onClickItem(item)
    {
        this.props.store.selectObject(item, 'search');
    }

    render() {
        const results = this.state.results.map((item) => {
            if (item.pub_key)
                return <NodeItem key={item.pub_key} data={item} onClick={event => this.onClickItem(item.pub_key)} />;
            else
                return <ChannelItem key={item.channel_id} data={item} onClick={event => this.onClickItem(item.channel_id)} />;
        });

        return (
        <div style={styles.container}>
            <input type="text" placeholder="Search" onChange={event => this.onSearchTextChange(event)} style={styles.input} />
            { results.length ? (
                <div style={styles.results}>
                    <ul style={styles.ul}>
                        {results}
                    </ul>
                </div>
            ) : ('')}
        </div>
        );
    }
}
