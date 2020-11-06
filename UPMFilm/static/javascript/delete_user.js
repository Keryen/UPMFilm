$(document).ready(function(){
    var error = $("#error")[0].value;
    if(error != ""){
        $("#user_name")[0].value = $("#user_name_hid")[0].value;
    }
})