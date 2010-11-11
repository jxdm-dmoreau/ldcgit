
ldc.logger = function(pre_cb, post_cb) {

    pre_cb("ldc.logger");
    
    function log(level, msg)
    {
        var html = '';
        if (level == 'error') {
            html += '<div class="'+level+' ui-state-error">';
        } else {
            html += '<div class="'+level+'">';
        }
        html+= msg+'<div style="float: right;" class="ui-icon ui-icon-close"></div></div>';
        if ($("#logger div").length == 0) {
            $("#logger").append(html);
        } else {
            $(html).insertBefore($("#logger div:first"));
        }
        $("#logger div:first").fadeIn('slow').delay(3000).fadeOut('slow',
            function() {
                $(this).remove()
            }
        );
    }


    ldc.logger.info = function (msg) {
        log('info', msg);
    }

    ldc.logger.error = function (msg)
    {
        log('error', msg);
    }

    ldc.logger.success = function (msg)
    {
        log('success', msg);
    }

    post_cb("ldc.logger");

}
