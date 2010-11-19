<?php 
require_once 'logger.php';
require_once 'config.php';
setlocale (LC_TIME, 'fr_FR.utf8','fra');


if (!isset($_GET['id']) || !isset($_GET['year'])) {
    die("missing parameters");
}


$id   = $_GET['id'];
$year = $_GET['year'];


function sum_children_recursif($id, $cats, $somme, &$value) {
    foreach($cats[$id] as $cat_id) {
        for($i = 0; $i<12; $i++) {
            $value[$i] += $somme[$cat_id][$i];
        }
        sum_children_recursif($cat_id, $cats, $somme, $value);
    }
}


$query = "
SELECT val, cat_id, date
FROM `valeurs`, `operations`, `categories` 
WHERE date >= '$year-01-01' AND date <= '$year-12-31' AND cat_id = `categories`.id AND (`from` = 0  OR `to` = 0)   AND `operations`.id = op_id";
DEBUG($query);


$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);

$result = mysql_query($query);
$somme = array();
while($row = mysql_fetch_array($result)) {
    $date = preg_split('/-/', $row[date]);
    if (!isset($somme[$row['cat_id']])) {
        for($i=0; $i<12; $i++) {
            $somme[$row['cat_id']][$i]= 0;
        }
    }
    $somme[$row['cat_id']][$date[1]-1] += $row['val'];
}


$query = "SELECT * FROM `categories`";
DEBUG($query);
$result = mysql_query($query);
$cats = array();
while($row = mysql_fetch_array($result)) {
    $cats[$row['father_id']][] = $row['id'];
}


$result = array();
$i = 0;
for($i=0; $i<12; $i++) {
    $result[$i] = 0;
}

sum_children_recursif($id, $cats, $somme, $result);


mysql_close($link);
print(json_encode($result));





?>


