//Use grScript.js

function runQuery(queryURL) {
    //console.log("queryURL", queryURL);
    var a = $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("response", response);
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
                catch {
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

var queryURL1 = "https://www.googleapis.com/books/v1/volumes?q=" + inAuthor + "&key=" + gkey;
//runQuery(queryURL1);

var queryURL2 = "https://www.googleapis.com/books/v1/volumes/zyTCAlFPjgYC?key=" + gkey;
//runQuery(queryURL2);

var queryURL3 = "https://www.goodreads.com/author/list/18541?format=xml&key=ECywdpXFWS43gBG5kzCdg";
//runQuery(queryURL3);

//loadXMLDoc();

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://example.com"; // site that doesn’t send Access-Control-*
fetch(proxyurl + queryURL3) // https://cors-anywhere.herokuapp.com/https://example.com
    .then(response => response.text())
    .then(function(contents){
        if (window.DOMParser){
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(contents, "text/xml");
            jsonDoc = JSON.parse(xml2json(xmlDoc, ""));
            var description = jsonDoc.GoodreadsResponse.author.books.book[0].description;
            description = description.replace(/&lt;/g, "<",)
            description = description.replace(/&gt;/g, ">")
            document.getElementById("demo").innerHTML = description;
        }
    })
    .catch(() => console.log("Can’t access " + queryURL3 + " response. Blocked by browser?"))

runQuery(proxyurl + queryURL3);

function myFunction(xml) {
    var x, i, xmlDoc, table;
    xmlDoc = xml;
    table = "<tr><th>Title</th><th>Published</th></tr>";
    x = xmlDoc.getElementsByTagName("books")
    for (i = 0; i < x.length; i++) {
        table += "<tr><td>" +
            x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
            "</td><td>" +
            x[i].getElementsByTagName("published")[0].childNodes[0].nodeValue +
            "</td></tr>";
    }
    document.getElementById("demo").innerHTML = table;
}
