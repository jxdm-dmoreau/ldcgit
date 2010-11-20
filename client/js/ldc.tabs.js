

ldc.tabs = function ()
{
    /* PUBLIC VARIABLES */
    ldc.MONTH = new Date().getMonth()+1;
    ldc.YEAR = new Date().getFullYear();
    ldc.CID = 0;



    /* PRIVATE VARIABLES */
    var IS_TAB_INIT = false;
    var PREFIX = "#compte-";



    /* FUNCTIONS */

    /* Add a tab (li and div element) */
    function addTab(where, id, name) {
        $(where+" ul").append('<li><a href="#compte-'+id+'">'+name+'</a></li>');
        $(where).append('<div class="compte" id="compte-'+id+'"></div>');
    }




    /* Init a compte panel */
    function init_compte_panel(cid) {
        var id = PREFIX+cid;
        $(id).load("html/compte_panel.html", function() {
                ldc.opTable(PREFIX+cid+" div.op-table");
                ldc.topPanel.update(cid);
        });
    }




    /* MAIN FUNCTION */


    ldc.tabs.init = function() {
        /* Add tabs */
        for(var i in ldc.comptes.data) {
            var c = ldc.comptes.data[i];
            /* add a tab for each compte */
            addTab("#tabs", c.id, c.name);
            init_compte_panel(c.id);
        }

        /* Create jquery tabs */
        $("#tabs").tabs({
            show: 
                function () {
                    var selected = $("#tabs").tabs('option', 'selected'); // => 0
                    ldc.CID = ldc.comptes.data[selected].id;
                    return true;
                }
        });
        IS_TAB_INIT = true;
    }



    ldc.tabs.display = function() {
        if (!IS_TAB_INIT) {
            ldc.tabs.init();
        }
        $("#tabs").show();
    }

}




