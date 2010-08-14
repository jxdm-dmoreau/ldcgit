

ldc.tabs = function ()
{
    /* PUBLIC VARIABLES */
    ldc.MONTH = new Date().getMonth();
    ldc.YEAR = new Date().getFullYear();
    ldc.CID = 0;


    /* PRIVATE VARIABLES */
    var IS_TAB_INIT = [];
    var PREFIX = "#compte-";



    /* FUNCTIONS */

    /* Add a tab (li and div element) */
    function addTab(where, id, name) {
        $(where+" ul").append('<li><a href="#compte-'+id+'">'+name+'</a></li>');
        $(where).append('<div class="compte" id="compte-'+id+'"></div>');
    }




    /* Init a compte panel */
    function init_compte_panel() {
        var id = PREFIX+ldc.CID;
        $(id).load("html/compte_panel.html", function() {
                ldc.topPanel();
                ldc.opTable.init(PREFIX+ldc.CID+" div.op-table");
        });
    }






    /* MAIN FUNCTION */

    /* Add tabs */
    for(var i in ldc.data.comptes) {
        var c = ldc.data.comptes[i];
        /* add a tab for each compte */
        addTab("#tabs", c.id, c.bank+'-'+c.name);
    }

    /* Create jquery tabs */
    $("#tabs").tabs({
        show: 
            function () {
                var selected = $("#tabs").tabs('option', 'selected'); // => 0
                ldc.CID = ldc.data.comptes[selected].id;
                if (!IS_TAB_INIT[selected]) {
                    init_compte_panel();
                    IS_TAB_INIT[selected] = true;
                }
                return true;
            }
    });
}




