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

let targets: string[] = ['H', 'O', 'C', 'N'];

for (let reaction in reactions) {
    // let add = false;
    let add = true;
    let els = reactions[reaction].elements;
    // if (els.every(el=>targets.includes(el))) {
    //     add = true;
    // } else {
    //     continue;
    // }
    for(let mole in reactions[reaction].reactant) {
        if (add) {
            moleSet.add(mole);
        }
    }
    for(let mole in reactions[reaction].product) {
        if (add) {
            moleSet.add(mole);
        }
    }
    if (add) {
        reactSet.add(reaction);
    }
}


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
        link.strength = 0.1;
        baseLinks.push(link);
    }
    for (let product in rxn.product) {
        let link: BaseLink = {} as BaseLink;
        link.source = reaction;
        link.target = product;
        link.strength = 0.05;
        baseLinks.push(link);
    }
}

console.log('reaction set: '+ reactSet.size);
console.log('molecule set: '+ moleSet.size);
console.log('nodes: '+baseNodes.length);
console.log('edges: '+baseLinks.length);

const fs = require('fs');
const nodesPath = './proto/nodes.js';
const linksPath = './proto/links.js';

fs.writeFile(nodesPath, 'window.baseNodes = '+JSON.stringify(baseNodes), 'utf8', (err)=> {
    if (err) {
        return console.error(err);
    }
    console.log('Nodes saved!');
});

fs.writeFile(linksPath, 'window.baseLinks = '+JSON.stringify(baseLinks,null,2), 'utf8', (err)=> {
    if (err) {
        return console.error(err);
    }
    console.log('Links saved!');
});

// console.log('\n');
// baseLinks.forEach(x=>{
//     console.log(JSON.stringify(x)+' - '+baseNodes.some((val)=>(val.id === x.source || val.id === x.target)));
// });
// console.log('\n');
// baseNodes.forEach(x=>console.log(JSON.stringify(x)));

// let graph = 'digraph G {\n';
// for (let link of baseLinks) {
//     graph+= '  "'+link.source+'" -> "'+link.target+'"\n';
// }
// graph+= '\n};\n';

// fs.writeFile('./proto/graph.dot', graph, (err)=>{
//     if(err) {
//         return console.error(err);
//     }
//     console.log('Dot file written!');
// })
