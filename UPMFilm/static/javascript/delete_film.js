$(document).ready(function(){
    var error = $("#error")[0].value;
    if(error != ""){
        $("#film_name")[0].value = $("#film_name_hid")[0].value;
    }
})