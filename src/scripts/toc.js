(function() {
	var toc = document.querySelector('.toc');
	var headers = document.body.querySelectorAll('.project-name');
	var container = document.querySelector('body, html');
	
	toc.innerHTML = `
		<ul>
			${data.map(project => `<li>${project.name}</li>` ).join('')}
		</ul>`;
		
	var tocitems = toc.querySelectorAll('li');
	
	tocitems.forEach((item, i)=> {
		item.onclick = () => {
			var desiredScroll = headers[i].offsetTop-75;
			var currentScroll = container.scrollTop;
			
			listenScroll = false;
			animVariable(currentScroll, desiredScroll, 1000, (value) => {
				container.scrollTop = value;
			}, () => {
				listenScroll = true;
				updateToc();
			});
		}
	})
	
	var current_header;
	var listenScroll = true;
	
	function updateToc() {
		var temp, last;
		for (var i=0;i<headers.length;i++) {
			var header = headers[i];
			if (header.offsetTop - container.scrollTop-container.clientHeight/2 > 0) {
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
	
	
	document.addEventListener('scroll', function() {
		if (listenScroll) {
			updateToc();
		}
	});
}());