function runQuery(queryURL) {
    //console.log("queryURL", queryURL);
    var a = $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("res", response);
            for (var i = 0; i < response.items.length; i++) {
                var volInfo = response.items[i].volumeInfo;
                var saleInfo = response.items[i].saleInfo;

                //Author
                var author = $("<p>");
                author.text("Author(s): " + volInfo.authors);
                $(".stuff").append(author);

                //Title
                var title = $("<p>");
                title.text("Title: " + volInfo.title);
                $(".stuff").append(title);

                //Description
                var description = $("<p>");
                description.text(volInfo.description);
                $(".stuff").append(description);

                //Rating
                var rating = $("<p>");
                rating.text("Average Rating: " + volInfo.averageRating);
                $(".stuff").append(rating);

                //Price
                try {
                    var listprice = $("<p>");
                    listprice.text("List Price: " + saleInfo.listPrice.amount +
                        saleInfo.listPrice.currencyCode);
                    $(".stuff").append(listprice);
                    var retailprice = $("<p>");
                    retailprice.text("Retail Price: " + saleInfo.retailPrice.amount +
                        saleInfo.retailPrice.currencyCode);
                    $(".stuff").append(retailprice);
                }
                catch{
                    var notice = $("<p>");
                    notice.text("Not for sale ");
                    $(".stuff").append(notice);
                }
                


                $(".stuff").append($("<br>"));
            }
        });
}

// https://developers.google.com/books/docs/v1/using

var inTitle = "";
var inAuthor = "inauthor:robert+ludlum";
var inPublisher = "";
var subject = "";
var isbn = "";
var lccn = "";
var oclc = "";

var queryURL1 = "https://www.googleapis.com/books/v1/volumes?q=" + inAuthor + "&key=" + gKey;
runQuery(queryURL1);

var queryURL2 = "https://www.googleapis.com/books/v1/volumes/zyTCAlFPjgYC?key=" + gKey;
//runQuery(queryURL2);