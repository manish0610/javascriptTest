var access_token = getAccessToken();
var userData = null;
var userDetailsUrl = null;

if (access_token == -1) {
    window.location.assign("https://www.facebook.com/dialog/oauth?client_id=200148743506711&display=popup&response_type=token&redirect_uri=" + document.URL);
}
else {
     userDetailsUrl = "https://graph.facebook.com/me?access_token=" + access_token;
   
}
 function setUserData(jsonData) {
     try {
         userData = JSON.parse(jsonData);
         userLikedPages();
     } catch (e) { }
  }

function userLikedPages() {
        document.getElementById("searchResult").innerHTML = "Please Wait...";
        var userlikedPage = "https://graph.facebook.com/me/likes?fields=id,name,picture,link,description,about&access_token=" + access_token;
        getResult(userlikedPage, displayResult);
 }

function search() {
    var searchKeyword = document.getElementById("searchInput").value;
    document.getElementById("searchResult").innerHTML = "Please Wait...";
    var url = 'https://graph.facebook.com/search?q=' + searchKeyword + '&limit=10&type=page&fields=id,name,link,picture,description,about&access_token='+access_token;
    getResult(url, displayResult);
}

function getResult(url,callback) {
    ajaxCall.ajax.getJSON({
        url: url,
        type: 'jsonp'
    },callback);
}

function displayResult(jsondata) {
    var response = JSON.parse(jsondata);
    var data=response.data;
    var paging=response.paging;
    document.getElementById("searchResult").innerHTML = "";
    if (data.length > 0) {
        var resultList = document.createElement("ul");
        resultList.setAttribute("class", "result-list");
        document.getElementById("searchResult").appendChild(resultList);
        for (var i = 0; i < data.length; i++) {
            var html = "<li><p><img src=" + data[i].picture.data.url + " alt=" + data[i].name + " class='profile-pic move-left'/>" +
            "<p><a href=" + data[i].link + " target='_blank' newTab='true'>" + data[i].name + "</a></p>";

            if (data[i].about)
                html += "<p><span class='meta-data'>About : </span>" + data[i].about + "</p>";
            if (data[i].description) {
                html += "<p class='more-link' onClick='toggelElement(getElement(\"#desc" + data[i].id + "\"))'>Show More...</p>";
                html += "<p style='display:none;' id=desc" + data[i].id + " ><span class='meta-data'> Description : </span>" + data[i].description + "</p>";
            }
            html += "</p></li>"
            resultList.innerHTML += html;
        }
        if (paging.previous) {
            prevBtn(paging.previous)
        }
        if (paging.next) {
            nextBtn(paging.next)
        }

    }
    else {
        document.getElementById("searchResult").innerHTML = "No Result found";
        if (paging.previous) {
            nextBtn(paging.previous)
        }
    }
}

function prevBtn(url) {
    var previousButton = document.createElement("button");
    previousButton.setAttribute("class", "move-left btn");
    previousButton.innerHTML = "Previous";
    previousButton.addEventListener('click', function () {
        document.getElementById("searchResult").innerHTML = "Please Wait...";
        getResult(url, displayResult);
    }, false);
    document.getElementById("searchResult").appendChild(previousButton);
}
function nextBtn(url) {
    var nextButton = document.createElement("button");
    nextButton.setAttribute("class", "move-right btn");
    nextButton.innerHTML = "Next";
    nextButton.addEventListener('click', function () {
        document.getElementById("searchResult").innerHTML = "Please Wait...";
        getResult(url, displayResult);
    }, false);
    document.getElementById("searchResult").appendChild(nextButton);
}

function getAccessToken(variable) {
    try {
        var access_token = window.location.hash.split('=')[1].split('&')[0];
        if (access_token != "") {
            return access_token;
        }
    }
    catch (e) {
        return -1;
    }
}

function getElement(selectors) {
   return document.querySelectorAll(selectors);
}

function toggelElement(elements) {
    for (var i = 0; i < elements.length;i++) {
        if (elements[i].style.display !== 'none') {
            elements[i].style.display = 'none';
        }
        else {
            elements[i].style.display = 'block';
        }
    }
}

//Function for making Ajax Call.
(function () {
    var ajaxCall = {
        ajax: {
            xhr: function () {
                var instance = new XMLHttpRequest();
                return instance;
            },
            getJSON: function (options, callback) {
                var xhttp = this.xhr();
                options.url = options.url || location.href;
                options.data = options.data || null;
                callback = callback ||
                function () { };
                options.type = options.type || 'json';
                var url = options.url;
                if (options.type == 'jsonp') {
                    window.jsonCallback = callback;
                    var $url = url.replace('callback=?', 'callback=jsonCallback');
                    var script = document.createElement('script');
                    script.src = $url;
                    document.body.appendChild(script);
                }
                xhttp.open('GET', options.url, true);
                xhttp.send(options.data);
                xhttp.onreadystatechange = function () {
                    if (xhttp.status == 200 && xhttp.readyState == 4) {
                        callback(xhttp.responseText);
                    }
                };
            }
        }
    };
    window.ajaxCall = ajaxCall;
})();
 