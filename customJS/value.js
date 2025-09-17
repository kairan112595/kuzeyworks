
export const camDis = 120, groundDis = camDis * 20, scaleRatio = 0.01;
export const canvasTop = 150; 

export function getCSize(num) {
	const {innerWidth, innerHeight} = window;
	var eWidth = 0, width = 0, gap = 0, height = 0, top = 0, left = 0;
	if (innerWidth > 600) {
		if (innerWidth > 1440) {
			eWidth = 1440/3;
			gap = 50;
		} else {
			eWidth = innerWidth/3;
			gap = 30;
		}
		width = eWidth - gap * 2;
		left = (innerWidth / 2 - eWidth * 1.5) + eWidth * num + gap;
		top = canvasTop;
		height = width;
	} else {
		eWidth = innerWidth;
		gap = 30;
		width = eWidth - gap * 2;
		left = gap;
		height = width;
		top = canvasTop + (width + 120) * num;
	}
	return {width, height, gap, top, left};
}