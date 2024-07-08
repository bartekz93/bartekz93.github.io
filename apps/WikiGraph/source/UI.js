var App = App || {};

App.UI = (function() {
	
	var elements = {
		selectGraphType: '.ui.dropdown.graphType',
		selectWikiVersion: '.ui.dropdown.version',
		showArticlesBtn: 'button.showArticles',
		graphContainer: 'mynetwork',
		warningPopup: '.warningPopup'
	}
	
	var versions = {
		pl: {
			name: 'Polska',
			id: 'pl',
			root: 'Kategorie'
		},
		simple: {
			name: 'Simple English',
			id: 'simple',
			root: 'Contents'
		},
		en: {
			name: 'English',
			id: 'en',
			root: 'Contents'
		}
	}
	
	var defaultState = {
		graphType: 'tree',
		wikiVersion: 'simple',
		repeatNodes: false
	}
	var state;
	var graph;
	var wikiService;
	var articlesPane;
	
	function refreshUI() 
	{
		$(elements.selectWikiVersion).dropdown('set selected', state.wikiVersion);
		$(elements.selectGraphType).dropdown('set selected', state.graphType);
		$(elements.checkboxRepeatNodes).attr('checked', state.repeatNodes);
	}
	
	function restoreState() {
		state = JSON.parse(localStorage.getItem("state"));
		if (state == undefined) state = defaultState;
	}
	
	function storeState() {
		localStorage.setItem("state", JSON.stringify(state));
	}
	
	function showWarning(msg, acceptFunction) {
		$(elements.warningPopup).find('.description').text(msg);
		$(elements.warningPopup).modal("setting", {
			closable: false,
			onApprove: acceptFunction,
			onHide: function() {
				refreshUI();
			}
		}).modal("show");
	}
	
	function onSearch(result, response) {
		if (graph.nodes.length > 1) {
			showWarning('Aktualny diagram zostanie wyczyszczony. Kontynuować?', function() {
				graph.setRootNode(result.title);
			});
		} else {
			graph.setRootNode(result.title);
		}
		$('.prompt').get(0).blur();
	}
	
	function onSearchResponse(wikiResponse) {
		var response = {
			results : []
		};
		wikiResponse[1].forEach(function(item, index) {
			response.results.push({
				title       : item,
				description : wikiResponse[2][index],
				url: "#"//wikiResponse[3][index]
			});
		});
		return response;
	}
	
	function showArticles(category) {
		$('.sidebar.right').sidebar('show');
		articlesPane.load(category);
	}
	
	return {
		getGraph: function() {
			return graph;
		},
		
		init: function() {
			restoreState();
			refreshUI();
			
			wikiService = new App.WikiService(state.wikiVersion);
			articlesPane = new App.ArticlesPane.Component(wikiService);
			
			
			
			graph = new App.WikiGraph(elements.graphContainer, state.graphType, versions[state.wikiVersion].root);
			graph.init(wikiService);
			graph.callbacks.showArticles = (category) => {
				showArticles(category);
			}
			
			graph.callbacks.onChangeWikiVersion = function(wiki) {
				console.log('change wiki');
				wikiService = wiki;
				articlesPane.wiki = wiki;
				
				$('.ui.search').search('clear cache');
				$('.ui.search').search({
					onSelect: onSearch,
					minCharacters : 3,
					apiSettings   : {
						onResponse: onSearchResponse,
						url: wikiService.actions.search("{query}")
					}
				});
			}
			
			
			
			$('.ui.search').search({
				onSelect: onSearch,
				minCharacters : 3,
				apiSettings   : {
					onResponse: onSearchResponse,
					url: wikiService.actions.search("{query}")
				}
			});
	
			$('.ui.sidebar.right .close').click(() => {
				$('.sidebar.right').sidebar('hide');
			})
			
			$('.ui.sidebar.right').sidebar({
				transition: 'overlay',
				dimPage: false,
				closable: false,
				context: $('.bottom.segment')
			});
			
			$('.ui.sidebar.left').sidebar({
				transition: 'overlay',
				dimPage: false,
				context: $('.bottom.segment')
			}).sidebar('attach events', '.menu .item.button');
		
			$(elements.selectWikiVersion).dropdown({
				onChange: function(value, text, $selectedItem) {
					
					var setWikiVersion = () => {
						graph.setWikiVersion(value, versions[value].root);
						state.wikiVersion = value;
						storeState();	
					}
					
					if (graph.nodes.length > 1) {
						showWarning('Zmiana wersji wiki wyczyści cały diagram, czy kontynuowac?', setWikiVersion);
					} else {
						setWikiVersion();
					}
					$('.prompt').get(0).blur();
				}
			});
			
			$(elements.showArticlesBtn).click(function() {
				showArticles();
			});
			
			$('.right.sidebar .hide').click(function() {
				$('.sidebar.right').sidebar('hide');
			});
			
			$(elements.selectGraphType).dropdown({
				onChange: function(value, text, $selectedItem) {
					graph.setGraphType(value);
					state.graphType = value;
					storeState();
				}
			});
		}
    }
});