var googleKey = "AIzaSyB3Qzo1a4rCazh4WBWqJD86n-lcaEl8EXQ";
var goodreadsKey = "ECywdpXFWS43gBG5kzCdg";
var NYTKey = "n15ez4bKjkD95piAFdmGZdIpcnTaxuiT";

document.addEventListener('DOMContentLoaded', function () {
	let cardToggles = document.getElementsByClassName('card-toggle');
	for (let i = 0; i < cardToggles.length; i++) {
		cardToggles[i].addEventListener('click', e => {
			var searchCard = $("#searchCard");
			searchCard.addClass("is-hidden");
			var readingListCard = $("#readingListCard");
			readingListCard.addClass("is-hidden");
			var recommendedCard = $("#recommendedCard");
			recommendedCard.addClass("is-hidden");
			e.currentTarget.parentElement.parentElement.childNodes[3].classList.toggle('is-hidden');
		});
	}
});

