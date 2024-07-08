(function() {
	var toc = document.querySelector('.toc');
	var headers = document.body.querySelectorAll('.project-name');
	var container = document.querySelector('.page');
	window.c = container;
	
	toc.innerHTML = `
		<ul>
			${data.map((project, i) => `<li id="${i}">${project.name}</li>` ).join('')}
		</ul>`;
		
	var tocitems = toc.querySelectorAll('li');
	
	for (var i=0;i<tocitems.length;i++) {
		tocitems[i].onclick = function() {
			var desiredScroll = headers[this.id].offsetTop-75;
			var currentScroll = container.scrollTop;
			
			listenScroll = false;
			animVariable(currentScroll, desiredScroll, 1000, (value) => {
				container.scrollTop = value;
			}, () => {
				listenScroll = true;
				updateToc();
			});
		}
	}
	
	var current_header;
	var listenScroll = true;
	
	function updateToc() {
		var temp, last;
		for (var i=0;i<headers.length;i++) {
			var header = headers[i];
			var screenPos = header.offsetTop - container.scrollTop;
			if (screenPos > container.clientHeight/4) {
				temp = i;
				break;
			}
		}
		
		if (temp != current_header) {
			setTocMark(temp, current_header);
		}
	}
	
	function setTocMark(current, last) {
		if (last) {
			tocitems[last-1].classList.remove('active');
		}
		if (current) {
			tocitems[current-1].classList.add('active');
		}
		current_header = current;
	}
	
	
	container.addEventListener('scroll', function() {
		if (listenScroll) {
			updateToc();
		}
	});
}());