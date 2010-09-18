/* Main object */
var ldc = {};
ldc.data = {};
ldc.data.cats = [];
var DEBUG = console.debug;

/* First function called */
ldc.init = function() {
    ldc.logger();
    ldc.form();
    ldc.catTree();
    ldc.cat();
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
