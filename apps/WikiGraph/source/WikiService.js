var App = App || {};

App.WikiActions = function(wikiVersion)
{
	this.wikiVersion = wikiVersion;
	this.queryLimit = 200;
	this.articlesLimit = 100;
	this.searchLimit = 10;
}

App.WikiActions.prototype.buildUrl = function(base, properties) 
{
	base += "?";
	for (var key of Object.keys(properties))
	{
		base += key+"="+properties[key]+"&";
	}
	return base;
}
	
App.WikiActions.prototype.baseUrl = function() 
{
	return "https://"+this.wikiVersion+".wikipedia.org/w/api.php";
}

App.WikiActions.prototype.categoryInfo = function(category) 
{
	return this.buildUrl(this.baseUrl(), 
	{
		action: 'query',
		format: 'json',
		origin: '*',
		titles: 'Category:'+category,
		prop: 'categoryinfo'
	});
}

App.WikiActions.prototype.articles = function(category, pageToken, limit) 
{	
	return this.buildUrl(this.baseUrl(), 
	{
		action: 'query',
		format: 'json',
		cmlimit: limit || this.articlesLimit,
		list: 'categorymembers',
		origin: '*',
		cmtitle: 'Category:'+category,
		cmtype: 'page',
		cmprop: 'sortkeyprefix|title',
		cmcontinue: pageToken
	});
},
	
App.WikiActions.prototype.categories = function(parent) 
{	
	return this.buildUrl(this.baseUrl(), {
		action: 'query',
		format: 'json',
		cmlimit: this.queryLimit,
		list: 'categorymembers',
		origin: '*',
		cmtitle: 'Category:'+parent,
		cmtype: 'subcat',
		clshow: '!hidden'
	});
},

App.WikiActions.prototype.parentCategories = function(category) 
{	
	return this.buildUrl(this.baseUrl(), {
		action: 'query',
		format: 'json',
		cmlimit: this.queryLimit,
		origin: '*',
		titles: 'Category:'+category,
		prop: 'categories',
	});
},

App.WikiActions.prototype.articleCategories = function(name) 
{	
	return this.buildUrl(this.baseUrl(), {
		action: 'query',
		format: 'json',
		cllimit: this.queryLimit,
		origin: '*',
		titles: name,
		prop: 'categories',
		clshow: '!hidden'
	});
}

App.WikiActions.prototype.search = function(phrase) 
{	
	return this.buildUrl(this.baseUrl(), {
		action: 'opensearch',
		format: 'json',
		limit: this.searchLimit,
		origin: '*',
		search: phrase,
		redirects: 'resolve',
		namespace: 0
	});
}

App.WikiActions.prototype.categoryUrl = function(cat) 
{
	return "https://"+this.wikiVersion+".wikipedia.org/wiki/Category:"+cat;
}

App.WikiActions.prototype.articleUrl = function(art) 
{
	return "https://"+this.wikiVersion+".wikipedia.org/wiki/"+art;
}



App.WikiService = function(wikiVersion) {
	
	this.cache = {
		parentCategories: {},
		subCategories: {},
		articleCategories: {},
		articles: {},
		categoryInfo: {}
	};
	
	this.actions = new App.WikiActions(wikiVersion);
}

App.WikiService.prototype.downloadCategoryInfo = function(category, func) 
{
	var promise = $.get(this.actions.categoryInfo(category));
	
	promise.done((data) =>
	{
		console.log("Download category info: "+category);
		this.cache.categoryInfo[category] = data;
		func(data);
	});
	
	return promise;
}

App.WikiService.prototype.downloadCategories = function(parent, func) 
{
	var promise = $.get(this.actions.categories(parent));
	
	promise.done((data) =>
	{
		console.log("Download categories: "+parent);
		var categories = data.query.categorymembers.map(el => el.title.split(':')[1]);
		this.cache.subCategories[parent] = categories;
		func(categories);
	});
	
	return promise;
}

App.WikiService.prototype.downloadParentCategories = function(category, func) 
{
	var promise = $.get(this.actions.parentCategories(category));
	
	promise.done((data) =>
	{
		console.log("Download parent categories: "+category);
		var id = Object.keys(data.query.pages)[0];
		if (data.query.pages[id].categories != undefined) 
		{
			var categories = data.query.pages[id].categories.map(el => el.title.split(':')[1]);
			this.cache.parentCategories[category] = categories;
			func(categories);
		}
		else func([]);
	});
}

App.WikiService.prototype.downloadArticleCategories = function(name, func) 
{
	var promise = $.get(this.actions.articleCategories(name));
	
	promise.done((data) => {
		console.log("Download article categories: "+name);
		var id = Object.keys(data.query.pages)[0];
		var categories = data.query.pages[id].categories.map(el => el.title.split(':')[1]);
		this.cache.articleCategories[name] = categories;
		func(categories);
	});
	
	return promise;
}

App.WikiService.prototype.downloadArticles = function(category, pageToken, func, artsCount) 
{
	var promise = $.get(this.actions.articles(category, pageToken, artsCount));
	
	promise.done((data) => {
		console.log("Download articles of: "+category+" page "+pageToken);
		this.cache.articles[category+pageToken] = data;
		func(data);
	});
	
	return promise;
}

App.WikiService.prototype.getArticleCategories = function(name, success) 
{
	if (this.cache.articleCategories[name] != undefined) {
		success(this.cache.articleCategories[name]);
	}
	else {
		this.downloadArticleCategories(name, success);
	}
}

App.WikiService.prototype.getCategories = function(parent, success) 
{
	if (this.cache.subCategories[parent] != undefined) {
		success(this.cache.subCategories[parent]);
	}
	else {
		this.downloadCategories(parent, success);
	}
}

App.WikiService.prototype.getArticles = function(category, pageToken, success, artsCount) 
{
	if (this.cache.articles[category+pageToken] != undefined) {
		success(this.cache.articles[category+pageToken]);
	}
	else {
		this.downloadArticles(category, pageToken, success, artsCount);	
	}
}

App.WikiService.prototype.getCategoryInfo = function(category, success) 
{
	if (this.cache.categoryInfo[category] != undefined) {
		success(this.cache.categoryInfo[category]);
	}
	else {
		this.downloadCategoryInfo(category, success);	
	}
}

App.WikiService.prototype.getParentCategories = function(category, success) 
{
	
	if (this.cache.parentCategories[category] != undefined) {
		success(this.cache.parentCategories[category]);
	}
	else {
		this.downloadParentCategories(category, success);
	}
}