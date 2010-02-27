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




/* update de la table categories */
$query = 'SELECT * FROM `categories`';
DEBUG($query);
$result = mysql_query($query);
test_mysql_result($result);
$i=0;
while($row = mysql_fetch_array($result)) {
    extract($row);
    $return[$i]->id = $id;
    $return[$i]->father_id = $father_id;
    $return[$i]->name = utf8_encode($name);
    $i++;
}

mysql_close($link);
print(json_encode($return));

?>
