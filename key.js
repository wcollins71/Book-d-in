var googleKey = "AIzaSyB3Qzo1a4rCazh4WBWqJD86n-lcaEl8EXQ";
var goodreadsKey = "ECywdpXFWS43gBG5kzCdg";
var NYTKey = "n15ez4bKjkD95piAFdmGZdIpcnTaxuiT";

document.addEventListener('DOMContentLoaded', function() {
	let cardToggles = document.getElementsByClassName('card-toggle');
	for (let i = 0; i < cardToggles.length; i++) {
		cardToggles[i].addEventListener('click', e => {
      console.log(document.body);
			e.currentTarget.parentElement.parentElement.childNodes[3].classList.toggle('is-hidden');
		});
	}
});