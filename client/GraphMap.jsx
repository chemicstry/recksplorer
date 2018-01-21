import React from 'react';
import Graph from 'vis-react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class App extends React.Component {
    state = {
        options: {
            physics: {
                solver: 'forceAtlas2Based',
                stabilization: false
            },
            interaction: {
                hover: true
            },
            edges: {
                smooth: true,
                arrows: {
                    to: false,
                    from: false
                }
            },
            nodes: {
                shape: 'box',
                color: {
                    background: '#FFFFFF'
                }
            }
        },
        events: {
            select: (event) => {
                if (event.nodes.length)
                    this.props.store.selectObject(event.nodes[0]);
                else if (event.edges.length)
                    this.props.store.selectObject(event.edges[0]);
                else
                    this.props.store.selectObject(undefined);
            }
        }
    };

    // Transforms network data into vis.js data format
    @computed get graphData()
    {
        var graph = {
            nodes: [],
            edges: []
        };

        var data = this.props.store.networkData;
    
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
        }
    
        for (var i = 0; i < data.edges.length; i++)
        {
            graph.edges.push({
                id: data.edges[i].channel_id,
                to: data.edges[i].node1_pub,
                from: data.edges[i].node2_pub,
                width: Math.log(data.edges[i].capacity)/6,
                color: {inherit:'both'}
            });
        }

        return graph;
    }

    getNetwork(network)
    {
        this.network = network;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.network)
        {
            setTimeout(() => this.network.fit(), 500);
        }
    }

    render() {
        return (
            <Graph graph={this.graphData} options={this.state.options} events={this.state.events} getNetwork={(network) => this.getNetwork(network)} />
        );
    }
}
