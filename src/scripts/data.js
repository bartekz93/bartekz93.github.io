﻿var data = [
    {
        name: 'BarEngine',
		group: 1,
        year: '2009-2012',
        tech: ['C++', 'Direct3D 9/11', 'OpenGL 4'],
        tools: ['VisualStudio', 'PIX'],
		desc: 'An approach to write a graphics engine. Created in Direct3D and partially in some time also in OpenGL4 (the architecture was supposed to be generic and adjusted to use multiple renderers, but Direct3D implementation was far more complete than OpenGL). There were in fact many individual projects, because it was rewrtitten several times from scratch. It was able to load .obj files, generate terrain from heigtmaps with texture splatting, draws particles, skybox and other basic things. It has own 2D renderer to drawing 2d elements and fonts. Later it was implemented sort of deferred shading, shadow mapping and basic skeletal animation. There was also own simple GUI system with several most common controls.',
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
		desc: 'A graphics engine generating image by casting rays.  Core functionality of engine was written as a single pixel shader. It was able to display only spheres and planes. It serves diffuse and specular lightning and reflections too. Number of reflection depth is adjustable. Nowadays raytracing is common techniuqe supported by graphics cards, but then it was quite unpopular, mainly because software implementations were slow.',
        imagesCount: 6,
		videosCount: 0,
		videos: [],
		repo: "https://github.com/bartekz93/BarRaytracer"
    },
    {
        name: 'Jump&Run',
		group: 1,
        year: '2013',
        tech: ['C++', 'Allegro'],
        tools: ['VisualStudio'],
        images: 'jumpnrun',
		desc: "It's simple platform game created for 'Object Programming' course. The task was to write any game using objective oriented programming paradigm. In game we control doggy character who has to collect stars and avoid turtle enemies. There are also floating and falling platforms, moving boxes and bonuses. Levels are loaded from bitmap files, where differently colored pixels are translated into game objects. It allows to easy creating and manipulating them. An example of such bitmap is presented below.",
        imagesCount: 6,
		videosCount: 0,
		videos: [],
		repo: "https://github.com/bartekz93/JumpAndRun"
    },
	{
        name: 'Network Snake',
		group: 3,
        year: '2014',
        tech: ['C++', 'SFML', 'WinSockets'],
        tools: ['VisualStudio'],
		desc: 'Multiplayer game based on traditional snake. It allows to play by network up to 4 players. It works in client server model. The game instances on clients are updated with events distributed by server using network sockets. Event data structure consists of type field and specific data payload. Moreover, every some constant time interval, special synchronizing frame is sent. It was built in three-person group.',
        images: 'netsnake',
        imagesCount: 5,
		videosCount: 0,
		videos: []
    },
    {
        name: 'Icycle Tree Visualization',
		group: 1,
        year: '2014',
        tech: ['C#', 'WPF'],
        tools: ['VisualStudio'],
        images: 'icycle',
        desc: "Utility tool software to visualize directory as icycle tree. It allows to color nodes and dynamic change of root node (with animation). There are two coloring modes and two modes of calculating width of nodes: by number of files (every file has the same weight in width) or by their sizes in relation to parent catalog.",
        imagesCount: 4
    },
	{
        name: 'Conway\'s Game of Life',
		group: 1,
        year: '2015',
        tech: ['C#', 'WPF'],
        tools: ['VisualStudio'],
        images: 'gameoflife',
        desc: "Implementation of well known cellurar automaton - Conway's Game of Life. It has ability to color cells depends of its state, save and open files, and other basics features.",
        imagesCount: 3,
		videosCount: 0,
		videos: []
    },
	{
        name: 'Trylma',
		group: 4,
        year: '2015',
        tech: ['C#', '.NET MVC', 'MS SQL Server', 'JavaScript', 'SignalR'],
        tools: ['VisualStudio'],
        images: 'trylma',
        desc: "Online platform to play trylma - logic board game. It allows to play with humans and computer AI. There were two AI alghoritms: first of them is sort of greedy alghoritm based on evaluation function. The function rates every possible move using simple heuristics. Second is implementation of min-max alghoritm with alpha beta pruning. In this solution in every AI turn the tree game with some depth is created. The tree is used then to choose the best move from AI perspective. The realtime comunnication was performed by SignalR.",
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
		url: "apps/WikiGraph"
    },
	{
        name: 'Agile Games Platform',
		group: 4,
        year: '2016',
        tech: ['C#', '.NET MVC', 'MS SQL Server', 'JavaScript', 'SignalR'],
        tools: ['VisualStudio'],
        images: 'pg',
        desc: "Project performed in group of 4 people. It's online platform designated to play agile games like \"Speed boat\", \"Buy a Feature\" and others. The architecture had to be generic and elastic to ensure ability of implementation many games based on whiteboard mechanic. There were 3 games implemented. The solution is inspired by other similar project - <a href='https://conteneo.co/'>Conteneo's platform</a>. The base of any game is list of some sort of elements with associated attributes. Elements can be placed on board in definied regions. The region which element belongs to, can affects its attributes. Additional entity are tokens, which can be conencted with elements on board. Definition of game consists of definitions of elements, tokens, board, connections between them and constraints. The data stored in elements can be also represented as table. State of game is updated realtime on any client thanks to socket comunication performed by SignalR.",
        imagesCount: 5
    },
	{
        name: 'WebGL Raytracer',
		group: 1,
        year: '2017',
        tech: ['Typescript', 'WebGL'],
        tools: ['VisualStudio Code'],
        images: 'webglray',
        desc: "Another approach to raytracing. This time in WebGL. The main logic was written as single pixel (fragment) shader. Written in Typescript",
        imagesCount: 4,
		url: "https://bartekz93.github.io/WebGL-Raytracer/",
		repo: "https://github.com/bartekz93/WebGL-Raytracer"
    },
	{
        name: 'Note App',
		group: 1,
        year: '2017',
        tech: ['Typescript', 'Electron', 'React', 'MobX'],
        tools: ['VisualStudio Code'],
        images: 'noteapp',
        desc: "Simple note-taking application using file system (folders and .md files) to store notes. It's desktop application built with html, css and typescript and electron framework (known mainly from Atom and Visual Studio Code editors). Application is able to display md files as raw text, html preview, or both in split screen. It supports code highlightning and latex equations thanks to highlight.js and katex libraries. UI written with React is supposed to mime traditional desktop apps with dockable windows, toolbars, tabpanels, context menus and so on.",
        imagesCount: 4,
    },
	{
        name: 'PersonalStats',
		group: 1,
        year: '2024',
        tech: ['C#', '.NET', 'Angular', 'SQL Server'],
        tools: ['VisualStudio', 'VS Code'],
		desc: 'Application to tracking personal statistics like budget, activities, habits and so on',
        images: 'personalstats',
		repo: "https://github.com/bartekz93/PersonalStats",
        imagesCount: 4,
		videosCount: 0,
		videos: []
    },
];