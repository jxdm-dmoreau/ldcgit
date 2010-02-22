<?php
/******************************************************************************
   request
 {
    "bank": "La Banque Postale",
    "name": "CCP"
}

response
 {
    "id": 2
}
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



/* update de la table operation*/
$query = 'INSERT INTO `comptes` (`id`, `name`, `bank`) VALUES ';
$query .= "('NULL', '".mysql_real_escape_string($json->name)."', '".mysql_real_escape_string($json->bank)."')";
DEBUG($query);
test_mysql_result(mysql_query($query));

$mysql_id = mysql_insert_id($link);
/* contrust answer */
$r['id'] = $mysql_id;
print(json_encode($r));

?>
