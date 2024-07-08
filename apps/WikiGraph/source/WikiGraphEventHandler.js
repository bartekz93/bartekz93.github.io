App.WikiGraphEventHandler = function(wikiGraph) 
{
	this.wikiGraph = wikiGraph;
	this.lastClick = undefined;
	this.firstClick = false;
	this.doubleClickInterval = 300;
	this.hoveredNode = undefined;
	this.init();
}
	
App.WikiGraphEventHandler.prototype.init = function() 
{
	
	var self = this;
	this.wikiGraph.nodePopup.callbacks.developChilds = function(id) 
	{
		for (var child of self.wikiGraph.graph.getNodesById(id).nodes)
		{
			self.wikiGraph.addChildNode(id, child);
		}
		self.wikiGraph.nodePopup.hide();
	}
	
	this.wikiGraph.nodePopup.callbacks.developParents = function(id) 
	{
		for (var parent of self.wikiGraph.graph.getNodesById(id).categories)
		{
			self.wikiGraph.addParentNode(id, parent);
		}
		self.wikiGraph.nodePopup.hide();
	}
	
	this.wikiGraph.nodePopup.callbacks.collapseNode = function(id) 
	{
		self.wikiGraph.collapseNode(id);
		self.wikiGraph.nodePopup.hide();
	}
	
	this.wikiGraph.nodePopup.callbacks.removeNode = function(id) 
	{
		self.wikiGraph.graph.node(id).remove();
		self.wikiGraph.nodePopup.hide();
	}
	
	this.wikiGraph.nodePopup.callbacks.showArticles = function(id) 
	{
		var category = self.wikiGraph.graph.getNodesById(id).name;
		self.wikiGraph.nodePopup.hide();
		self.wikiGraph.callbacks.showArticles(category);
	}
	
	this.wikiGraph.nodePopup.callbacks.goToWiki = function(id) 
	{
		var node = self.wikiGraph.graph.getNodesById(id);
		if (node.type == 'article')
		{
			window.open(self.wikiGraph.wiki.actions.articleUrl(node.name));
		}
		else {
			window.open(self.wikiGraph.wiki.actions.categoryUrl(node.name));
		}
		self.wikiGraph.nodePopup.hide();
	}
	
	this.wikiGraph.nodePopup.callbacks.addParentCategory = function(id, name) 
	{
		self.wikiGraph.addParentNode(id, name);
		self.wikiGraph.graph.node(id).update({hover: false});
		self.wikiGraph.nodePopup.hide();
	}
	
	this.wikiGraph.nodePopup.callbacks.addChildCategory = function(id, name) {
		self.wikiGraph.addChildNode(id, name);
		self.wikiGraph.graph.node(id).update({hover: false});
		self.wikiGraph.nodePopup.hide();
	}
	
	this.wikiGraph.network.on("hoverNode", this.onHoverNode.bind(this));
	this.wikiGraph.network.on("blurNode", this.onBlurNode.bind(this));
	this.wikiGraph.network.on("click", this.onClickNode.bind(this));
	this.wikiGraph.network.on("deselectNode", this.onDeselectNode.bind(this));
	this.wikiGraph.nodes.on('update', this.onUpdateNode.bind(this));
	this.wikiGraph.nodes.on('add', this.onAddNode.bind(this));
}


	
App.WikiGraphEventHandler.prototype.onUpdateNode = function(event, properties, senderId) 
{
	if (properties.data[0].developed != undefined) {
		var node = this.wikiGraph.graph.getNodesById(properties.items[0]);
		if (node.type != 'article') {
			this.wikiGraph.graph.node(properties.items[0]).update({
				color: properties.data[0].developed === true ? 
					this.wikiGraph.colors.developed : this.wikiGraph.colors.collapsed
			});
		}
	}
	
	if (properties.data[0].nodes != undefined || properties.data[0].categories != undefined) {
		if (this.wikiGraph.nodePopup.active === true) {
			this.wikiGraph.nodePopup.refresh(this.wikiGraph.graph.getNodesById(properties.data[0].id));
		}
	}
	
	if (properties.data[0].hover != undefined) {
		var node = this.wikiGraph.graph.getNodesById(properties.items[0]);
		
		if (node.type != 'article') {
			this.wikiGraph.graph.node(properties.items[0]).update({
				color: properties.data[0].hover === true ? 
					this.wikiGraph.colors.hover : (properties.oldData[0].developed === true ? this.wikiGraph.colors.developed : this.wikiGraph.colors.collapsed)
			});
		}
		
		if (properties.data[0].hover === false) {
			//App.NodePopup.hide();
		}
	}
}

App.WikiGraphEventHandler.prototype.onAddNode = function(event, properties, senderId) 
{
	this.wikiGraph.prepareNode(properties.items[0]);
	this.wikiGraph.refresh();
}



App.WikiGraphEventHandler.prototype.onClickNode = function(obj) {
	if (obj.nodes.length > 0) 
	{
		var id = obj.nodes[0];
		
		if (this.firstClick === true) {
			this.onDoubleClickNode(id);
			this.firstClick = false; 
		}
		else {
			this.firstClick = true;
			setTimeout(() => { 
				if (this.firstClick == true) {
					this.onSingleClickNode(id);
				}
				this.firstClick = false; 
			}, this.doubleClickInterval);
		}
	}
}

App.WikiGraphEventHandler.prototype.onDeselectNode = function(event)
{
	var node = this.wikiGraph.graph.getNodesById(event.nodes[0]);
	if (node && this.wikiGraph.nodePopup.active) {
		this.wikiGraph.nodePopup.hide();
	}
}


App.WikiGraphEventHandler.prototype.onSingleClickNode = function(id) {
	var node = this.wikiGraph.graph.getNodesById(id);
	this.wikiGraph.callbacks.showArticles(node.name);
	this.wikiGraph.toggleNodePopup(id);
}

App.WikiGraphEventHandler.prototype.onDoubleClickNode = function(id) {
	var node = this.wikiGraph.graph.getNodesById(id);
	if (node.developed == false) {
		this.wikiGraph.developNode(id);
	}
	else {
		this.wikiGraph.collapseNode(id);
	}
}

App.WikiGraphEventHandler.prototype.onBlurNode = function(event) 
{
	var node = this.wikiGraph.graph.getNodesById(event.node);
	setTimeout(() => {
		if (node == undefined || node == null) return;
		
		/*if (node.id === this.hoveredNode) {
			if (this.wikiGraph.nodePopup.nodeId == node.id) {
				this.wikiGraph.nodePopup.hide();
			}
		}*/
		
		for (var n of this.wikiGraph.graph.getNodesByName(node.name)) {
			this.wikiGraph.graph.node(n.id).update({ hover: false });
		}
	}, 10);
}

App.WikiGraphEventHandler.prototype.onHoverNode = function(event) 
{
	var node = this.wikiGraph.graph.getNodesById(event.node);
	if (node == undefined || node == null) return;
	this.hoveredNode = node.id;
	
	
	
	for (var n of this.wikiGraph.graph.getNodesByName(node.name)) {
		this.wikiGraph.graph.node(n.id).update({ hover: true });
	}
}