var App = App || {};

App.Config = {};

	App.Config.layout = {
		tree: {
			improvedLayout:true,
			hierarchical: {
				enabled:true,
				levelSeparation: 150,
				nodeSpacing: 100,
				treeSpacing: 200,
				blockShifting: true,
				edgeMinimization: true,
				parentCentralization: true,
				direction: 'UD',        // UD, DU, LR, RL
				sortMethod: 'directed'   // hubsize, directed
			}
		},
		
		graph: {
			hierarchical: {
				enabled: false
			}
		}
	};
	
	App.Config.options = { 
		layout: App.Config.layout.tree,
		edges:{
			arrows: {
				to:     {
					enabled: true, 
					scaleFactor:1
				},
			},
			smooth: {
				enabled: false
			}
		},
		interaction:{
			tooltipDelay: 0,
			hover:true
		}
	};