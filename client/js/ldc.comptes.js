
ldc.comptes = function(pre_cb, past_cb) {
    pre_cb("ldc.comptes");



    var GET_URL="../server/get_comptes.php";
    $.getJSON(GET_URL, function(data) {
            ldc.comptes.data = data;
            past_cb("ldc.comptes");
    });



}
