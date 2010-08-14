


ldc.opTable = {};

ldc.opTable.dataTable = [];

ldc.opTable.init = function (s) {


    /************** PRIVATE VARIABLES ***********************/
    var selector = s;


    /************* PRIVATE FUNCTIONS ************************/


    /* 
     *  Return the last day in a month
     */
    function nbDaysInMonth() {
        var dd = new Date(2009, 11, 32);
        var dd2 = new Date(2009, 12, 1);
        //Set 1 day in milliseconds
        var one_day=1000*60*60*24;
        return (32-((Math.ceil((dd.getTime()-dd2.getTime())/(one_day))) + 1));
    }


    /* Construct JSON to send to server */
    /* If month is not defined, considered all year */
    function constructJSON(year, month) {
        var data = {};
        if (month != undefined) {
            data = { 
                year_begin: year,
                month_begin: month,
                day_begin: 1,
                year_end: year,
                month_end: month,
                day_end: nbDaysInMonth(month-1, year),
                account_id: ldc.CID
            };
        } else {
            data = {
                year_begin: year,
                month_begin: 1,
                day_begin: 1,
                year_end: year,
                month_end: 12,
                day_end: 31,
                account_id: ldc.CID
            };
        }
        return JSON.stringify(data);
    }

    function createDataTable_cb(data, textStatus) {
            ldc.opTable.operations = JSON.parse(data);
            var html = '';
            for (var i in ldc.opTable.operations) {
                html += op2html(ldc.opTable.operations[i]);
            }
            if (ldc.opTable.dataTable[ldc.CID] == undefined) {
                $(selector+' table tbody').html(html);
                ldc.opTable.dataTable[ldc.CID] = $(selector+' table').dataTable( {sPaginationType: 'full_numbers'});
            } else {
                ldc.opTable.dataTable[ldc.CID].fnDestroy();
                $(selector+' table tbody').html(html);
                ldc.opTable.dataTable[ldc.CID] = $(selector+' table').dataTable( {sPaginationType: 'full_numbers'});
            }
            $(selector).show();
            ldc.logger.loading('end');
    }

    /* 
     * Get the operations lists
     */
    function get_operations() {
        ldc.logger.loading('begin');
        var json = "json="+constructJSON(ldc.YEAR, ldc.MONTH);
        $.post("../server/get_operations2.php",  json , createDataTable_cb); 
    }

    function get_html_icon(name) {
        var html = '<span class="ldc-icon">';
        html += '<span class="ui-icon ui-icon-'+name+'"></span>';
        html += '</span>';
        return html;
    }


    /* */
    function op2html(op) {
        var html = '';
        html = '<tr>';
        html += '<td class="op-id">'+op.id+'</td>';
        html += '<td class="op-date">'+op.date+'</td>';
        if (ldc.CID == op.from) {
            html += '<td class="op-value">'+op.total+'€</td><td class="op-value">-</td>';
        } else {
            html += '<td class="op-value">-</td><td class="op-value">'+op.total+'€</td>';
        }

        // cats
        html += '<td class="op-cats">';
        for (var i in op.cats) {
            html += op.cats[i].name+', ';
        }
        html += '</td>';
        html += '<td class="op-actions">';
        html += get_html_icon('trash');
        html += get_html_icon('pencil');
        if (op.confirm == '1') {
            html += get_html_icon('check');
        } else {
            html += get_html_icon('help');
        }
        html += '</td>';
        html += '</tr>';
        return html;
    }




    /**************** PUBLIC FUNCTIONS ************************/

    /* when we change the month */
    ldc.opTable.update = function(s) {
        selector = s;
        $(selector).hide();
        get_operations();
    }



    /******************** MAIN ******************************/
    ldc.opTable.update(selector);


}
