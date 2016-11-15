function retrieveData(url) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        buildWebPage(result);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
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
}

function buildWebPage(result) {
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
