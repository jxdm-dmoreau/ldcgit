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

function delete_r($id)
{
    $query = "SELECT * from categories WHERE `father_id` = $id";
    DEBUG($query);
    $result = mysql_query($query);
    while($row = mysql_fetch_array($result)) {
        delete_r($row['id']);
        $query = 'DELETE FROM `categories` WHERE `id` = '.$row['id'];
        DEBUG($query);
        test_mysql_result(mysql_query($query));
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
delete_r(mysql_real_escape_string($json->id));
$query = 'DELETE FROM `categories` WHERE `id` = '.mysql_real_escape_string($json->id);
DEBUG($query);
test_mysql_result(mysql_query($query));


print('0');

?>
