var App = App || {};

App.WikiGraph = function(container, type, rootNode) 
{
	this.wiki;
	this.network;
	this.eventHandler;
	this.nodePopup;
	this.type = type;
	this.root = rootNode;
	
	this.nodes = new vis.DataSet();
	this.edges = new vis.DataSet();
	this.graph = new App.TreeGraph(this.nodes, this.edges);
	
	this.callbacks = {
		showArticles: (category) => {}
	}
	
	this.callbacks = 
	{
		onChangeWikiVersion: (wikiVersion) => {}
	}
	
	this.config.container = container;
}
		
App.WikiGraph.prototype.config = {
	nodePopup: '.nodePopup'
}

App.WikiGraph.prototype.colors = {
	collapsed: 	'SkyBlue',
	developed: 	'lightgreen', 
	hover: 		'LemonChiffon',
	article: 	'orange'
}

App.WikiGraph.prototype.setWikiVersion = function(id, root) 
{
	this.wiki = new App.WikiService(id);
	this.createGraph(root);
	this.callbacks.onChangeWikiVersion(this.wiki);
}

App.WikiGraph.prototype.refresh = function() 
{
	this.network.setOptions(App.Config.options);
	this.network.redraw();
}

App.WikiGraph.prototype.prepareNode = function(id) 
{
	var node = this.graph.getNodesById(id);
	
	if (node.type == 'article') {
		this.wiki.getArticleCategories(this.graph.getNodesById(id).name, (categories) => {
			this.graph.node(id).update({
				nodes: [], 
				color: 'orange', 
				categories: categories.slice(0) 
			});
		});
	}
	else {
		this.wiki.getParentCategories(node.name, (parents) => {
			this.graph.node(id).update({
				categories: parents.slice(0) 
			});
		});
	
		this.wiki.getCategories(node.name, (categories) => {
			this.graph.node(id).update({
				nodes: categories.slice(0),
				developed: categories.length == 0, 
				color: this.colors.collapsed,
				title: node.name
			});
		});
	}
	this.graph.node(id).update({
		label: node.name.length > 13 ? node.name.substr(0, 11)+'...' : node.name
	});
}
		
App.WikiGraph.prototype.addParentNode = function(id, name) 
{
	if (this.graph.node(id).addOrJoinParentNode(name) !== false) {
		this.refresh();
	}
}

App.WikiGraph.prototype.toggleNodePopup = function(nodeId)
{
	var node = this.graph.getNodesById(nodeId);
	if (node) {
		if (this.nodePopup.active == true) {
			this.nodePopup.hide();
		}
		else {
			var pos = this.getClientNodePosition(node);
			this.nodePopup.show(pos.x, pos.y, node);
		}
	}
}

App.WikiGraph.prototype.developNode = function(id) 
{
	var node = this.graph.getNodesById(id);
	for (var child of node.nodes)
	{
		this.addChildNode(id, child);
	}
}

App.WikiGraph.prototype.collapseNode = function(id) 
{
	this.graph.node(id).removeChildNodes();
	this.updateDevelopedProperty(id);
}

App.WikiGraph.prototype.updateDevelopedProperty = function(id) {
	if (this.graph.getNodesById(id).nodes.length === this.graph.node(id).getChildNodes().length) 
	{
		this.graph.node(id).update({ developed: true });
	}
	else 
	{
		this.graph.node(id).update({ developed: false });
	}
}


App.WikiGraph.prototype.addChildNode = function(id, name) 
{
	if (this.graph.node(id).addOrJoinChildNode(name) !== false) 
	{
		this.updateDevelopedProperty(id);
		this.refresh();
	}
}

App.WikiGraph.prototype.createGraph = function(root) 
{
	this.graph.clear();
	
	var id = this.graph.addNode({
		level: 1, 
		name: root, 
		label: root, 
		developed: false, 
		color: this.colors.collapsed
	});
}

App.WikiGraph.prototype.getClientNodePosition = function(node) {
	var pos = this.network.getPositions(node.id)[node.id];
	return this.network.canvasToDOM(pos);
}

App.WikiGraph.prototype.init = function(wikiService) 
{
	var container = document.getElementById(this.config.container);
	
	var data = {
		nodes: this.nodes,
		edges: this.edges
	};
	
	this.wiki = wikiService;
	this.network = new vis.Network(container, data, App.Config.options);
	this.nodePopup = new App.NodePopup.Component(this);
	this.eventHandler = new App.WikiGraphEventHandler(this);

	this.createGraph(this.root);
	this.network.redraw();
}

App.WikiGraph.prototype.setRootNode = function(name)
{
	this.graph.clear();
	var nodeId = this.graph.addNode({
		level: 1, 
		type: name.indexOf(':') >= 0 ? 'category' : 'article',
		name: name.indexOf(':') >= 0 ? name.split(':')[1] : name, 
		label: name.indexOf(':') >= 0 ? name.split(':')[1] : name, 
		developed: false, 
		color: this.colors.collapsed
	});
}
	
	
App.WikiGraph.prototype.setGraphType = function(_type) 
{
	this.type = _type;
	
	if (this.type == 'tree') {
		this.nodes.get().forEach(n => {
			this.graph.node(n.id).update({desiredLevel: n.level, level: undefined});
		})
	}
	
	App.Config.options.layout = App.Config.layout[this.type];
	this.network.setOptions(App.Config.options);
	
	if (this.type == 'tree') {
		this.nodes.get().forEach(n => {
			this.graph.node(n.id).update({level: n.desiredLevel});
		})
	}
	this.network.setOptions(App.Config.options);
	this.network.redraw();
}