// Retrieve data for a given URL
function retrieveData(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( 'GET', url, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

// Get a value from the querystring
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

// Load the article contents into the page
function loadArticle(){

  // Get the details for the article
  var articleId = findGetParameter('id');
  var articleUrl = './data/data-' + articleId + '.json';
  var result = retrieveData(articleUrl);

  document.getElementById('article').innerHTML = result.description;
  document.getElementById('article-title').innerHTML = result.title;
}

loadArticle();
