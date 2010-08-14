<?php 
require_once 'logger.php';
require_once 'config.php';
setlocale (LC_TIME, 'fr_FR.utf8','fra');

if (isset($_GET['id'])) {
    $id=$_GET['id'];
    $query_p = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND (`from`=$id OR `to`=$id) AND `operations`.confirm=1";
    $query = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND (`from`=$id OR `to`=$id)";
}
else {
    $query_p = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND `confirm`=1";
    $query = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id";
}

$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);

DEBUG($query);
$result = mysql_query($query);
if (!$result) {
   ERROR("Erreur Mysql");
}
$row = mysql_fetch_array($result);
$solde = 0;
if (isset($row['SUM(val)'])) {
    $solde = $row['SUM(val)'];
}


DEBUG($query_p);
$result = mysql_query($query_p);
if (!$result) {
   ERROR("Erreur Mysql");
}
$row = mysql_fetch_array($result);
$solde_p = 0;
if (isset($row['SUM(val)'])) {
    $solde = $row['SUM(val)'];
}

mysql_close($link);

$r->solde_all = sprintf("%.2f", $solde);
$r->solde_p = sprintf("%.2f", $solde_p);

$return = json_encode($r);

DEBUG($return);
echo $return;






?>


