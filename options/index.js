document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);

function restore() {
	chrome.storage.local.get(null, options => {
		document.getElementById('game').value = options.game || 'NOOP';
		document.getElementById('interval').value = options.interval || 0.5;
	});
}

function save() {
	const options = {
		game: document.getElementById('game').value,
		interval: document.getElementById('interval').value
	};

	chrome.storage.local.set(options, function () {
		document.querySelector('.container').insertAdjacentHTML('afterbegin',
			`<div class="alert alert-success" role="alert">Сохранено</div>`)
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	});
}
