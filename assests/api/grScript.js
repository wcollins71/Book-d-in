function runQuery(queryURL, dataType, resultTo) {
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("response", response);
            switch (dataType) {
                case "json":
                    break;
                case "xml":
                    response = parseXmlToJson(response);
                    break;
            }
            switch (resultTo) {
                case "Popular":
                    addToPopular(response);
                    break;
                case "SearchResult":
                    addToSearch(response);
                    break;
                case "AllAboutABook":
                    allAboutABook(response);
                    break;
            }
        });
}

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

// https://www.goodreads.com/api/index#author.books
function createGoodreadsQueryURL(title = "", author = "", isbn = "", authorID = "") {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const goodreadsurl = "https://www.goodreads.com/";

    // These query urls return xml data - needs to be converted.
    if (author !== "" && title === "" && isbn === "") {
        console.log("goodreads: author search");
        author = author.replace(/ /g, "%20");
        grQueryURL = "api/author_url/" + author + "?key=" + goodreadsKey;
    }
    else if (authorID !== "") {
        console.log("goodreads: author id");
        authorID = authorID.trim();
        grQueryURL = "author/list/" + authorID + "?format=xml&key=" + goodreadsKey;
    }
    else {
        console.log("goodreads: search all");
        searchtext = title + "+" + author + "+" + isbn;
        searchtext = searchtext.replace(/ /g, "+");
        grQueryURL = "search/index.xml?key=" + goodreadsKey + "&q=" + searchtext;
    }

    return proxyurl + goodreadsurl + grQueryURL;
}

// https://developer.nytimes.com/docs/books-product/1/overview
function createNYTQueryURL() {
    nytQueryURL = "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=" + NYTKey;
    console.log(nytQueryURL);
    return nytQueryURL;
}


function parseXmlToJson(xmlFile) {
    return JSON.parse(xml2json(xmlFile, ""));
}

function goodreadsDescAsHTML(jsonDoc) {
    var description = jsonDoc.GoodreadsResponse.author.books.book[0].description;
    description = description.replace(/&lt;/g, "<",)
    description = description.replace(/&gt;/g, ">")
    return description;
}

function addToPopular(qResponse) {
    var books = qResponse.results.books;
    $(".recommended-list").empty();
    for (var i = 0; i < 10; i++) {
        var div = $("<div>");
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

function addToSearch(qResponse) {
    var books = qResponse.items;
    $(".search-results").empty();
    for (var i = 0; i < 10; i++) {
        if (books[i].volumeInfo.hasOwnProperty("industryIdentifiers")) {
            var div = $("<div>");
            var isbn = books[i].volumeInfo.industryIdentifiers[0].identifier;
            div.attr("isbn", isbn);
            console.log("test");

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

            $(".search-results").append(div);
        }
    }
}

function allAboutABook(qResponse) {
    var volInfo = qResponse.items[0].volumeInfo;
    $(".all-about-a-book").empty();

    var bookTitle = $("<p>");
    bookTitle.text(volInfo.title);
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
}

function createStarRating(rating) {
    ratingText = "";
    for (var i = 1; i < rating; i++) {
        ratingText = ratingText + "★";
    }
    return "Average Rating: " + ratingText;
}

// Add to most popular reads
runQuery(createNYTQueryURL(), "json", "Popular");

// on-click event watching the 'recommended-list' container 
// for clicks on the dynamically generated divs
$(".recommended-list").on("click", "div", function (event) {
    event.preventDefault();
    var isbn = $(this).attr("isbn");
    //console.log(isbn);
    var gQuery = createGoogleQueryURL("", "", "", "", "", isbn, "", "");
    runQuery(gQuery, "json", "AllAboutABook");
});

// on-click event for the search button
$(".is-success").on("click", function (event) {
    event.preventDefault();
    if ($(".input").val()) {
        var bookName = $(".input").val();
        var gQuery = createGoogleQueryURL("", bookName, "", "", "", "", "", "");
        $(".input").val("");
        runQuery(gQuery, "json", "SearchResult");
    }
});

// on-click event watching the 'search results' container 
// for clicks on the dynamically generated divs
$(".search-results").on("click", "div", function (event) {
    event.preventDefault();
    var isbn = $(this).attr("isbn");
    //console.log(isbn);
    var gQuery = createGoogleQueryURL("", "", "", "", "", isbn, "", "");
    runQuery(gQuery, "json", "AllAboutABook");
});



