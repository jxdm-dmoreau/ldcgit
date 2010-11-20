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
        $value += $somme[$cat_id];
        sum_children_recursif($cat_id, $cats, $somme, $value);
    }
}

$query = "
SELECT SUM(val), cat_id 
FROM `valeurs`, `operations`, `categories` 
WHERE date >= '$year-01-01' AND date <= '$year-12-31' AND cat_id = `categories`.id AND `to` = 0   AND `operations`.id = op_id 
GROUP BY cat_id";
DEBUG($query);


$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);

$result = mysql_query($query);
$somme = array();
while($row = mysql_fetch_array($result)) {
    $somme[$row['cat_id']] = $row['SUM(val)'];
}



$query = "SELECT * FROM `categories`";
DEBUG($query);
$result = mysql_query($query);
$cats = array();
$names = array();
while($row = mysql_fetch_array($result)) {
    $cats[$row['father_id']][] = $row['id'];
    $names[$row['id']] = utf8_encode($row['name']);
}
$result = array();
$i = 0;


foreach($cats[$id] as $cat_id) {
    $result[$i]['id'] = $cat_id;
    $result[$i]['name'] = $names[$cat_id];
    if (isset($somme[$cat_id])) {
        $result[$i]['y'] = $somme[$cat_id];
    } else {
        $result[$i]['y'] = 0;
    }
    sum_children_recursif($cat_id, $cats, $somme, $result[$i]['y']);
    $i++;
}


/* transform to %  */
/*
$nb_total = $i;
$total = 0;
for($i = 0; $i < $nb_total; $i++) {
    $total += $result[$i]['y'];
}
DEBUG("total=$total");
for($i = 0; $i < $nb_total; $i++) {
    $result[$i]['y'] = ($result[$i]['y']*100)/$total;
}
*/


mysql_close($link);
print(json_encode($result));






?>


