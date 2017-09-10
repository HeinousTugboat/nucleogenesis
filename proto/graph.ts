// Reference: https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811

interface Reaction {
    reactant: {
        [element: string]: number
    },
    product: {
        [element: string]: number
    },
    elements: string[];
}

interface BaseNode {
    id: string;
    group: number;
    label: string;
    level: number;
}

interface BaseLink {
    target: string;
    source: string;
    strength: number;

}

let reactions = require('../build/data/reactions.json');

let reactSet = new Set;
let moleSet = new Set;

for (let reaction in reactions) {
    reactSet.add(reaction);
    for(let mole in reactions[reaction].reactant) {
        moleSet.add(mole);
    }
    for(let mole in reactions[reaction].product) {
        moleSet.add(mole);
    }
}

console.log(reactSet.size);
console.log(moleSet.size);

const baseNodes: BaseNode[] = []
const baseLinks: BaseLink[] = []


for (let mole of moleSet) {
    let node: BaseNode = {} as BaseNode;
    node.id = mole;
    node.label = mole;
    node.group = 0;
    node.level = 1;
    baseNodes.push(node);
}

for (let reaction of reactSet) {
    let rxn: Reaction = reactions[reaction];
    let node: BaseNode = {} as BaseNode;
    node.id = reaction;
    node.label = reaction;
    node.group = 0;
    node.level = 1;
    baseNodes.push(node);
    for (let reactant in rxn.reactant) {
        let link: BaseLink = {} as BaseLink;
        link.source = reactant;
        link.target = reaction;
        link.strength = 1;
        baseLinks.push(link);
    }
    for (let product in rxn.product) {
        let link: BaseLink = {} as BaseLink;
        link.source = reaction;
        link.target = product;
        link.strength = 10;
        baseLinks.push(link);
    }
}

console.log(baseNodes.length);
console.log(baseLinks.length);

const fs = require('fs');
const nodesPath = './proto/nodes.json';
const linksPath = './proto/links.json';

fs.writeFile(nodesPath, JSON.stringify(baseNodes), 'utf8', (err)=> {
    if (err) {
        return console.error(err);
    }
    console.log('Nodes saved!');
});

fs.writeFile(linksPath, JSON.stringify(baseLinks), 'utf8', (err)=> {
    if (err) {
        return console.error(err);
    }
    console.log('Links saved!');
});

// var baseLinks = [
//     { "target": "element", "source": "H", "strength": 0.5 },
//     { "target": "element", "source": "O", "strength": 0.5 },
//     { "target": "molecule", "source": "H2", "strength": 0.5 },
//     { "target": "molecule", "source": "H2O", "strength": 0.5 },
//     { "target": "molecule", "source": "HO", "strength": 0.5 },
//     { "target": "reaction", "source": "H.H-H2", "strength": 0.5 },
//     { "target": "reaction", "source": "H.H2O-H2.HO", "strength": 0.5 },
//     { target: "H.H-H2", source: "H", strength: 0.05 },
//     { target: "H2", source: "H.H-H2", strength: 0.05 },
//     { target: "H.H2O-H2.HO", source: "H", strength: 0.05 },
//     { target: "H.H2O-H2.HO", source: "H2O", strength: 0.05 },
//     { target: "H2", source: "H.H2O-H2.HO", strength: 0.05 },
//     { target: "HO", source: "H.H2O-H2.HO", strength: 0.05 }
// ]

var nodes = [...baseNodes]
var links = [...baseLinks]

// function getNeighbors(node) {
//   return baseLinks.reduce(function (neighbors, link) {
//       if (link.target.id === node.id) {
//         neighbors.push(link.source.id)
//       } else if (link.source.id === node.id) {
//         neighbors.push(link.target.id)
//       }
//       return neighbors
//     },
//     [node.id]
//   )
// }

// function isNeighborLink(node, link) {
//   return link.target.id === node.id || link.source.id === node.id
// }


// function getNodeColor(node, neighbors) {
//   if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
//     return node.level === 1 ? 'blue' : 'green'
//   }

//   return node.level === 1 ? 'red' : 'gray'
// }


// function getLinkColor(node, link) {
//   return isNeighborLink(node, link) ? 'green' : '#E5E5E5'
// }

// function getTextColor(node, neighbors) {
//   return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'green' : 'black'
// }

// var width = window.innerWidth
// var height = window.innerHeight

// var svg = d3.select('svg')
// svg.attr('width', width).attr('height', height)

// var linkElements,
//   nodeElements,
//   textElements

// // we use svg groups to logically group the elements together
// var linkGroup = svg.append('g').attr('class', 'links')
// var nodeGroup = svg.append('g').attr('class', 'nodes')
// var textGroup = svg.append('g').attr('class', 'texts')

// // we use this reference to select/deselect
// // after clicking the same element twice
// var selectedId

// // simulation setup with all forces
// var linkForce = d3
//   .forceLink()
//   .id(function (link) { return link.id })
//   .strength(function (link) { return link.strength })

// var simulation = d3
//   .forceSimulation()
//   .force('link', linkForce)
//   .force('charge', d3.forceManyBody().strength(-120))
//   .force('center', d3.forceCenter(width / 2, height / 2))

// var dragDrop = d3.drag().on('start', function (node) {
//   node.fx = node.x
//   node.fy = node.y
// }).on('drag', function (node) {
//   simulation.alphaTarget(0.7).restart()
//   node.fx = d3.event.x
//   node.fy = d3.event.y
// }).on('end', function (node) {
//   if (!d3.event.active) {
//     simulation.alphaTarget(0)
//   }
//   node.fx = null
//   node.fy = null
// })

// // select node is called on every click
// // we either update the data according to the selection
// // or reset the data if the same node is clicked twice
// function selectNode(selectedNode) {
//   if (selectedId === selectedNode.id) {
//     selectedId = undefined
//     resetData()
//     updateSimulation()
//   } else {
//     selectedId = selectedNode.id
//     updateData(selectedNode)
//     updateSimulation()
//   }

//   var neighbors = getNeighbors(selectedNode)

//   // we modify the styles to highlight selected nodes
//   nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
//   textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
//   linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
// }

// // this helper simple adds all nodes and links
// // that are missing, to recreate the initial state
// function resetData() {
//   var nodeIds = nodes.map(function (node) { return node.id })

//   baseNodes.forEach(function (node) {
//     if (nodeIds.indexOf(node.id) === -1) {
//       nodes.push(node)
//     }
//   })

//   links = baseLinks
// }

// // diffing and mutating the data
// function updateData(selectedNode) {
//   var neighbors = getNeighbors(selectedNode)
//   var newNodes = baseNodes.filter(function (node) {
//     return neighbors.indexOf(node.id) > -1 || node.level === 1
//   })

//   var diff = {
//     removed: nodes.filter(function (node) { return newNodes.indexOf(node) === -1 }),
//     added: newNodes.filter(function (node) { return nodes.indexOf(node) === -1 })
//   }

//   diff.removed.forEach(function (node) { nodes.splice(nodes.indexOf(node), 1) })
//   diff.added.forEach(function (node) { nodes.push(node) })

//   links = baseLinks.filter(function (link) {
//     return link.target.id === selectedNode.id || link.source.id === selectedNode.id
//   })
// }

// function updateGraph() {
//   // links
//   linkElements = linkGroup.selectAll('line')
//     .data(links, function (link) {
//       return link.target.id + link.source.id
//     })

//   linkElements.exit().remove()

//   var linkEnter = linkElements
//     .enter().append('line')
//     .attr('stroke-width', 1)
//     .attr('stroke', 'rgba(50, 50, 50, 0.2)')

//   linkElements = linkEnter.merge(linkElements)

//   // nodes
//   nodeElements = nodeGroup.selectAll('circle')
//     .data(nodes, function (node) { return node.id })

//   nodeElements.exit().remove()

//   var nodeEnter = nodeElements
//     .enter()
//     .append('circle')
//     .attr('r', 10)
//     .attr('fill', function (node) { return node.level === 1 ? 'red' : 'gray' })
//     .call(dragDrop)
//     // we link the selectNode method here
//     // to update the graph on every click
//     .on('click', selectNode)

//   nodeElements = nodeEnter.merge(nodeElements)

//   // texts
//   textElements = textGroup.selectAll('text')
//     .data(nodes, function (node) { return node.id })

//   textElements.exit().remove()

//   var textEnter = textElements
//     .enter()
//     .append('text')
//     .text(function (node) { return node.label })
//     .attr('font-size', 15)
//     .attr('dx', 15)
//     .attr('dy', 4)

//   textElements = textEnter.merge(textElements)
// }

// function updateSimulation() {
//   updateGraph()

//   simulation.nodes(nodes).on('tick', () => {
//     nodeElements
//       .attr('cx', function (node) { return node.x })
//       .attr('cy', function (node) { return node.y })
//     textElements
//       .attr('x', function (node) { return node.x })
//       .attr('y', function (node) { return node.y })
//     linkElements
//       .attr('x1', function (link) { return link.source.x })
//       .attr('y1', function (link) { return link.source.y })
//       .attr('x2', function (link) { return link.target.x })
//       .attr('y2', function (link) { return link.target.y })
//   })

//   simulation.force('link').links(links)
//   simulation.alphaTarget(0.7).restart()
// }

// // last but not least, we call updateSimulation
// // to trigger the initial render
// updateSimulation()
