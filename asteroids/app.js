$(function () {
	var canvas = $("<canvas id='cvs' width='" + 800 +
		"' height='" + 800 + "'></canvas>");

	$('body').append(canvas);
	console.log('calling new Asteroids')
	new Asteroids.Game(800, 800, 6).start(canvas.get(0));
});
