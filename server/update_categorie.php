<?php
/******************************************************************************
   request
 {
    "id": 12, 
    "from": 1,
    "to": 2,
    "date":"2009-03-03",
    "description":"coucou c'est une description",
    "confirm":1,
    "cats": [{"id":1, "value":12}, {"id":2, "value": 3}]
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
 * Traitement sur le JSON
 *****************************************************************************/
if (!isset($_POST['json']) ) {
    ERROR('Invalid POST parameters');
}


/*****************************************************************************
 * Traitement dans la BDD
 *****************************************************************************/
$json = str_replace('\\', '', $_POST['json']);
DEBUG($json);
$json = json_decode($json);


$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);




/* update de la table categories */
$query = 'UPDATE `categories` SET ';
if (isset($json->father_id)) {
    $query .= "`father_id` = '".mysql_real_escape_string($json->father_id)."',";
}
if (isset($json->name)) {
    $json->name = utf8_decode($json->name);
    $query .= "`name` = '".mysql_real_escape_string($json->name)."',";
}
$query = substr($query,0,strlen($query)-1);
$query .= " WHERE `id` = '$json->id'";
DEBUG($query);
test_mysql_result(mysql_query($query));

print('0');

?>
