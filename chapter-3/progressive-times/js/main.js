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

// Load the latest news data and populate content
function loadLatestNews(){
  var dataUrl = './data/latest.json';
  var result = retrieveData(dataUrl);

  // Build up our HTML
  var latestNews = '';

  // Loop through the results
  for (var i = 0; i < result.latestNews.length; i++) {

    var title = '<h2><a href="./article.html?id=' + result.latestNews[i].id + '">' + result.latestNews[i].title + '</a></h2>';
    var description = '<p>' + result.latestNews[i].description + '</p>'

    latestNews += title + description;
  }

  // Update the DOM with the data
  document.getElementById('latest').innerHTML = latestNews;
}

loadLatestNews();
