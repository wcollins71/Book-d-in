function runQuery(queryURL, dataType) {
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log("response", response);
            switch (dataType) {
                case "json":
                    console.log("json response", response);
                case "xml":
                    console.log("converting");
                    var xml2json = parseXmlToJson(response);
                    console.log("from xml to json", xml2json);
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

//var goodreadsTest = runQuery(createGoogleQueryURL("math", "", "ian stewart"), "json");

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

function parseXmlToJson(xmlFile) {
    // if (window.DOMParser) {
    //     parser = new DOMParser();
    //     xmlDoc = parser.parseFromString(xmlString, "text/xml");
    //     console.log("xmlDoc", xmlDoc);
    // }
    // else {
    //     xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    //     xmlDoc.async = false;
    //     xmlDoc.loadXML(xmlString);
    // }
    return JSON.parse(xml2json(xmlFile, ""));
}

//var goodreadsTest = runQuery(createGoodreadsQueryURL("hatchet", "", ""), "xml");
//var goodreadsTest = runQuery(createGoodreadsQueryURL("", "stewart", ""), "xml");
var goodreadsTest = runQuery(createGoodreadsQueryURL("", "", "", "18541"), "xml");

function goodreadsDescAsHTML(jsonDoc) {
    var description = jsonDoc.GoodreadsResponse.author.books.book[0].description;
    description = description.replace(/&lt;/g, "<",)
    description = description.replace(/&gt;/g, ">")
    return description;
}