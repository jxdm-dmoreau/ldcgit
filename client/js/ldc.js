/* Main object */
var ldc = {};
ldc.data = {};
ldc.data.cats = [];
ldc.OID = 0;

if (window.console && window.console.debug && window.console.info && window.console.error) {
    var DEBUG = window.console.debug;
    var INFO = window.console.info;
    var ERROR = window.console.error;
} else {
    var DEBUG = function() {};
    var INFO = function() {};
    var ERROR = function () {};
}

/* ajax error function */
$(document).ajaxError(function(){
    if (window.console && window.console.error) {
            console.error(arguments);
    }
});

/* First function called */
ldc.init = function() {
    ldc.logger();
    ldc.form();
    ldc.catTree();
    ldc.cat();
    ldc.op();
    $.getJSON("../server/get_comptes.php",   store_comptes);
    $.getJSON("../server/get_categories3.php", store_categories);

};

store_comptes = function (data, textStatus) {
    ldc.data.comptes = data;
    ldc.tabs();
};

store_categories = function (data, textStatus) {
    ldc.data.cats = data;
};
window.ldc = ldc;
