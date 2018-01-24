import React from 'react';
import Graph from 'vis-react';
import { ObjectTypes } from './DataStore.js';
import { computed, autorun } from 'mobx';
import { observer } from 'mobx-react';

import FontAwesome from 'react-fontawesome';
import FA from 'font-awesome/css/font-awesome.css';

var styles = {
    container: {
        width: '100vw',
        height: '100vh'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}

@observer
export default class VisGraphMap extends React.Component {
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
            },
            // Called when initial stabilization is complete
            stabilizationIterationsDone: (event) => {
                this.setState({
                    loading: false
                });
            }
        },
        loading: true
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
                    border: data.nodes[i].color,
                    highlight: {
                        border: data.nodes[i].color
                    }
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
                color: {
                    inherit:'both'
                }
            });
        }

        // Notify that graph changed and will need to be restabilised
        this.graphChanged = true;
        this.setState({
            loading: true
        });

        return graph;
    }

    getNetwork(network)
    {
        this.network = network;
    }

    componentDidMount()
    {
        this.selectObserver = autorun(() => {
            var object = this.props.store.selectedObjectData;

            if (!this.network || !object)
                return;

            if (object.type == ObjectTypes.NODE)
            {
                this.network.selectNodes([object.pub_key]);
            }
            else
            {
                this.network.setSelection({
                    nodes: [object.node1_pub, object.node2_pub],
                    edges: [object.channel_id]
                }, {
                    highlightEdges: false
                });
            }
        });
    }

    componentWillUnmount() {
        // Stop observer
        this.selectObserver();
    }

    componentDidUpdate(prevProps, prevState) {
        // Stabilize if graph changed
        if (this.network && this.graphChanged)
        {
            this.network.stabilize();
            this.graphChanged = false;
        }
    }

    render() {
        return (
            <div style={styles.container}>
                <Graph graph={this.graphData} options={this.state.options} events={this.state.events} getNetwork={(network) => this.getNetwork(network)} />
                { this.state.loading ? (
                <div style={styles.overlay}>
                    <FontAwesome name='spinner' pulse size='2x' cssModule={FA} />
                </div>
                ) : '' }
            </div>
        );
    }
}
