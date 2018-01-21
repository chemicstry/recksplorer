import React from 'react';
import GraphMap from './components/GraphMap.jsx';
import ObjectInfo from './components/ObjectInfo.jsx';
import NodeInfo from './components/NodeInfo.jsx';
import ChannelInfo from './components/ChannelInfo.jsx';
import { actionCreators } from './AppRedux';
import Axios from 'axios';
import styles from './App.css';
import 'typeface-roboto';

const ObjectTypes = {
    NODE: 'NODE',
    CHANNEL: 'CHANNEL'
}

function GetObjectType(object)
{
    // Node pubkey is 66 chars
    if (object.length == 66)
        return ObjectTypes.NODE;
    else
        return ObjectTypes.CHANNEL;
}

function makeGraph(data)
{
    var graph = {
        nodes: [],
        edges: [],
        nodeindex: [],
        edgeindex: []
    };

    for (var i = 0; i < data.nodes.length; i++)
    {
        var label = data.nodes[i].alias.replace(/\0/g, '').substring(0, 16);
        
        graph.nodes.push({
            id: data.nodes[i].pub_key,
            label: label,
            color: {
                border: data.nodes[i].color
            }
        });

        graph.nodeindex[data.nodes[i].pub_key] = data.nodes[i];
    }

    // Build array of channels for vis.js
    var capacity = 0;
    for (var i = 0; i < data.edges.length; i++)
    {
        capacity += parseInt(data.edges[i].capacity);
        graph.edges.push({
            id: data.edges[i].channel_id,
            to: data.edges[i].node1_pub,
            from: data.edges[i].node2_pub,
            width: Math.log(data.edges[i].capacity)/6,
            color: {inherit:'both'}
        });

        graph.edgeindex[data.edges[i].channel_id] = data.edges[i];
    }

    return graph;
}

export default class App extends React.Component {
    state = {}

    componentWillMount() {
        const {store} = this.props
    
        const {selectedObject,data} = store.getState()
        this.setState({selectedObject,data})
    
        this.unsubscribe = store.subscribe(() => {
            const {selectedObject,data} = store.getState()
            this.setState({selectedObject,data})
        })
    }

    componentDidMount() {
        this.serverRequest = Axios.get('/networkgraph')
            .then((result) => {
                this.props.store.dispatch(actionCreators.updateData(makeGraph(result.data)));
                console.log('updated');
            });
    }

    render() {
        return (
        <div className={styles.app}>
            <div className={styles.map}>
                <GraphMap store={this.props.store}/>
            </div>

            {this.state.selectedObject ? (
                <ObjectInfo>
                    {GetObjectType(this.state.selectedObject) == ObjectTypes.NODE ? (
                        <NodeInfo data={this.state.data.nodeindex[this.state.selectedObject]} />
                    ) : (
                        <ChannelInfo data={this.state.data.edgeindex[this.state.selectedObject]} />
                    )}
                </ObjectInfo>
            ) : ''}
        </div>
        );
    }
}
