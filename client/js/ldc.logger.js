
ldc.logger = function() {
    
    function log(level, msg)
    {
        var html = '<div class="'+level+'">'+msg+'<div style="float: right;" class="ui-icon ui-icon-close"></div></div>';
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
        $("#logger").delegate(".ui-icon-close", "click", 
            function () {
                $(this).parent().remove()
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

}
