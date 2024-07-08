App = App || {};
App.ArticlesPane = App.ArticlesPane || {};

App.ArticlesPane.View = function() {
	
	this.callbacks = {
		nextPage: () => {},
		prevPage: () => {}
	}
	
	
	$(this.config.body).on('click', this.config.nextPageBtn, () => 
	{
		this.callbacks.nextPage();
	});
	
	$(this.config.body).on('click', this.config.prevPageBtn, () => 
	{
		this.callbacks.prevPage();
	});
}

App.ArticlesPane.View.prototype.config = 
{
	body: 		 '.articlesPane',
	nextPageBtn: 'button.nextPage',
	prevPageBtn: 'button.prevPage',
	close: 		 'button.close'
};

App.ArticlesPane.View.prototype.listItem = function(item, url) 
{
	return `<div class="item">
				<i class="File Text Outline middle aligned icon"></i>
				<div class="content">
					<a class="header" href="${url}" target="_blank">${item}</a>
				</div>
			</div>`;
}

App.ArticlesPane.View.prototype.list = function() 
{
	return `<div class='ui relaxed divided list'></div>`;
}

App.ArticlesPane.View.prototype.header = function(title, url) 
{
	return `<a target="_blank" href="${url}"><h1>${title}</h1></a>`;
}

App.ArticlesPane.View.prototype.stats = function(artsCount, artsTotal, page, pagesTotal) 
{
	return `<div class="ui label silver">Artykułów: ${artsCount} z ${artsTotal}</div>
			<div class="ui label silver">Strona: ${page} z ${pagesTotal}</div>`;
}

App.ArticlesPane.View.prototype.dime = function() 
{
	$(this.config.body).css('height', '100%');
	$(this.config.body).empty();
	$(this.config.body).append('<div class="ui active inverted dimmer"><div class="ui loader"></div>');
}

App.ArticlesPane.View.prototype.pageButtons = function(prev, next) 
{
	return 	`<div style="text-align: center">
				<button class="ui silver button prevPage ${!prev ? `disabled` : ``}" >Porzednia strona</button>
				<button class="ui silver button nextPage ${!next ? `disabled` : ``}" >Następna strona</button>
			</div>`;
}

App.ArticlesPane.View.prototype.draw = function(data, options) 
{	
	var b = $(this.config.body);

	b.css('height', 'auto');
	b.empty();
	
	b.append(this.header(options.title, options.categoryUrl));
	
	var keys = Object.keys(data);
	if (keys.length > 0) {
		
		b.append(this.stats(options.artsCount, options.artsTotal, options.page, options.pagesTotal));
		
		for (var key of keys)
		{
			b.append(`<h3>${key}</h3>`);
			var list = $(this.list());
			b.append(list);
			for (var article of data[key]) 
			{
				list.append(this.listItem(article, options.articleUrl(article)));
			}
		}
		b.append(this.pageButtons(options.page > 1, options.page != options.pagesTotal));
	}
	else 
	{
		b.append(`<div class="ui message silver">Brak artykułów w tej kategorii.</div>`);
	}
}

App.ArticlesPane.Component = function(wikiService) 
{
	this.wiki = wikiService;
	this.view = new App.ArticlesPane.View();
	this.category;
	
	this.pageToken = 0;
	this.nextPageToken = 0;
	this.prevPageTokens = [];
	this.pagesTotal = 0;
	this.artsTotal = 0;
	this.artsCount = 100;
	
	this.view.callbacks.nextPage = () => 
	{
		this.prevPageTokens.push(this.pageToken);
		this.loadPage(this.nextPageToken);
	}
	this.view.callbacks.prevPage = () => 
	{
		this.loadPage(this.prevPageTokens.pop());
	}
}

App.ArticlesPane.Component.prototype.processData = function(data) 
{
	this.data = {};
			
	for (var page of data.query.categorymembers) {
		var sortKey = page.sortkeyprefix.length === 0 ? '' : page.sortkeyprefix.toUpperCase()[0];
		if (sortKey === '') {
			sortKey = page.title.toUpperCase()[0];
		}
		if (this.data[sortKey] === undefined) {
			this.data[sortKey] = [];
		}
		this.data[sortKey].push(page.title);
	}
}

App.ArticlesPane.Component.prototype.load = function(category) 
{
	this.category = category;
	this.prevPageTokens = [];
	this.nextToken = 0;
	
	this.wiki.getCategoryInfo(category, (info) => 
	{
		var pageId = Object.keys(info.query.pages)[0];
		this.artsTotal = info.query.pages[pageId].categoryinfo.pages;
		this.pagesTotal = Math.ceil(this.artsTotal/this.artsCount)
		
		
		this.loadPage(0);
	});
}

App.ArticlesPane.Component.prototype.loadPage = function(pageToken) 
{	
	this.pageToken = pageToken;
	this.view.dime();

	this.wiki.getArticles(this.category, pageToken, (result) => 
	{
		this.processData(result);
		
		if (result.continue != undefined) 
		{
			this.nextPageToken = result.continue.cmcontinue;
		}
		else {
			this.nextPageToken = undefined;
		}

		this.view.draw(this.data,
		{
			title: 			this.category,
			artsCount: 		result.query.categorymembers.length,
			artsTotal: 		this.artsTotal,
			pagesTotal: 	this.pagesTotal,
			page: 			this.prevPageTokens.length+1,
			categoryUrl: 	this.wiki.actions.categoryUrl(this.category),
			
			articleUrl: (article) => {
				return this.wiki.actions.articleUrl(article);
			}
		});
	}, this.artsCount);
}


