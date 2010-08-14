
ldc.logger = {}
    
ldc.logger.info = function (msg)
{
    $("#logger").empty().addClass('info').text(msg).fadeIn(800).delay(800).delay(800).fadeOut(800).removeClass('info');;
}

ldc.logger.error = function (msg)
{
    $("#logger").empty().addClass('error').text(msg).fadeIn(800).delay(800).delay(800).fadeOut(800).removeClass('error');
}

ldc.logger.success = function (msg)
{
    $("#logger").empty().addClass('success').text(msg).fadeIn(800).delay(800).delay(800).fadeOut(800).removeClass('success');
}

ldc.logger.loading = function (state)
{
    if (state == 'begin') {
        $("#logger").empty().addClass('info').text("Chargement...");
    } else {
        $("#logger").empty().removeClass('info');
    }
}

ldc.checkStatus = function (msg, textStatus) {
    if (textStatus != 'success') {
    /*    ldc.logger.error(msg+': '+textStatus);*/
        var i = 0;
    } else {
        ldc.logger.success(msg+': '+textStatus);
    }
}
