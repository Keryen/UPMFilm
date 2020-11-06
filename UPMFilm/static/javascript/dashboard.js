var filmList = searchAllFilms();

$(document).ready(


    $(".card-img-top").mouseenter(function () {
        var src = this.src;
        var image = src.split("images/")[1];
        this.parentElement.parentElement.style.backgroundImage = "url(common/images/" + image + ")";
    }),

    $(".card-img-top").mouseleave(function () {
        var src = this.src;
        this.parentElement.parentElement.style.backgroundImage = "unset";
    }),

    $("#search-input").keydown(function (e) {

        if(e.key == "Enter"){
            e.preventDefault();
        } else if(e.key !="Backspace"){
            $(".allFilms").fadeOut();
            var search = $("#search-input")[0].value + e.key
            var toShow = filmList.filter(item => item.toLowerCase().indexOf(search) > -1)
            insertIntoDiv(toShow);
            $("#search-film").fadeIn();
        } else if($("#search-input")[0].value != undefined){
            $(".allFilms").fadeOut();
            var search = $("#search-input")[0].value.slice(0,-1);
            var toShow = filmList.filter(item => item.toLowerCase().indexOf(search) > -1)
            insertIntoDiv(toShow);
            $("#search-film").fadeIn();
        } if(e.key =="Backspace" && $("#search-input")[0].value.length == 1){
            $(".allFilms").fadeIn();
            $("#search-film").fadeOut();
        }
    }),

    $("#reload-button").click(function(){
        $("#search-film").fadeOut();
        $(".allFilms").fadeIn();
        $("#search-input")[0].value='';
    })
);

function searchAllFilms(){
    var result = [];
    var listChildren = $("#listFilm")[0].children;
    var length = listChildren.length;
    for(var i = 0; i < length;i++ ){
        result[i] = listChildren[i].id;
    }
    console.log(result);
    return result;
}


function insertIntoDiv(list){
    $("#resultFilm")[0].innerHTML ='';
    var length = list.length;
    for(var i = 0; i < length;i++ ){
        var a = document.createElement('a');
        a.id = list[i];
        a.innerHTML = list[i];
        a.className = "list-group-item list-item";
        a.href = "/UPMFilm/film/"+list[i];
        $("#resultFilm")[0].appendChild(a);
    }
}
