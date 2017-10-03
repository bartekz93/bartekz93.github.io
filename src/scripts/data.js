var data = [
    {
        name: 'BarEngine',
		group: 1,
        year: '2009-2012',
        tech: ['C++', 'Direct3D 9/11', 'OpenGL 4'],
        tools: ['VisualStudio', 'PIX'],
		desc: 'A something like graphics engine created in Direct3D and partially in some time also in OpenGL4 (the architecture had to be generic and allowed to use multiple renderers, but Direct3D implementation was more complete than OpenGL). There were in fact many individual projects, because it was rewrtitten many times from scratch. It was able to load .obj files, generate terrain from heigtmaps with texture splatting, draws particles, skybox and other basic things. It has own 2D renderer to drawing 2d elements and fonts. Later it was implemented sort of deffered shading, shadow mapping and basic skeletal animation. There was also own simple GUI system with several most common controls.',
        images: 'barengine',
        imagesCount: 5,
		videosCount: 0,
		videos: []
    },
    {
        name: 'BarRaytracer',
		group: 1,
        year: '2012',
        tech: ['C++', 'Direct3D 11', 'HLSL'],
        tools: ['VisualStudio'],
        images: 'raytracer',
		desc: 'A graphics engine generating image by casting rays. Core functionality of engine was written as a single pixel shader. It was able to display only spheres and planes, but it served diffuse and specular lightning and reflections too. Number of reflection depth is adjustable. With non complex scenes and low resolution it was working almost in real time on my not-gaming notebook.',
        imagesCount: 6,
		videosCount: 1,
		videos: [
			'https://drive.google.com/uc?export=download&id=0B1CMrj9obh3OalFJbnFqMkZmSUU'
		],
		repo: "https://github.com/bartekz93/BarRaytracer"
    },
    {
        name: 'Jump&Run',
		group: 1,
        year: '2013',
        tech: ['C++', 'Allegro'],
        tools: ['VisualStudio'],
        images: 'jumpnrun',
		desc: "It's simple platform game created for 'Object Programming' course. The task was to write any game, using objective orienting programming paradigm. In game we control doggy character who has to collect stars and avoid turtle enemies. There are also floating and falling platforms, moving boxes and bonuses. Levels was loaded from bitmap files, where differently colored pixels were translated into game objects. It allows to easy creating and manipulating them. An example of such bitmap is presented below.",
        imagesCount: 6,
		videosCount: 1,
		videos: [
			'https://drive.google.com/uc?export=download&id=0B1CMrj9obh3OanFlSUw5bERJYmM'
		],
		repo: "https://github.com/bartekz93/JumpAndRun"
    },
	{
        name: 'Network Snake',
		group: 3,
        year: '2014',
        tech: ['C++', 'SFML', 'WinSockets'],
        tools: ['VisualStudio'],
		desc: 'Multiplayer game based on traditional snake. It allowed to play by network up to 4 players. Despite of there were only a few multiplayer tests (they were logistically problematic), game was running quite well without noticeable desynchronizations. The game instances on clients was updated with events distributed by server using network sockets. Event data structure was consisted of type field and specific data payload. Moreover, every some constant time interval, special synchronizing frame was sent. However, game requires more multiplayer tests due to non deterministic crashes after longer time of play. It was built in three-person group.',
        images: 'netsnake',
        imagesCount: 5,
		videosCount: 1,
		videos: [
			'https://drive.google.com/uc?export=download&id=0B1CMrj9obh3ORkFCYmhwX0pJWDg'
		]
    },
    {
        name: 'Icycle Tree Visualization',
		group: 1,
        year: '2014',
        tech: ['C#', 'WPF'],
        tools: ['VisualStudio'],
        images: 'icycle',
        desc: "Utility tool software to visualize directory as icycle tree. It allowed to color nodes and dynamic change of root node (with animation). There are two coloring modes: in first of them, color of node is static and don't affects parent directory at all. In second mode color of directory is result of children's colors, so it propagetes and blends up to root. There is also two modes of calculating width of nodes: by number of files (every file has the same weight in width) or by their sizes in relation to catalog.",
        imagesCount: 4
    },
	{
        name: 'Conway\'s Game of Life',
		group: 1,
        year: '2015',
        tech: ['C#', 'WPF'],
        tools: ['VisualStudio'],
        images: 'gameoflife',
        desc: "Implementation of well known cellurar automaton - Conway's Game of Life. It has ability to color cells depends of its state, save and open files, and other basics features. The celurar surface is custom control. It's displaying bitmap painted by GDI+ functions (by System.Drawing.Graphics class which is member of Windows Forms API more than WPF actually). It's not the most efficient approach, although I was looking for better and I couldn't find any good solution to draw a lot of 2D shapes in WPF efficiently. Hovewer, if only changed parts are redrawned, the efficiency is acceptable.",
        imagesCount: 3,
		videosCount: 1,
		videos: [
			'https://drive.google.com/uc?export=download&id=0B1CMrj9obh3OREFmcWNscWNnNDg'
		]
    },
	{
        name: 'Trylma',
		group: 4,
        year: '2015',
        tech: ['C#', '.NET MVC', 'MS SQL Server', 'JavaScript', 'SignalR'],
        tools: ['VisualStudio'],
        images: 'trylma',
        desc: "Online platform to playing trylma - logic board game. It allows to play with humans and computer AI. There were two AI alghoritms: first of them is sort of greedy alghoritm based on evaluation function. The function rates every possible move using simple concepts like lengths between certain fields on board and chooses the best rated one. Second alghoritm is implementation of min-max alghoritm with alpha beta pruning. In this solution in every AI turn the tree game with some depth is created. The tree is used then to choose the best move from AI perspective. It means that AI will be try to predict future state of board, and could make weak move in one turn to build conditions to perform better moves in next turns. The realtime comunnication was performed by SignalR.",
        imagesCount: 4
    },
	{
        name: 'Wikipedia Graph',
		group: 1,
        year: '2016',
        tech: ['JavaScript', 'vis.js'],
        tools: [],
        images: 'wiki',
        desc: "Simple JavaScript application to traverse Wikipedia categories and visualize them in graph form. Written in raw JS with vis.js library.",
        imagesCount: 6,
		url: "http://wikiiwi.droppages.com"
    },
	{
        name: 'Agile Games Platform',
		group: 4,
        year: '2016',
        tech: ['C#', '.NET MVC', 'MS SQL Server', 'JavaScript', 'SignalR'],
        tools: ['VisualStudio'],
        images: 'pg',
        desc: "Project performed in group of 4 people, executed along two semesters. It's online platform designated to play agile games like \"Speed boat\", \"Buy a Feature\" and others. The architecture had to be generic and elastic to allow implementation many games based on whiteboard mechanic. There were 3 games implemented. The solution is inspired by other similar project - <a href='https://conteneo.co/'>Conteneo's platform</a>. The base of any game is list of some sort of elements with associated attributes. Elements can be placed on board with definied regions. The region which element belongs to, can affects its attributes. Additional entity are tokens, which can be conencted with elements on board. Definition of game consists of definitions of elements, tokens, board, connections between them and constraints. The data stored in elements can be also represented as table. State of game is updated realtime on any client thanks to socket comunication performed by SignalR.",
        imagesCount: 5
    },
	{
        name: 'WebGL Raytracer',
		group: 1,
        year: '2017',
        tech: ['Typescript', 'WebGL'],
        tools: ['VisualStudio Code'],
        images: 'webglray',
        desc: "Raytracer in WebGL. This time also the main logic is written as single pixel (fragment) shader. Written in Typescript whose I am a big fan due to typechecks on write time and working code autocompletion. I think this language is great initiative in JavaScript world.",
        imagesCount: 4,
		url: "http://raytracer.droppages.com",
		repo: "https://github.com/bartekz93/WebGL-Raytracer"
    },
];