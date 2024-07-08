App.NodePopup = App.NodePopup || {};

App.NodePopup.View = function(nodePopup) {
	this.nodePopup = nodePopup;
	this.active = false;
	this.cursorPos;
	
	document.addEventListener('mousemove', function(event) {
		
	});
}

App.NodePopup.View.prototype.config = {
	body: 						'.nodePopup',
	caption: 					'.caption .text',
	icons: 						'.icon',
	categories: 				'.categories',
	subcategories: 				'.subcategories',
	categories_wrapper: 		'.categories_wrapper',
	subcategories_wrapper: 		'.subcategories_wrapper',
	label:						'.ui.label',
	
	btnDevelopCatagories: 		'.icon.plus.developCategories',
	btnDevelopSubcategories: 	'.icon.plus.developSubcategories',
	btnRemove:					'.icon.remove',
	btnCollapse:				'.icon.minus.collapse',
	btnWiki: 					'.icon.reply.goToWiki',
	btnShowArticles: 			'.icon.newspaper.showArticles'
}

App.NodePopup.View.prototype.subcategory = function(parentId, item) 
{
	return "<span class='ui label "+(this.nodePopup.wikiGraph.graph.node(parentId).hasChild({name: item}) ? 'silver' : 'green')+"' id='"+parentId+"'>"+item+"</span>";
},

App.NodePopup.View.prototype.category = function(parentId, item) 
{
	return "<span class='ui label "+(this.nodePopup.wikiGraph.graph.node(parentId).hasParent({name: item}) ? 'silver' : 'blue')+"' id='"+parentId+"'>"+item+"</span>";
},

App.NodePopup.View.prototype.categories = function(node) 
{
	var html = "";
	if (node.categories == undefined) 
	{
		return 'Ładuję...';
	}
	for (var cat of node.categories) {
		html += this.category(node.id, cat);
	}
	
	if (html.length === 0) {
		$(this.config.body).find(this.config.categories_wrapper).hide();
	}
	else $(this.config.body).find(this.config.categories_wrapper).show();
	
	return html;
},

App.NodePopup.View.prototype.show = function(x, y, node, t) 
{
	$(this.config.body).attr('id', node.id);
	$(this.config.body).find(this.config.caption).html(node.name);
	
	$(this.config.body).find(this.config.categories).html(this.categories(node));
	$(this.config.body).find(this.config.subcategories).html(this.subcategories(node));
	
	$(this.config.body).find(this.config.icons).attr('id', node.id);
	
	if (node.type == 'article') {
		$(this.config.body).find(this.config.btnShowArticles).hide();
	}
	else {
		$(this.config.body).find(this.config.btnShowArticles).show();
	}
	
	$(this.config.body).css('position', 'fixed');
	$(this.config.body).css('left', x);
	$(this.config.body).css('top', y);
    $(this.config.body).fadeIn(t ? t : 100, () => {
		$(this.config.body).css('display', 'flex');
		$(this.config.body).focus();
	});
}

App.NodePopup.View.prototype.refresh = function(node) 
{
	$(this.config.body).attr('id', node.id);
	$(this.config.body).find(this.config.caption).html(node.name);
	
	$(this.config.body).find(this.config.categories).html(this.categories(node));
	$(this.config.body).find(this.config.subcategories).html(this.subcategories(node));
	
	$(this.config.body).find(this.config.icons).attr('id', node.id);
}
	
App.NodePopup.View.prototype.hide = function(t) {
	$(this.config.body).fadeOut(t ? t : 100);
}

App.NodePopup.View.prototype.subcategories = function(node) 
{
	var html = "";
	if (node.nodes == undefined) 
	{
		return 'Ładuję...';
	}
	
	for (var item of node.nodes)
	{
		html += this.subcategory(node.id, item);
	}
	
	if (html.length === 0) {
		$(this.config.body).find(this.config.subcategories_wrapper).hide();
	}
	else $(this.config.body).find(this.config.subcategories_wrapper).show();
	
	return html;
}

App.NodePopup.Component = function(wikiGraph)  {	
	
	this.view = new App.NodePopup.View(this);
	this.wikiGraph = wikiGraph;
	this.nodeId;
	
	this.callbacks = {
		addParentCategory: (id) => {},
		addChildCategory: (id) => {},
		developChilds: (id) => {},
		developParents: (id) => {},
		removeNode: (id) => {},
		goToWiki: (id) => {},
		showArticles: (id) => {}
	}
	

	$(this.view.config.body).on('mouseleave', (event) => {
		if (!($(event.relatedTarget).is('canvas') || $(event.relatedTarget).hasClass('popup')))
		{
			//this.hide();
		}
	});
	
	$(this.view.config.body).blur(() => {
		this.hide();
	});
	
	$(this.view.config.body).on('click', this.view.config.categories+" "+this.view.config.label, (obj) => {
		if (obj.currentTarget.id != undefined) {
			this.callbacks.addParentCategory(obj.currentTarget.id, obj.currentTarget.innerText);
		}
	});
	
	$(this.view.config.body).on('click', this.view.config.subcategories+" "+this.view.config.label, (obj) => {
		if (obj.currentTarget.id != undefined) {
			this.callbacks.addChildCategory(obj.currentTarget.id, obj.currentTarget.innerText);
		}
	});
	
	$(this.view.config.body).find(this.view.config.btnDevelopCatagories).click((obj) => {
		this.callbacks.developParents(obj.currentTarget.id);
	});
	
	$(this.view.config.body).find(this.view.config.btnDevelopSubcategories).click((obj) => {
		this.callbacks.developChilds(obj.currentTarget.id);
	});
	
	$(this.view.config.body).find(this.view.config.btnRemove).click((obj) => {
		this.callbacks.removeNode(obj.currentTarget.id);
	});
	
	$(this.view.config.body).find(this.view.config.btnCollapse).click((obj) => {
		this.callbacks.collapseNode(obj.currentTarget.id);
	});
	
	$(this.view.config.body).find(this.view.config.btnWiki).click((obj) => {
		this.callbacks.goToWiki(obj.currentTarget.id);
	});
	
	$(this.view.config.body).find(this.view.config.btnShowArticles).click((obj) => {
		this.callbacks.showArticles(obj.currentTarget.id);
	});
}
	
App.NodePopup.Component.prototype.show = function(x, y, node, t) {
	this.active = true;
	this.nodeId = node.id;
	this.view.show(x, y, node, t);
}

App.NodePopup.Component.prototype.refresh = function(node) {
	this.view.refresh(node);
}
	
App.NodePopup.Component.prototype.hide = function(t) {
	this.active = false;
	this.view.hide();
}