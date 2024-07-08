App.NodeController = function(nodes, edges, graph) 
{
	this.nodes = nodes;
	this.edges = edges;
	this.graph = graph;
	this.idCounter = 1;
	this.id = 0;
}

App.NodeController.prototype.init = function(id) 
{
	this.id = id;
}

App.NodeController.prototype.node = function(id) 
{
	this.id = id;
	return this;
}

App.NodeController.prototype.hasChild = function(props) 
{
	return this.getChildNodes().find(n => {
		for (var key of Object.keys(props)) {
			if (n[key] !== props[key]) return false;
		}
		return true;
	}) != undefined;
}

App.NodeController.prototype.hasParent = function(props) 
{
	return this.getParentNodes().find(n => {
		for (var key of Object.keys(props)) {
			if (n[key] !== props[key]) return false;
		}
		return true;
	}) != undefined;
}


App.NodeController.prototype.addChildNode = function(child) 
{
	var parentId = this.id;
	child.id = this.idCounter++;
	this.nodes.add(child);
	this.edges.add({from: parentId, to: child.id});
	return child.id;
},

App.NodeController.prototype.addParentNode = function(parent) 
{
	var childId = this.id;
	parent.id = this.idCounter++;
	this.nodes.add(parent);
	this.edges.add({from: parent.id, to: childId});
	return parent.id;
},

App.NodeController.prototype.getChildNodes = function()
{
	var childs = [];
	for (var edge of this.getOutcomeEdges())
	{
		childs.push(this.nodes.get(edge.to));
	}
	return childs;
},

App.NodeController.prototype.getIncomeEdges = function() 
{
	return this.edges.get({
		filter: item => item.to == this.id
	});
},  

App.NodeController.prototype.getOutcomeEdges = function() 
{
	return this.edges.get({
		filter: item => item.from == this.id
	});
},

App.NodeController.prototype.getParentNodes = function() 
{
	var parents = [];
	
	for (var edge of this.getIncomeEdges())
	{
		parents.push(this.nodes.get(edge.from));
	}
	return parents;
},

App.NodeController.prototype.remove = function() 
{
	var nodeId = this.id;
	this.removeChildNodes();
	var income = this.node(nodeId).getIncomeEdges(); 
	this.edges.remove(income);
	this.nodes.remove(nodeId);
},

App.NodeController.prototype.removeChildNodes = function() 
{
	var childs = this.getChildNodes();
	var outcome = this.getOutcomeEdges(); 
	this.edges.remove(outcome);
	
	for (var childNodeId of outcome.map((o) => o.to))
	{
		var parents = this.node(childNodeId).getParentNodes();
		
		if (parents.length == 0) 
		{
			this.node(childNodeId).removeChildNodes(childNodeId);
			this.nodes.remove(childNodeId);
		}
	}
}

App.NodeController.prototype.update = function(data) 
{
	var prop = {};
	prop.id = this.id;
	for (var key of Object.keys(data)) 
	{
		prop[key] = data[key];
	}
	this.nodes.update(prop);
}

App.BaseGraph = function(nodes, edges) 
{
	this.nodes = nodes;
	this.edges = edges;
	
	this.nodeController = new App.NodeController(nodes, edges, this);
}

App.BaseGraph.prototype.node = function(id) 
{
	return this.nodeController.node(id);
}

App.BaseGraph.prototype.addNode = function(child) 
{
	child.id = this.nodeController.idCounter++;
	child.level = 1;
	this.nodes.add(child);
	return child.id;
}

App.BaseGraph.prototype.clear = function() 
{
	this.nodes.clear();
	this.edges.clear();
	this.idCounter = 1;
}

App.BaseGraph.prototype.getNodesByName = function(name) 
{
	return this.nodes.get({
		filter: node => node.name == name && node.name != undefined && node.type != 'article'
	});
}

App.BaseGraph.prototype.getNodesById = function(id) 
{
	return this.nodes.get(id);
}