<?php
/******************************************************************************
   request
 {
    "id": 12,
    "name": "Compte courant",
    "bank": "Boursorama",
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
$query = 'UPDATE `comptes` SET ';
if (isset($json->name)) {
    $query .= "`name` = '".mysql_real_escape_string($json->name)."',";
}
if (isset($json->bank)) {
    $query .= "`bank` = '".mysql_real_escape_string($json->bank)."',";
}
$query = substr($query,0,strlen($query)-1);
$query .= " WHERE `id` = '$json->id'";
DEBUG($query);
test_mysql_result(mysql_query($query));

print('0');

?>
