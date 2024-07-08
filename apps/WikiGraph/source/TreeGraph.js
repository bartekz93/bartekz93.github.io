
App.TreeGraphNodeController = function(nodes, edges, graph) {
	this.nodes = nodes;
	this.edges = edges;
	this.graph = graph;
}

App.TreeGraphNodeController.prototype = new App.NodeController();

App.TreeGraphNodeController.prototype.setLevel = function(level, visited)
{
	if (visited == undefined) visited = [];
	
	if (visited.indexOf(this.id) >= 0) return;
	visited.push(this.id);
	
	this.nodes.update({id: this.id, level: level});
	for (var child of this.getChildNodes()) 
	{
		if (child.level < level+1) {
			this.node(child.id).setLevel(level+1, visited);
		}
	}
}

App.TreeGraphNodeController.prototype.setLevelUpward = function(level, visited) 
{
	if (visited == undefined) visited = [];
	if (visited.indexOf(this.id) >= 0) return;
	visited.push(this.id);
	
	this.nodes.update({id: this.id, level: level});
	
	for (var parent of this.getParentNodes()) 
	{
		if (parent.level > level-1) {
			this.node(parent.id).setLevelUpward(level-1, visited);
		}
	}
}

App.TreeGraphNodeController.prototype.removeChildNodes = function() 
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
		else {
			this.node(childNodeId).setLevel(Math.max.apply(null, parents.map(p => p.level))+1);
		}
	}
}

App.TreeGraphNodeController.prototype.addOrJoinParentNode = function(name) 
{
	var existingNodes = this.graph.getNodesByName(name);
	var child = this.graph.getNodesById(this.id);
	var level = child.level-1;
	
	if (existingNodes.length === 0) {
		return this.node(this.id).addParentNode({
			name: name,
			level: level
		});
	}
	else  {
		for (var item of existingNodes) {
			var existingEdges = this.edges.get({filter: e => e.from == item.id && e.to == child.id});
			if (existingEdges.length == 0) {
				this.edges.add({from: item.id, to: child.id });
				if (item.level > level) {
					this.node(item.id).setLevelUpward(level);
				}
				return true;
			}
			else {
				return false;
			}
		}
	}
}

App.TreeGraphNodeController.prototype.addOrJoinChildNode = function(name) 
{
	var existingNodes = this.graph.getNodesByName(name);
	var parent = this.graph.getNodesById(this.id);
	var level = parent.level+1;
	
	if (existingNodes.length == 0) {
		return this.node(this.id).addChildNode({
			name: name,
			level: level, 
		});
	}
	else {
		for (var item of existingNodes) {
			var existingEdges = this.edges.get({filter: e => e.from == parent.id && e.to == item.id});
			if (existingEdges.length == 0) 
			{
				this.edges.add({from: parent.id, to: item.id });
			
				if (item.level <= level) {
					this.node(item.id).setLevel(level);
				}
				return true;
			}
			else {
				return false
			}
		}
	}
}


App.TreeGraph = function(nodes, edges) {
	this.nodes = nodes;
	this.edges = edges;
	this.nodeController = new App.TreeGraphNodeController(nodes, edges, this);
}
App.TreeGraph.prototype = new App.BaseGraph();