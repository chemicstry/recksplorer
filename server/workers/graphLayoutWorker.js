const Graph = require('ngraph.graph');
const ForceLayout = require('ngraph.forcelayout');

module.exports = function(input, done)
{
    var graph = new Graph();

    input.nodes.forEach((node) => graph.addNode(node.pub_key));
    input.edges.forEach((edge) => graph.addLink(edge.node1_pub, edge.node2_pub));

    var layout = ForceLayout(graph, {
        springLength: 300,
        springCoeff: 0.00002
    });

    const iterations = 10000;
    const progressReportInterval = 10; // in %

    // Do layout
    for (var step = 0; step < iterations; ++step)
    {
        layout.step();

        if (step % parseInt(iterations / progressReportInterval) == 0)
            console.log(`Layout: ${parseInt(step * 100 / iterations)}%`);
    }

    var result = [];

    // Save results
    graph.forEachNode((node) => {
        var pos = layout.getNodePosition(node.id);
        result.push([parseInt(pos.x), parseInt(pos.y)]);
    });

    done(result);
}
