<?php
/******************************************************************************
   request
 {
    "date-begin": "2009-01-01",
    "date-end": "2009-12-01",
    "account_id": 1
}

response
 {
 [
    "id" : 12
    "from": 1,
    "to": 2,
    "date":"2009-03-03",
    "description":"coucou c'est une description",
    "confirm":1,
    "cats": [{"id":1, "value":12}, {"id":2, "value": 3}]
    ]
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
DEBUG($_POST);
if (!isset($_POST['json']) ) {
    ERROR('Invalid POST parameters');
}

/*****************************************************************************
 * JSON
 *****************************************************************************/
$json = str_replace('\\', '', $_POST['json']);
DEBUG($json);
$json = json_decode($json);


/*****************************************************************************
 * MySQL
 *****************************************************************************/
$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);


/* Query */
$query = 'SELECT operations.id,
    operations.from,
    operations.to,
    operations.date,
    operations.description,
    operations.confirm,
    valeurs.cat_id,
    valeurs.val
    FROM `operations`,`valeurs` WHERE';
$query .= " `date` >= '".mysql_real_escape_string($json->date_begin)."'";
$query .= " AND `date` <= '".mysql_real_escape_string($json->date_end)."'";
$query .= ' AND `operations`.`id` = `valeurs`.`op_id`';
if (isset($json->account_id)) {
    $query .= ' AND (`from` = '.mysql_real_escape_string($json->account_id).' OR `to` = '.mysql_real_escape_string($json->account_id).')';
}
DEBUG($query);
$result = mysql_query($query);
test_mysql_result($result);

# query result treatment
$current_id = 0;
$old_id = 0;
$i = -1;
while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    extract($row);
    $current_id = $id;
    if($current_id != $old_id) {
        $i++;
        $old_id = $current_id;
        $return[$i]->id = $id;
        $return[$i]->from = $from;
        $return[$i]->to = $to;
        $return[$i]->date = $date;
        $return[$i]->description = utf8_encode($description);
        $return[$i]->confirm = $confirm;
    }
    $return[$i]->cats[] = (object) array('cat_id' => $cat_id, 'val' => $val);
}


mysql_close($link);

/* contrust answer */
print(json_encode($return));

?>
