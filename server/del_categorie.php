<?php
/******************************************************************************
   request
 {
    "id": 12,
}

response
0
*******************************************************************************/

require_once 'logger.php';
require_once 'config.php';

/*****************************************************************************
 * Functions
 *****************************************************************************/
function test_mysql_result($result)
{
    if (!$result) {
        ERROR(mysql_error());
    }
}

/*****************************************************************************
 * traitement sur le JSON
 *****************************************************************************/
if (!isset($_POST['json']) ) {
    ERROR('Invalid POST parameters');
}
$json = str_replace('\\', '', $_POST['json']);
DEBUG($json);
$json = json_decode($json);


/*****************************************************************************
 * Traitement dans la BDD
 *****************************************************************************/
$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);


/* delete in categories table */
$query = 'DELETE FROM `categories` WHERE `id` = '.mysql_real_escape_string($json->id);
DEBUG($query);
test_mysql_result(mysql_query($query));


print('0');

?>
