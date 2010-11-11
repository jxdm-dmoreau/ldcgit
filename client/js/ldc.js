/* Main object */
var ldc = {};
ldc.data = {};
ldc.data.cats = [];
ldc.OID = 0;

ldc.nbLoad = 0;
ldc.totalLoad = 0;

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
    preLoad("Start");
    ldc.tabs();
    ldc.logger(preLoad, isLoaded);
    ldc.form(preLoad, isLoaded);
    ldc.catTree(preLoad, isLoaded);
    ldc.comptes(preLoad, isLoaded);
    ldc.cat();
    ldc.op();
    ldc.topPanel();
    isLoaded("End");
};


function preLoad(str) {
    ldc.totalLoad++;
    DEBUG("preLoad ("+ldc.totalLoad+"): "+str);
}
function isLoaded(str) {
    ldc.nbLoad++;
    DEBUG("isLoaded ("+ldc.nbLoad+"/"+ldc.totalLoad+"): "+str);
    if (ldc.nbLoad == ldc.totalLoad) {
        INFO("load finished");
        ldc.pages();
    }
}


window.ldc = ldc;
