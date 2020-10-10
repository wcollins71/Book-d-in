// Locally stored isbn numbers for reading list
var myLibrary = [];

// Load any locally stored isbn numbers into arrray
function loadLibraryFromLS() {
    var mLib = localStorage.getItem("BookdInLibrary");
    if (mLib !== null) {
        myLibrary = JSON.parse(mLib);
    }
}

// Run queries for various parts of the web page
function runQuery(queryURL, resultTo) {
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            //console.log("response", response);
            switch (resultTo) {
                case "Popular":
                    addToPopular(response);
                    var isbn = response.results.books[0].primary_isbn10;
                    if (isbn !== null) {
                        var gQuery = createGoogleQueryURL("", "", "", "", "", isbn, "", "");
                        runQuery(gQuery, "AllAboutABook");
                    }
                    break;
                case "SearchResult":
                    addToEle(response, false);
                    var isbn = response.items[0].volumeInfo.industryIdentifiers[0].identifier;
                    if (isbn !== null) {
                        var gQuery = createGoogleQueryURL("", "", "", "", "", isbn, "", "");
                        runQuery(gQuery, "AllAboutABook");
                    }
                    break;
                case "MyLibrary":
                    addToEle(response, true);
                    break;
                case "AllAboutABook":
                    allAboutABook(response);
                    break;
            }
        });
}

// Generate google books api queryURL
// https://developers.google.com/books/docs/v1/using
function createGoogleQueryURL(freetext = "", title = "", author = "", subject = "", publisher = "",
    isbn = "", lccn = "", oclc = "") {

    var inTitle = "";
    var inAuthor = "";
    var inPublisher = "";
    var inSubject = "";
    var inisbn = "";
    var inlccn = "";
    var inoclc = "";

    if (freetext !== "") {
        freetext = freetext.replace(/ /g, "+") + "+";
    }
    if (title !== "") {
        inTitle = "intitle:" + title.replace(/ /g, "+") + "+";
    }
    if (author !== "") {
        inAuthor = "inauthor:" + author.replace(/ /g, "+") + "+";
    }
    if (publisher !== "") {
        inPublisher = "inpublisher:" + publisher.replace(/ /g, "+") + "+";
    }
    if (subject !== "") {
        inSubject = "subject:" + subject.replace(/ /g, "+") + "+";
    }
    if (isbn !== "") {
        inisbn = "isbn:" + isbn + "+";
    }
    if (lccn !== "") {
        inlccn = "lccn:" + lccn + "+";
    }
    if (oclc !== "") {
        inoclc = "oclc:" + oclc + "+";
    }

    var searchString = freetext + inTitle + inAuthor +
        inPublisher + inSubject + inisbn + inlccn + inoclc;

    if (searchString[searchString.length - 1] === "+") {
        searchString = searchString.slice("+", -1);
    }

    return "https://www.googleapis.com/books/v1/volumes?q=" +
        searchString + "&key=" + googleKey;
}

// Generate NYT api queryURL
// https://developer.nytimes.com/docs/books-product/1/overview
function createNYTQueryURL() {
    nytQueryURL = "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=" + NYTKey;
    return nytQueryURL;
}

// Render query results to popular books display
function addToPopular(qResponse) {
    var books = qResponse.results.books;
    $(".recommended-list").empty();
    for (var i = 0; i < 10; i++) {
        var div = $("<div>");
        div.addClass("zoom");
        div.attr("isbn", books[i].primary_isbn10);

        var bookTitle = $("<p>");
        bookTitle.text(books[i].title);
        div.append(bookTitle);

        var author = $("<p>");
        author.text(books[i].author);
        div.append(author);

        var img = $("<img>");
        var scale = 25 / 100;
        img.height(books[i].book_image_height * scale);
        img.width(books[i].book_image_width * scale);
        img.attr("src", books[i].book_image);
        div.append(img);

        $(".recommended-list").append(div);
    }
}

// Render query results to search resuts or readinf list display
function addToEle(qResponse, isLibrary) {
    var books = qResponse.items;

    var mainEle;

    if (isLibrary) {
        mainEle = ".reading-list";
    }
    else {
        mainEle = ".search-results";
        $(mainEle).empty();
        //document.getElementsByClassName('search-results')[0].parentElement.classList.remove("is-hidden");
        if (books === undefined) {
            var noResults = $("<p>");
            noResults.text("No results found. Please try again.");
            $(mainEle).append(noResults);
            return;
        }
    }

    var count = Math.min(10, books.length)
    for (var i = 0; i < count; i++) {
        if (books[i].volumeInfo.hasOwnProperty("industryIdentifiers")) {
            var div = $("<div>");
            div.addClass("zoom");
            var isbn = books[i].volumeInfo.industryIdentifiers[0].identifier;
            div.attr("isbn", isbn);

            var bookTitle = $("<p>");
            bookTitle.text(books[i].volumeInfo.title);
            div.append(bookTitle);

            var author = $("<p>");
            author.text(books[i].volumeInfo.authors[0]);
            div.append(author);

            var img = $("<img>");
            img.height(125);
            img.width(82.25);
            img.attr("src", books[i].volumeInfo.imageLinks.smallThumbnail);
            div.append(img);

            $(mainEle).append(div);
        }
    }
}

// Render details about specific book to display
function allAboutABook(qResponse) {
    var volInfo = qResponse.items[0].volumeInfo;
    $(".all-about-a-book").empty();

    var bookTitle = $("<p>");
    bookTitle.text(volInfo.title);
    bookTitle.addClass("title");
    $(".all-about-a-book").append(bookTitle);

    var author = $("<p>");
    var authorText = "";
    volInfo.authors.forEach(author => {
        authorText = authorText + "," + author;
    });
    if (authorText[0] === ",") {
        authorText = authorText.substr(1);
    }
    author.text(authorText);
    $(".all-about-a-book").append(author);

    var rating = $("<p>");
    rating.addClass("rating");
    rating.text(createStarRating(Math.round(volInfo.averageRating)));
    $(".all-about-a-book").append(rating);

    var img = $("<img>");
    img.attr("src", volInfo.imageLinks.thumbnail);
    $(".all-about-a-book").append(img);

    var description = $("<p>");
    description.text(volInfo.description);
    $(".all-about-a-book").append(description);

    var publish = $("<p>");
    publish.text("Published: " + volInfo.publishedDate + ", " + volInfo.publisher);
    $(".all-about-a-book").append(publish);

    var previewLink = $("<a>");
    previewLink.text("Preview");
    previewLink.attr("href", volInfo.previewLink);
    previewLink.attr("target", "blank");
    $(".all-about-a-book").append(previewLink);

    var saleInfo = qResponse.items[0].saleInfo;
    var saleP = $("<p>");
    $(".all-about-a-book").append(description);
    if (saleInfo.saleability === "NOT_FOR_SALE") {
        saleP.text("Not for sale in " + saleInfo.country);
    }
    else {
        saleP.text("++++++");
    }
    $(".all-about-a-book").append(saleP);

    var btn = $("<button>");
    btn.addClass("book-store");
    btn.addClass("button is-success");
    var isbn = volInfo.industryIdentifiers[0].identifier;
    if (myLibrary.indexOf(isbn) === -1) {
        btn.text("Add To Reading List");
    }
    else {
        btn.text("Remove From Reading List");
    }
    btn.attr("isbn", isbn)
    $(".all-about-a-book").append(btn);
    document.getElementById("searchBar").scrollIntoView();
}

// Function to display number of stars from number value
function createStarRating(rating) {
    if (isNaN(rating)){
        ratingText = "No rating available."
    } 
    else {
        ratingText = "";
        for (var i = 1; i < rating; i++) {
            ratingText = ratingText + "★";
        }
    }
    return "Average Rating: " + ratingText;
}

// Run query to get most popular reads from NYT
runQuery(createNYTQueryURL(), "Popular");

// on-click event watching the 'recommended-list' container 
// for clicks on the dynamically generated divs
$(".recommended-list").on("click", "div", function (event) {
    event.preventDefault();
    var isbn = $(this).attr("isbn");
    var gQuery = createGoogleQueryURL("", "", "", "", "", isbn, "", "");
    runQuery(gQuery, "AllAboutABook");
});

// on-click event for the search button
$(".is-success").on("click", function (event) {
    event.preventDefault();
    if ($(".input").val()) {
        runSearch();
    }
});

// keypress event (Enter) for search field
$(".input").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == "13" && $(".input").val()) {
        runSearch();
    }
})

// Function to run search from either click or 'Enter'. Display the results
function runSearch() {
    var bookName = $(".input").val();
        var gQuery = createGoogleQueryURL("", bookName, "", "", "", "", "", "");
        $(".input").val("");
        runQuery(gQuery, "SearchResult");
        var recommendedCard = $("#recommendedCard");
        recommendedCard.addClass("is-hidden");
        var readingListCard = $("#readingListCard");
        readingListCard.addClass("is-hidden");
        var searchCard = $("#searchCard");
        searchCard.removeClass("is-hidden");
}

// on-click event watching the 'search results' container 
// for clicks on the dynamically generated divs
$(".search-results").on("click", "div", function (event) {
    event.preventDefault();
    var isbn = $(this).attr("isbn");
    var gQuery = createGoogleQueryURL("", "", "", "", "", isbn, "", "");
    runQuery(gQuery, "AllAboutABook");
});

// on-click event watching the 'reading-list' container 
// for clicks on the dynamically generated divs
$(".reading-list").on("click", "div", function (event) {
    event.preventDefault();
    var isbn = $(this).attr("isbn");
    var gQuery = createGoogleQueryURL("", "", "", "", "", isbn, "", "");
    runQuery(gQuery, "AllAboutABook");
});

// Function add MyLibrary to local storage
function addLibraryToLS() {
    localStorage.setItem("BookdInLibrary", JSON.stringify(myLibrary));
}

// on-click event to add/remove myLibrary(Reading List) in local storage
$(".all-about-a-book").on("click", "button", function (event) {
    event.preventDefault();
    var isbn = $(this).attr("isbn");
    if (myLibrary.indexOf(isbn) === -1) {
        myLibrary.push(isbn);
        addLibraryToLS();
        $(this).text("Remove From Reading List")
    }
    else {
        var indexOf = myLibrary.indexOf(isbn);
        myLibrary.splice(indexOf, 1);
        addLibraryToLS();
        $(this).text("Add To Reading List")
    }
    CreateMyLibrary();
});

// Generate libray from array of isbn's
function CreateMyLibrary() {
    $(".reading-list").empty();
    myLibrary.forEach(isbn => {
        var gQuery = createGoogleQueryURL("", "", "", "", "", isbn, "", "");
        runQuery(gQuery, "MyLibrary");
    });
}

// Initialise the display
function init() {
    loadLibraryFromLS();
    CreateMyLibrary();
}

init();