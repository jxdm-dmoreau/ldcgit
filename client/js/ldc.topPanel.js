
ldc.topPanel = function() {

    /*** CONFIGURATION VARIABLES ***/

    var PREFIX          = "#compte-";
    var CLASS_TOP_PANEL = " .top-panel";
    var CLASS_MONTH     = " .month-choice";
    var CLASS_SOLDE_ALL = " .solde-all span";
    var CLASS_SOLDE_P   = " .solde-p span";
    var TOTAL_CB        = 2;


    /*** PRIVATE VARIABLES ***/

    var nb_cb = 0;


    /*** FUNCTIONS ***/

    function  getSelectorTopPanel() {
        return PREFIX + ldc.CID + CLASS_TOP_PANEL;
    }

    function end() {
        nb_cb++;
        if (nb_cb == TOTAL_CB) {
            var selector = getSelectorTopPanel();
            $(selector).show();
        }
    }

    /******************************************************************************
    * Month combo box
    *****************************************************************************/

    ldc.monthCb = function() {


        /* PRIVATE FUNCTIONS */

        function update() {
            var selector = PREFIX + ldc.CID + CLASS_MONTH;
            $(selector).load("../server/get_months.php?id="+ldc.CID, update_cb);
        }

        function update_cb() {
            var selector = PREFIX + ldc.CID + CLASS_MONTH;
            $(selector + " select").change(onChange);
            end();
        }

        /* On change: save month and year selected and update op table */
        function onChange() {
            var val = $(this).val();
            var elem = val.split('-');
            ldc.YEAR = parseInt(elem[0]);
            if (elem[1] == undefined) {
                ldc.MONTH = undefined;
            } else {
                ldc.MONTH =  parseInt(elem[1]);
            }
            ldc.opTable.update(PREFIX+ldc.CID+" .op-table");
            return true;
        }



        /*** PUBLIC FUNCTIONS ***/

        ldc.monthCb.update = update;


        /*** MAIN ***/
        ldc.monthCb.update();
    }






    /******************************************************************************
    * Solde
    ******************************************************************************/

    ldc.soldePanel = function() {


        /**** FUNCTIONS ***/

        /* To update displayed solde (when an operation is added or removed */
        ldc.soldePanel.update = function () {
            $.getJSON("../server/get_solde.php?id="+ldc.CID, 
                    function(data) {
                        var selector = getSelectorTopPanel();
                        $(selector + CLASS_SOLDE_ALL).text(data.solde_all+"€");
                        $(selector + CLASS_SOLDE_P).text(data.solde_p+"€");
                    }
            );
        }


        /**** MAIN ***/

        $.getJSON("../server/get_solde.php?id="+ldc.CID, 
            function(data) {
                var selector = getSelectorTopPanel();
                $(selector + CLASS_SOLDE_ALL).text(data.solde_all+"€");
                $(selector + CLASS_SOLDE_P).text(data.solde_p+"€");
                end();
            }
        );

    }




    /******************************************************************************
    * MAIN
    *****************************************************************************/

    $(getSelectorTopPanel()).hide();
    ldc.monthCb();
    ldc.soldePanel();


}
