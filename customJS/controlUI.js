
function clickArrow() {
	showControl = !showControl;
	const setting = document.getElementById('setting');
	if (showControl) {
		setting.classList.remove('hide');
	} else {
		setting.classList.add('hide');
	}
}
