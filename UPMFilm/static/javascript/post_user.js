$(document).ready(function(){
    var error = $("#error")[0].value;
    if(error != ""){
        $("#user_name")[0].value = $("#user_name_hid")[0].value;
        $("#user_email")[0].value = $("#user_email_hid")[0].value;
    }
})

$("#confirm").click(function (event) {
    var name = $("#user_name")[0].value
    var email = $("#email")[0].value;
    event.preventDefault();
    if(name!= null && name!="" && email!= null && email!="" ){
        $("#name_modal").text($("#user_name")[0].value);
        $("#email_modal").text($("#email")[0].value);
        $("#acceptModal").modal('toggle');
    }else{
        alert("Some of the fields are not filled properly");
    }
});


$("#saveUser").click(function (event) {
    $("#post_user_form").submit();
});