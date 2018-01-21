import React from 'react';
import Graph from 'vis-react';
import { actionCreators } from '../AppRedux';

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
                    this.props.store.dispatch(actionCreators.selectObject(event.nodes[0]));
                else if (event.edges.length)
                    this.props.store.dispatch(actionCreators.selectObject(event.edges[0]));
                else
                    this.props.store.dispatch(actionCreators.deselectObject());
            }
        }
    };

    componentWillMount() {
        const {store} = this.props
    
        const {data} = store.getState()
        this.setState({data})
    
        this.unsubscribe = store.subscribe(() => {
            const {data} = store.getState()
            this.setState({data})
        })
    }

    getNetwork(network)
    {
        this.network = network;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.network)
            this.network.stabilize();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.data != nextState.data)
        {
            return true;
            console.log('redraw');
        }
        
        return false;
    }

    render() {
        return (
            <Graph graph={this.state.data} options={this.state.options} events={this.state.events} getNetwork={(network) => this.getNetwork(network)} />
        );
    }
}
