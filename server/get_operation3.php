<?php
require_once 'logger.php';
require_once 'config.php';

# get a operation from its id 
# GET get_operation3.php?id=503


/*****************************************************************************
 * Functions
 *****************************************************************************/
function test_mysql_result($result)
{
    if (!$result) {
        ERROR(mysql_error());
    }
}


if (!isset($_GET['id']) ) {
    ERROR('Invalid GET parameters');
}

$id = $_GET['id'];


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
    valeurs.val,
    categories.name
    FROM `operations`,`valeurs`, `categories` WHERE';
$query .= " `operations`.`id` = $id";
$query .= ' AND `operations`.`id` = `valeurs`.`op_id`';
$query .= ' AND `valeurs`.`cat_id` = `categories`.`id`';
DEBUG($query);
$result = mysql_query($query);
test_mysql_result($result);

# query result treatment
$current_id = 0;
$old_id = 0;
$i = -1;
$total = 0.00;
while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    extract($row);
    $current_id = $id;
    if($current_id != $old_id) {
        $i++;
        $total = 0.00;
        $old_id = $current_id;
        $return[$i]->id = $id;
        $return[$i]->from = $from;
        $return[$i]->to = $to;
        $return[$i]->date = $date;
        $return[$i]->description = utf8_encode($description);
        $return[$i]->confirm = $confirm;
    }
    $return[$i]->cats[] = (object) array('id' => $cat_id, 'val' => sprintf("%.2f", $val), 'name' =>$name);
    DEBUG($val);
    $total +=  $val;
    $return[$i]->total = sprintf("%.2f", $total);
}


mysql_close($link);

/* contrust answer */
$ret = json_encode($return);
DEBUG($ret);
print($ret);

?>
