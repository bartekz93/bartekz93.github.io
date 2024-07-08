(function() {
	let pointsNum = 200;
	let pointR = 2;
	let maxV = 0.02;
	let alphaFactor = 15;

	let points = [];

	let canvas = document.getElementById('background-canvas');
	let canvasRect = canvas.getBoundingClientRect()
	let canvasW = canvasRect.width;
	let canvasH = canvasRect.height;
	
	
	const ctx = canvas.getContext("2d");
	canvas.width = canvasW;
	canvas.height = canvasH;
	
	let maxD = canvasW/20;
	
	function generatePoints() {
		points = [];
		for (let i=0;i<pointsNum;i++) {
			points.push({
				x: Math.random()*canvasW,
				y: Math.random()*canvasH,
				vx: Math.random()*maxV*2-maxV,
				vy: Math.random()*maxV*2-maxV
			});
		}
	}
	
	function clearCanvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	function drawPoints() {
		for (const p of points) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, pointR, 0, 2 * Math.PI);
			ctx.fillStyle = `rgba(70, 70, 70, ${1.0/alphaFactor})`
			ctx.fill();
		}
	}

	function drawLines() {
		for (const p1 of points) {
			for (const p2 of points) {
				if (p1 == p2) continue;
				
				const a = p1.x-p2.x;
				const b = p1.y-p2.y;
				const d = Math.sqrt(a*a+b*b);
				
				if (d > maxD) continue;
				const alpha = (maxD-d)/maxD;
				ctx.strokeStyle = `rgba(0, 0, 0, ${alpha/alphaFactor})`
				
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.stroke();
			}
		}
	}
	
	function update(dt) {
		for (const p of points) {
			p.x += p.vx*dt;
			p.y += p.vy*dt;
			
			if (p.x >= canvasW || p.x <= 0) p.vx = -p.vx;
			if (p.y >= canvasH || p.y <= 0) p.vy = -p.vy;
		}
	}
	
	generatePoints();
	
	const dt = 1000/30;
	setInterval(() => {
		update(dt);
		clearCanvas();
		drawPoints();
		drawLines();
	}, dt)
}());