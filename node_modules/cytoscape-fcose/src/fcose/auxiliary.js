/*
 * Auxiliary functions
 */

const LinkedList = require('cose-base').layoutBase.LinkedList;

let auxiliary = {};

// get the top most nodes
auxiliary.getTopMostNodes = function(nodes) {
  let nodesMap = {};
  for (let i = 0; i < nodes.length; i++) {
      nodesMap[nodes[i].id()] = true;
  }
  let roots = nodes.filter(function (ele, i) {
      if(typeof ele === "number") {
        ele = i;
      }
      let parent = ele.parent()[0];
      while(parent != null){
        if(nodesMap[parent.id()]){
          return false;
        }
        parent = parent.parent()[0];
      }
      return true;
  });

  return roots;
};

// find disconnected components and create dummy nodes that connect them
auxiliary.connectComponents = function(cy, eles, topMostNodes, dummyNodes){
  let queue = new LinkedList();
  let visited = new Set();
  let visitedTopMostNodes = [];
  let currentNeighbor;
  let minDegreeNode;
  let minDegree;

  let isConnected = false;
  let count = 1;
  let nodesConnectedToDummy = [];
  let components = [];

  do{
    let cmpt = cy.collection();
    components.push(cmpt);
    
    let currentNode = topMostNodes[0];
    let childrenOfCurrentNode = cy.collection();
    childrenOfCurrentNode.merge(currentNode).merge(currentNode.descendants().intersection(eles));
    visitedTopMostNodes.push(currentNode);

    childrenOfCurrentNode.forEach(function(node) {
      queue.push(node);
      visited.add(node);
      cmpt.merge(node);
    });

    while(queue.length != 0){
      currentNode = queue.shift();

      // Traverse all neighbors of this node
      let neighborNodes = cy.collection();
      currentNode.neighborhood().nodes().forEach(function(node){
        if(eles.intersection(currentNode.edgesWith(node)).length > 0){
          neighborNodes.merge(node);
        }
      });

      for(let i = 0; i < neighborNodes.length; i++){
        let neighborNode = neighborNodes[i];
        currentNeighbor = topMostNodes.intersection(neighborNode.union(neighborNode.ancestors()));
        if(currentNeighbor != null && !visited.has(currentNeighbor[0])){
          let childrenOfNeighbor = currentNeighbor.union(currentNeighbor.descendants());

          childrenOfNeighbor.forEach(function(node){
            queue.push(node);
            visited.add(node);
            cmpt.merge(node);
            if(topMostNodes.has(node)){
              visitedTopMostNodes.push(node);
            }
          });

        }
      }
    }
    
    cmpt.forEach(node => {
      eles.intersection(node.connectedEdges()).forEach(e => { // connectedEdges() usually cached
        if( cmpt.has(e.source()) && cmpt.has(e.target()) ){ // has() is cheap
          cmpt.merge(e); // forEach() only considers nodes -- sets N at call time
        }
      });
    });    

    if(visitedTopMostNodes.length == topMostNodes.length){
      isConnected = true;
    }

    if(!isConnected || (isConnected && count > 1)){
      minDegreeNode = visitedTopMostNodes[0];
      minDegree = minDegreeNode.connectedEdges().length;
      visitedTopMostNodes.forEach(function(node){
        if(node.connectedEdges().length < minDegree){
          minDegree = node.connectedEdges().length;
          minDegreeNode = node;
        }
      });
      nodesConnectedToDummy.push(minDegreeNode.id());
      // TO DO: Check efficiency of this part
      let temp = cy.collection();
      temp.merge(visitedTopMostNodes[0]);
      visitedTopMostNodes.forEach(function(node){
        temp.merge(node);
      });
      visitedTopMostNodes = [];
      topMostNodes = topMostNodes.difference(temp);
      count++;
    }

  }
  while(!isConnected);

  if(dummyNodes){
    if(nodesConnectedToDummy.length > 0 ){
        dummyNodes.set('dummy'+(dummyNodes.size+1), nodesConnectedToDummy);
    }
  }
  return components;
};

auxiliary.calcBoundingBox = function(parentNode, xCoords, yCoords, nodeIndexes){
    // calculate bounds
    let left = Number.MAX_SAFE_INTEGER;
    let right = Number.MIN_SAFE_INTEGER;
    let top = Number.MAX_SAFE_INTEGER;
    let bottom = Number.MIN_SAFE_INTEGER;
    let nodeLeft;
    let nodeRight;
    let nodeTop;
    let nodeBottom;

    let nodes = parentNode.descendants().not(":parent");
    let s = nodes.length;
    for (let i = 0; i < s; i++)
    {
      let node = nodes[i];

      nodeLeft = xCoords[nodeIndexes.get(node.id())] - node.width()/2;
      nodeRight = xCoords[nodeIndexes.get(node.id())] + node.width()/2;
      nodeTop = yCoords[nodeIndexes.get(node.id())] - node.height()/2;
      nodeBottom = yCoords[nodeIndexes.get(node.id())] + node.height()/2;

      if (left > nodeLeft)
      {
        left = nodeLeft;
      }

      if (right < nodeRight)
      {
        right = nodeRight;
      }

      if (top > nodeTop)
      {
        top = nodeTop;
      }

      if (bottom < nodeBottom)
      {
        bottom = nodeBottom;
      }
    }

    let boundingBox = {};
    boundingBox.topLeftX = left;
    boundingBox.topLeftY = top;
    boundingBox.width = right - left;
    boundingBox.height = bottom - top;
    return boundingBox;
};

module.exports = auxiliary;