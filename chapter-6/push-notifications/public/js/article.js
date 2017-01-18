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

// Load the article contents into the page
function loadArticle(){
  // Get the details for the article
  var articleId = findGetParameter('id');
  var articleUrl = './data/data-' + articleId + '.json';
  retrieveData(articleUrl);
}

// Build the web page with the resulting data
function buildWebPage(result){
  document.getElementById('article').innerHTML = result.description;
  document.getElementById('article-title').innerHTML = result.title;
}

loadArticle();
