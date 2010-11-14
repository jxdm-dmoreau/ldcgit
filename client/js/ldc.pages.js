
ldc.pages = function() {
    $("#header .nav .comptes").click(openPageCompte);
    $("#header .nav .ops").click(openPageOperations);
    $("#header .nav .stats").click(openPageStats);


    function openPageOperations() {
        $("#header .nav a").removeClass("selected");
        $(this).addClass("selected");
        hideAll();
        ldc.tabs.display();
        return false;
    }

    function openPageStats() {
        $("#header .nav a").removeClass("selected");
        $(this).addClass("selected");
        hideAll();
        ldc.stats.display();
        return false;
    }

    function openPageCompte() {
        $("#header .nav a").removeClass("selected");
        $(this).addClass("selected");
        hideAll();
        return false;
    }

    $("#header .nav .ops").click();


    function hideAll() {
        $("#tabs").hide();
        $("#stats").hide();
    }

}
