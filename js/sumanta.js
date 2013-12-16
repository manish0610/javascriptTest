function search() {
    var searchKeyword = document.getElementById("searchInput").value;
   
    var url = 'https://graph.facebook.com/search?q=' + searchKeyword + '&limit=10&type=page&fields=id,name,picture,description,about&access_token=1424806984416908|5iTdSFU0MMSyDPL1CdhLxdhyBaA';

    getResult(url);
}

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

function getResult(url) {
    document.getElementById("searchResult").innerHTML = "Please Wait...";
    ajaxCall.ajax.getJSON({
        url: url,
        //url: 'https://graph.facebook.com/' + searchKeyword,
        // url : "https://www.facebook.com/dialog/oauth?client_id=1424806984416908&redirect_uri=http://localhost:61813/Home.htm&response_type=token",
        type: 'jsonp'
    }, function (jsondata) {
        var response = JSON.parse(jsondata);
        displayResult(response.data,response.paging);

    });
}

function displayResult(data,paging) {
    document.getElementById("searchResult").innerHTML = "";
    if (data.length > 0) {
        var resultList = document.createElement("ul");
        resultList.setAttribute("class","result-list");
        document.getElementById("searchResult").appendChild(resultList);
        for (var i = 0; i < data.length; i++) {
            var href = 'https://www.facebook.com/' + data[i].id;
            var html = "<li><div class='move-left profile-pic'><img src=" + data[i].picture.data.url + " alt=" + data[i].name + " height='100px' width='100px'/></div>" +
            "<div class='move-left page-metadata'><p><a href=" + href + " target='_blank' newTab='true'>" + data[i].name + "</a></p>";

            if (data[i].about)
              html += "<p style='float:left'> About : " + data[i].about + "</p>";   
            if (data[i].description)
                html += "<p style='float:left'> Description : " + data[i].description + "</p>";
            html += "</div></li>"
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
    previousButton.setAttribute("class", "move-left");
    previousButton.innerHTML = "Previous";
    previousButton.addEventListener('click', function () {
        getResult(url);
    }, false);
    document.getElementById("searchResult").appendChild(previousButton);
}
function nextBtn(url) {
    var nextButton = document.createElement("button");
    nextButton.setAttribute("class", "move-right");
    nextButton.innerHTML = "Next";
    nextButton.addEventListener('click', function () {
        getResult(url);
    }, false);
    document.getElementById("searchResult").appendChild(nextButton);
}