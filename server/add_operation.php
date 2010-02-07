<?php
/******************************************************************************
   request
 {
    "from": 1,
    "to": 2,
    "date":"2009-03-03",
    "description":"coucou c'est une description",
    "confirm":1,
    "cats": [{"id":1, "value":12}, {"id":2, "value": 3}]
}

response
{
    "id": 12
}
*******************************************************************************/

require_once 'logger.php';
require_once 'config.php';


if (!isset($_POST['json']) ) {
    ERROR('Invalid POST parameters');
}

$table = 'operations';

// ???
$json = str_replace('\\', '', $_POST['json']);

DEBUG($json);
$json = json_decode($json);


$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);


$query = "
    INSERT INTO `$table`
    (`id`,
     `from`,
     `to`,
     `date`,
     `description`,
     `confirm`)
    VALUES (
            'NULL',
            '".mysql_real_escape_string($json->from)."',
            '".mysql_real_escape_string($json->to)."',
            '".mysql_real_escape_string($json->date)."',
            '".mysql_real_escape_string($json->description)."',
            '".mysql_real_escape_string($json->confirm)."'
    )";
DEBUG($query);
$result = mysql_query($query);
// retrieve last auto increment
$mysql_id = mysql_insert_id($link);


/* contrust answer */
$r['id'] = $mysql_id;
print(json_encode($r));

?>
