<?php
/******************************************************************************
   request

response
 {
    "id": 12, 
    "from": 1,
    "to": 2,
    "date":"2009-03-03",
    "description":"coucou c'est une description",
    "confirm":1,
    "cats": [{"id":1, "value":12}, {"id":2, "value": 3}]
}
*******************************************************************************/

require_once 'logger.php';
require_once 'config.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
} else {
    exit(0);
}

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
 * Traitement dans la BDD
 *****************************************************************************/
$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);

$query = "SELECT * FROM `categories` where `father_id`=$id";
DEBUG($query);
$result = mysql_query($query);
test_mysql_result($result);
$i = 0;
while($row = mysql_fetch_array($result)) {
    extract($row);
    $tab[$i]->name = utf8_encode($name);
    $tab[$i]->id = $id;
    $tab[$i]->father_id = $father_id;
    $i++;
}

mysql_close($link);
print(json_encode($tab));

?>
