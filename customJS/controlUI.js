
const starCount = 0;
const starArea = document.getElementById('starArea');
for (let i = 0; i < starCount; i++) {
	const star = document.createElement('div');
	star.className = 'star';
	const x = Math.random() * 100;
	const y = Math.random() * 40;
	const size = 2 + Math.random() * 8;
	const delay = Math.random() * 5;
	const duration = 5 + Math.random() * 5;
	star.style.position = 'absolute';
	star.style.left = `${x}%`;
	star.style.top = `${y}%`;
	star.style.width = `${size}px`;
	star.style.height = `${size}px`;
	star.style.animation = `starFade ${duration}s linear ${delay}s infinite`;
	starArea.appendChild(star);
}

// Add this CSS to your stylesheet or inject it via JS
const style = document.createElement('style');
style.innerHTML = `
@keyframes starFade {
	0% { opacity: 0; }
	50% { opacity: 1; }
	100% { opacity: 0; }
}
.star {
	pointer-events: none;
	z-index: 5;
}
`;
document.head.appendChild(style);

$(document).ready(function() {
	$('.part-title').on('click', function() {
		var pdfName = ''
		const id = this.id;
		if (id == "partTitle0") {
			pdfName = 'drone.pdf';
		} else if (id == "partTitle1") {
			pdfName = 'engine.pdf';
		} else if (id == "partTitle2") {
			pdfName = 'shelf_angle_brick.pdf';
		}

		window.open('pdf/' + pdfName, '_blank');
	});
});
