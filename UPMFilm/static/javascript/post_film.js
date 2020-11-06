$(document).ready(function(){
    var error = $("#error")[0].value;
    if(error != ""){
        $("#film_name")[0].value = $("#film_name_hid")[0].value;
        $("#film_url")[0].value = $("#film_url_hid")[0].value;
        $("#film_description")[0].value = $("#film_description_hid")[0].value;
        $("#film_age")[0].value = $("#film_date_hid")[0].value;
        $("#film_director")[0].value = $("#film_director_hid")[0].value;
        $("#film_actors")[0].value = $("#film_actors_hid")[0].value;
        $("#film_poster")[0].value = $("#film_poster_hid")[0].value;
        $("#film_rating")[0].value = $("#film_rating_hid")[0].value;
    }
})

$("#confirm").click(function (event) {
    var film_name        =  $("#film_name")[0].value.trim();
    var film_url         =  $("#film_url")[0].value.trim();
    var film_description =  $("#film_description")[0].value;
    var film_age         =  $("#film_age")[0].value;
    var film_director    =  $("#film_director")[0].value;
    var film_actors      =  $("#film_actors")[0].value;
    var film_poster      =  $("#film_poster")[0].value;
    var film_rating      =  $("#film_rating")[0].value;

    var filmJson = {
        film_name: film_name,
        film_url: film_url
    };
    if (film_name != null && film_name != "" && 
            film_url!=null && film_url != "") {
        var request = $.ajax({
            async: false,
            data: {

                "query": film_name,
                "api_key": "cfc29d28bd4b92b3ec85440902400286"
            },
            url: "https://api.themoviedb.org/3/search/movie",
            method: "get"
        });

        request.done(function (response) {
            if(response.results.length != 0){
                var directorAndActors = secondRequest(response);
                var film = responseHandler(response,film_name, film_description, film_age, film_director
                                           ,film_actors, film_poster, film_rating,
                                           directorAndActors);
                film["film_url"]  = film_url;
                insertIntoInputs(film);
            }
            else
                alert("This film does not exists")
        })

    } else{
        alert("The field name of the movie and URL of the movie are required")
    }
    event.preventDefault();
})

function secondRequest(filmResponse){
    var directorAndActors = {cast:"",director:"",categories:""};
    var request = $.ajax({
        async: false,
        data: {
            "api_key": "cfc29d28bd4b92b3ec85440902400286"
        },
        url: "https://api.themoviedb.org/3/movie/"+filmResponse.results[0].id +"/credits",
        method: "get"
    });

    var request2 = $.ajax({
        async: false,
        data: {
            "api_key": "cfc29d28bd4b92b3ec85440902400286"
        },
        url: "https://api.themoviedb.org/3/movie/"+filmResponse.results[0].id ,
        method: "get"
    });

    request.done(function (response) {
        for(var actor in response.cast){
            if(actor == response.cast.length-1)
                directorAndActors["cast"] += response.cast[actor].name;
            else
                directorAndActors["cast"] += response.cast[actor].name + ",";
        }
        for(var person in response.crew){
            if(response.crew[person].job == "Director"){
                directorAndActors["director"] = response.crew[person].name;
                break;
            }
        }
    });

    request2.done(function (response) {
        var res = "";
        response.genres.forEach(elem =>
            res += elem.name + ","
        )
        res = res.slice(0,-1)
        directorAndActors.categories = res;
    });

    return directorAndActors;
}

function responseHandler(response,film_name, film_description,
        film_age, film_director, film_actors, film_poster, film_rating, directorAndActors) {
    var webFilm = response.results[0];
    var filmJson = {};
    filmJson["film_name"] = webFilm.title;
    filmJson["film_description"] =
        (film_description == null || film_description == "") ? webFilm.overview : film_description;
    filmJson["film_age"] =
        (film_age == null || film_age == "") ? webFilm.release_date : film_age;
    filmJson["film_poster"] =
        (film_poster == null || film_poster == "") ? webFilm.poster_path : film_poster ;
    filmJson["film_rating"] =
        (film_rating == null || film_rating == "") ? webFilm.vote_average : film_rating ;
    filmJson["film_cast"] =
        (film_actors == null || film_actors == "") ?  directorAndActors.cast : film_actors ;
    filmJson["film_director"] =
        (film_director == null || film_director == "") ? directorAndActors.director:film_director  ;
    filmJson["film_genres"] = directorAndActors.categories;
    return filmJson;
}

function insertIntoInputs(film){
    if(inputComprobation(film)){
        $("#film_name")[0].value        = film["film_name"];
        $("#film_url")[0].value         = film["film_url"];
        $("#film_description")[0].value = film["film_description"];
        $("#film_age")[0].value         = film["film_age"];
        $("#film_director")[0].value    = film["film_director"];
        $("#film_actors")[0].value      = film["film_cast"];
        $("#film_poster")[0].value      = film["film_poster"];
        $("#film_rating")[0].value      = film["film_rating"];
        $("#film_genres")[0].value     = film["film_genres"];

        $("#name_modal").text(film["film_name"]);
        $("#url_modal").text(film["film_url"]);
        $("#description_modal").text(film["film_description"]);
        $("#age_modal").text(film["film_age"]);
        $("#director_modal").text(film["film_director"]);
        $("#actors_modal").text(addFilmCast(film));
        $("#poster_modal").text(film["film_poster"]);
        $("#rating_modal").text(film["film_rating"]);

        $("#acceptModal").modal('toggle');

    }
}

function inputComprobation(film){
    if(film["film_cast"] != ""){
        var filmCast = film["film_cast"].split(",");
        if(filmCast.length >= 1){
            return true;
        }else{
            alert("Please insert each actor between ','");
            return false;
        }
    }
    return true;
}

function addFilmCast(film){
    var res = "";
    var filmCast = film["film_cast"].split(",");
    var i = filmCast.length > 10 ? 10 : filmCast.length -1;
    for( i ; i >= 0; i--){
        if(filmCast[i] == "" || filmCast[i] == ""){
            continue;
        }
        res += filmCast[i] + ", ";
    }
    return res;
}

$("#saveFilm").click(function (event) {
    $("#post_film_form").submit();
})