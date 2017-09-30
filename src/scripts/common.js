

function animVariable(value, desiredValue, duration, action, end) {
	var diff = desiredValue - value;
	var easeOutQuint = function (t) { return 1+(--t)*t*t };
	
	var t = 0;
	var step = 60;
	var interval = setInterval(() => {
		if (t >= duration) {
			action(desiredValue);
			clearInterval(interval);
			end();
		}
		else {
			action(value+diff*easeOutQuint(t/duration));
		}
		t += step;
	}, 60);
}