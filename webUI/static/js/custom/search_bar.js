$(document).ready(function () {
    // Categories

    // Search Functionality
    let query = "";

    $("#search").keyup(function () {
        $(".list-group").css("display", "block");

        $("#chart").css("display", "none");
        $("#news").css("display", "block");


        query = $("#search").val();

        let timer = setTimeout(function () {
            $.ajax({
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                dataType: 'json',
                url: '/search_title/',
                type: 'POST',
                data: query,
                success: function (documents) {
                    $("#total").text(documents.total);
                    $(".list-group").empty();
                    let list = "";
                    documents.body.forEach(function (document) {
                        let title = "";
                        if (document._source.TITLE.length > 60) {
                            title = document._source.TITLE.substring(0, 60) + ' ...'
                        }
                        else {
                            title = document._source.TITLE;
                        }
                        list += '<a onclick="title_handler(event)" id="' + document._id + '" class="list-group-item" style="cursor:pointer; direction: rtl; font-family: custom;">'
                            + title + '<span style="float: left;font-size: 18px; color: blue">' +
                            document._score.toFixed(1) +
                            '</span>' +
                            '</a>'

                    });
                    $(".list-group").append(list);
                },
                error: function () {
                    alert('fail');
                    clearTimeout(timer)
                }
            })
        }, 500);

        $("#search").keyup(function () {

            clearTimeout(timer);
            timer = setTimeout(function () {
                query = $("#search").val();
            }, 500);
        });
    });


});

// CSRF Generator
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie != '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function title_handler(event) {
    $(".list-group").css("display", "none");
    let id = event.target.id;
    $.ajax({
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        dataType: 'json',
        url: '/get_body/',
        type: 'POST',
        data: id,
        success: function (data) {

            $("#docid").text(data["doc"]["hits"]["hits"][0]["_id"]);

            let document = data["doc"]['hits']['hits'][0]["_source"];

            $("#DOCID").text(document.DOCID);
            $("#p_category").text(document.CAT[0].toString());
            $("#TITLE").text(document.TITLE);
            $("#TEXT").text(document.TEXT);
        },
        error: function () {

        }
    });
}