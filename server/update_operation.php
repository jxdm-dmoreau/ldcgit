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




/* update de la table operation*/
$query = 'UPDATE `operations` SET ';
if (isset($json->to)) {
    $query .= "`to` = '".mysql_real_escape_string($json->to)."',";
}
if (isset($json->from)) {
    $query .= "`from` = '".mysql_real_escape_string($json->from)."',";
}
if (isset($json->date)) {
    $query .= "`date` = '".mysql_real_escape_string($json->date)."',";
}
if (isset($json->description)) {
    $query .= "`description` = '".mysql_real_escape_string($json->description)."',";
}
if (isset($json->confirm)) {
    $query .= "`confirm` = '".mysql_real_escape_string($json->confirm)."',";
}
$query = substr($query,0,strlen($query)-1);
$query .= " WHERE `id` = '$json->id'";
DEBUG($query);
test_mysql_result(mysql_query($query));

/* update de la table valeurs*/
if (isset($json->cats)) {
    /* remove old values */
    $query = "DELETE FROM valeurs WHERE `op_id` = '".mysql_real_escape_string($json->id)."'";
    DEBUG($query);
    test_mysql_result(mysql_query($query));

    /* insert new values */
    $query = 'INSERT INTO valeurs VALUES ';
    foreach($json->cats as $cat) {
        $query .= '(';
        $query .= "NULL, ".mysql_real_escape_string($json->id).", ".mysql_real_escape_string($cat->id).", ".mysql_real_escape_string($cat->value);
        $query .= '),';
    }
    $query = substr($query,0,strlen($query)-1);
    DEBUG($query);
    test_mysql_result(mysql_query($query));
}

print('0');

?>
