function search() {
    var searchKeyword = document.getElementById("searchInput").value;
    document.getElementById("searchResult").innerHTML = "Please Wait...";
    Lib.ajax.getJSON({
        url: 'https://graph.facebook.com/search?q=' + searchKeyword + '&type=page&fields=id,name,profilepicture,description,about&access_token=200148743506711%7C7X-bp7uU1yoD1T-Emwjn7DxAuJM',
        //url: 'https://graph.facebook.com/' + searchKeyword,
        // url : "https://www.facebook.com/dialog/oauth?client_id=1424806984416908&redirect_uri=http://localhost:61813/Home.htm&response_type=token",
        type: 'jsonp'
    }, function (jsondata) {
        var response = JSON.parse(jsondata);
        var data = response.data;
        document.getElementById("searchResult").innerHTML = "";
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var href = 'https://www.facebook.com/' + data[i].id;
                var html = "<div><div><a href=" + href + " target='_blank' newTab='true'>" + data[i].name + "</a></div>" +
                           "<div><img src=" + data[i].profilepicture.data.url + " alt=" + data[i].name + " height='100px' width='100px' />";
                if (data[i].description)
                    html += data[i].description;
                    html += "</div></div>"
                document.getElementById("searchResult").innerHTML += html + "<br />";
            }
        }
        else {
            document.getElementById("searchResult").innerHTML = "No Result found";
        }
    });
}

(function () {
    var Lib = {
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

    window.Lib = Lib;
})()
