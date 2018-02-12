import React from 'react';
import { Graph } from 'vivagraphjs';
import { ObjectTypes } from './DataStore.js';
import { computed, autorun } from 'mobx';
import { observer } from 'mobx-react';
import mapstyles from './VivaGraphMap.css';
import escape from 'escape-html';

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

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function getVivaLinkID(node1_pub, node2_pub)
{
    // Channel ID format of VivaChartJS
    return node1_pub + '👉 ' + node2_pub;
}

@observer
export default class VivaGraphMap extends React.Component {
    state = {
        loading: false
    };

    updateData(data)
    {
        var positions = data.pos;

        // Indexes nodes by pubkey
        this.nodeIndex = [];

        for (var i = 0; i < data.nodes.length; i++)
        {
            // remove nulls and html chars
            var label = data.nodes[i].alias.replace(/\0/g, '').substring(0, 16);

            // Precalculated position on server side
            var pos = {
                x: positions[i][0],
                y: positions[i][1]
            }

            this.graph.addNode(data.nodes[i].pub_key, {
                label: label,
                color: data.nodes[i].color,
                pos: pos
            });

            if (this.props.physics)
                this.layout.setNodePosition(data.nodes[i].pub_key, pos.x, pos.y);

            this.nodeIndex[data.nodes[i].pub_key] = data.nodes[i];
        }

        // Index channels by node id
        this.channelsByNode = [];

        for (var i = 0; i < data.edges.length; i++)
        {
            // Channel ID format of VivaChartJS
            var id = getVivaLinkID(data.edges[i].node1_pub, data.edges[i].node2_pub);

            this.graph.addLink(data.edges[i].node1_pub, data.edges[i].node2_pub, {
                channel_id: data.edges[i].channel_id,
                node1_pub: data.edges[i].node1_pub,
                node2_pub: data.edges[i].node2_pub
            });

            if (!this.channelsByNode[data.edges[i].node1_pub])
                this.channelsByNode[data.edges[i].node1_pub] = [];

            this.channelsByNode[data.edges[i].node1_pub].push(id);

            if (!this.channelsByNode[data.edges[i].node2_pub])
                this.channelsByNode[data.edges[i].node2_pub] = [];

            this.channelsByNode[data.edges[i].node2_pub].push(id);
        }
    }

    startSelectionObserver()
    {
        // Selection handler
        this.selectObserver = autorun(() => {
            // Remove previous selection
            if (this.prevSelection)
            {
                if (this.prevSelection.type == ObjectTypes.NODE)
                {
                    // Remove node highlight
                    this.graphics.getNodeUI(this.prevSelection.pub_key).children[0].classList.remove(mapstyles.selected);

                    // Remove link highligth
                    if (this.channelsByNode[this.prevSelection.pub_key])
                    {
                        this.channelsByNode[this.prevSelection.pub_key].forEach((link) => {
                            this.graphics.getLinkUI(link).children[0].classList.remove(mapstyles.selected);
                            this.graphics.getLinkUI(link).children[1].classList.remove(mapstyles.selected);
                        });
                    }
                }
                else // channel
                {
                    var linkid = getVivaLinkID(this.prevSelection.node1_pub, this.prevSelection.node2_pub);

                    // Remove link highlight
                    this.graphics.getLinkUI(linkid).children[0].classList.remove(mapstyles.selected);
                    this.graphics.getLinkUI(linkid).children[1].classList.remove(mapstyles.selected);

                    // Remove node highlight
                    this.graphics.getNodeUI(this.prevSelection.node1_pub).children[0].classList.remove(mapstyles.selected);
                    this.graphics.getNodeUI(this.prevSelection.node2_pub).children[0].classList.remove(mapstyles.selected);
                }
            }

            // Fetch new selection from store
            var object = this.props.store.selectedObjectData;

            if (object)
            {
                if (object.type == ObjectTypes.NODE)
                {
                    // Add node highlight
                    this.graphics.getNodeUI(object.pub_key).children[0].classList.add(mapstyles.selected);

                    if (this.channelsByNode[object.pub_key])
                    {
                        this.channelsByNode[object.pub_key].forEach((link) => {
                            // Add link highlight
                            this.graphics.getLinkUI(link).children[0].classList.add(mapstyles.selected);
                            this.graphics.getLinkUI(link).children[1].classList.add(mapstyles.selected);
                        });
                    }

                    // Center graph if selection was not triggered by map
                    if (this.props.store.selectedObject.source != 'map')
                    {
                        var pos = this.layout.getNodePosition(object.pub_key);
                        this.renderer.moveTo(pos.x, pos.y);
                    }
                }
                else // channel
                {
                    var linkid = getVivaLinkID(object.node1_pub, object.node2_pub);

                    // Add link highlight
                    this.graphics.getLinkUI(linkid).children[0].classList.add(mapstyles.selected);
                    this.graphics.getLinkUI(linkid).children[1].classList.add(mapstyles.selected);

                    // Add node highlight
                    this.graphics.getNodeUI(object.node1_pub).children[0].classList.add(mapstyles.selected);
                    this.graphics.getNodeUI(object.node2_pub).children[0].classList.add(mapstyles.selected);

                    // Center graph if selection was not triggered by map
                    if (this.props.store.selectedObject.source != 'map')
                    {
                        var pos = this.layout.getLinkPosition(linkid);
                        this.renderer.moveTo((pos.from.x+pos.to.x)/2, (pos.from.y+pos.to.y)/2);
                    }
                }
            }

            this.prevSelection = object;

            // Hide other nodes/channels if something is selected
            if (object)
                this.graphics.getSvgRoot().classList.add(mapstyles.hide);
            else
                this.graphics.getSvgRoot().classList.remove(mapstyles.hide);
        });
    }

    componentDidMount()
    {
        this.graph = new Graph.graph();

        // Use SVG graphics engine
        this.graphics = Graph.View.svgGraphics();

        // Describe node appearance
        this.graphics.node((node) => {
            var width = getTextWidth(node.data.label, '7px Roboto');
            var boxWidth = width+4;

            var rect = Graph.svg('rect', {
                width: boxWidth,
                height: 10,
                rx: 2,
                ry: 2,
                x: -boxWidth/2,
                y: -6,
                stroke: node.data.color,
                class: mapstyles.node
            });

            var text = Graph.svg('text', {
                class: mapstyles.nodelabel,
                y: 2
            });

            // Add text
            text.innerHTML = escape(node.data.label);

            // Group everything
            var g = Graph.svg('g');
            g.append(rect);
            g.append(text);

            g.addEventListener('click', (e) => {
                this.props.store.selectObject(node.id, 'map');

                // Prevent propagation to base container (unselect event)
                e.stopPropagation();
            });

            return g;
        }).placeNode((nodeUI, pos) => {
            // Move object group
            nodeUI.attr('transform', `translate(${pos.x},${pos.y})`);
        });

        // Decribe channel appearance
        this.graphics.link((link) => {
            // Create 2 lines with node colors
            var line1 = Graph.svg("line", {
                stroke: this.nodeIndex[link.data.node1_pub].color,
                class: mapstyles.link
            });
            var line2 = Graph.svg("line", {
                stroke: this.nodeIndex[link.data.node2_pub].color,
                class: mapstyles.link
            });

            // Group
            var g = Graph.svg('g');
            g.append(line1);
            g.append(line2);
            g.addEventListener('click', (e) => {
                this.props.store.selectObject(link.data.channel_id, 'map');
                e.stopPropagation();
            });
            return g;
        }).placeLink((linkUI, fromPos, toPos) => {
            // Split lines on midpoint
            var midpoint = {
                x: (fromPos.x+toPos.x)/2,
                y: (fromPos.y+toPos.y)/2
            }
            linkUI.children[0].attr("x1", fromPos.x)
                              .attr("y1", fromPos.y)
                              .attr("x2", midpoint.x)
                              .attr("y2", midpoint.y);
            linkUI.children[1].attr("x1", midpoint.x)
                              .attr("y1", midpoint.y)
                              .attr("x2", toPos.x)
                              .attr("y2", toPos.y);
        });;

        if (this.props.physics)
        {
            this.layout = Graph.Layout.forceDirected(this.graph, {
                springLength: 300,
                springCoeff: 0.00002
            });
        }
        else
        {
            this.layout = Graph.Layout.constant(this.graph);

            this.layout.placeNode((node) => {
                return node.data.pos;
            });
        }

        // Clicking on background removes selection (except when draging)
        var dragFlag;
        this.mount.addEventListener('mousedown', () => {
            dragFlag = false;
        });
        this.mount.addEventListener('mousemove', () => {
            dragFlag = true;
        });
        this.mount.addEventListener('mouseup', () => {
            if (!dragFlag)
                this.props.store.selectObject(undefined, 'map');
        });

        this.renderer = Graph.View.renderer(this.graph, {
            graphics: this.graphics,
            container: this.mount,
            layout: this.layout
        });

        this.renderer.run();

        // Start observing new network data
        this.dataObserver = autorun(() => {
            this.props.store.networkData;

            // Pause rendering (to prevent re-render on each new node/link)
            this.renderer.pause();

            // Update data
            this.updateData(this.props.store.networkData);

            // Resume rendering
            this.renderer.resume();

            if (!this.selectObserver)
                this.startSelectionObserver();
        });
    }

    componentWillUnmount() {
        if (this.dataObserver)
            this.dataObserver();

        if (this.selectObserver)
            this.selectObserver();

        if (this.renderer)
            this.renderer.dispose();
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.container} ref={(mount) => { this.mount = mount }} />
                { this.state.loading ? (
                <div style={styles.overlay}>
                    <FontAwesome name='spinner' pulse size='2x' cssModule={FA} />
                </div>
                ) : '' }
            </div>
        );
    }
}
