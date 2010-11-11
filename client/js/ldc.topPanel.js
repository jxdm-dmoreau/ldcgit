
ldc.topPanel = function() {

    /*** CONFIGURATION VARIABLES ***/

    var PREFIX          = "#compte-";
    var CLASS_TOP_PANEL = " .top-panel";
    var CLASS_MONTH     = " .month-choice";
    var CLASS_SOLDE_ALL = " .solde-all span";
    var CLASS_SOLDE_P   = " .solde-p span";
    var URL_MONTH       = "../server/get_months.php";
    var URL_SOLDE       = "../server/get_solde.php";




    /******************************************************************************
    * Month combo box
    *****************************************************************************/


    /* Ajax call, fill page and set callback on combo box */
    function updateMonth(cid) {
        var selector = PREFIX + cid + CLASS_MONTH;
        $(selector).load(URL_MONTH+"?id="+cid,
            function() {
                var selector = PREFIX + cid + CLASS_MONTH;
                $(selector + " select").change(onChangeMonth);
            }
        );
    }

    /* On change: save month and year selected and update op table */
    function onChangeMonth() {
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



    /******************************************************************************
    * Solde
    ******************************************************************************/


    /* To update displayed solde (when an operation is added or removed */
    function updateSoldePanel(cid) {
        $.getJSON(URL_SOLDE+"?id="+cid, 
                function(data) {
                    var selector = PREFIX + cid + CLASS_TOP_PANEL;
                    $(selector + CLASS_SOLDE_ALL).text(data.solde_all+"€");
                    $(selector + CLASS_SOLDE_P).text(data.solde_p+"€");
                }
        );
    }



    /******************************************************************************
    * PUBLIC  UPDATE
    *****************************************************************************/


    /* call when a new operation is added, modified or removed */
    ldc.topPanel.update = function(cid) {
        if (cid == undefined) {
            cid = ldc.CID;
        }
        updateMonth(cid);
        updateSoldePanel(cid);
    }
    



}
