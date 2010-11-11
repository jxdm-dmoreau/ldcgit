<?php 
require_once 'logger.php';
require_once 'config.php';
setlocale (LC_TIME, 'fr_FR.utf8','fra');

if (isset($_GET['id'])) {
    $id=$_GET['id'];
    $query_p_debit = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND `from`=$id AND `operations`.confirm=1";
    $query_p_credit = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND `to`=$id AND `operations`.confirm=1";
    $query_debit = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND `from`=$id ";
    $query_credit = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND `to`=$id";
}
else {
    $query_p = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND `confirm`=1";
    $query = "SELECT SUM(val) FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id";
}

$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);

DEBUG($query_debit);
$result = mysql_query($query_debit);
if (!$result) {
   ERROR("Erreur Mysql");
}
$row = mysql_fetch_array($result);
$solde_debit = 0;
if (isset($row['SUM(val)'])) {
    $solde_debit = $row['SUM(val)'];
}

DEBUG($query_credit);
$result = mysql_query($query_credit);
if (!$result) {
   ERROR("Erreur Mysql");
}
$row = mysql_fetch_array($result);
$solde_credit = 0;
if (isset($row['SUM(val)'])) {
    $solde_credit = $row['SUM(val)'];
}

DEBUG($query_p_debit);
$result = mysql_query($query_p_debit);
if (!$result) {
   ERROR("Erreur Mysql");
}
$row = mysql_fetch_array($result);
$solde_p_debit = 0;
if (isset($row['SUM(val)'])) {
    $solde_p_debit = $row['SUM(val)'];
}

DEBUG($query_p_credit);
$result = mysql_query($query_p_credit);
if (!$result) {
   ERROR("Erreur Mysql");
}
$row = mysql_fetch_array($result);
$solde_p_credit = 0;
if (isset($row['SUM(val)'])) {
    $solde_p_credit = $row['SUM(val)'];
}

mysql_close($link);

$r->solde_all = sprintf("%.2f", $solde_credit - $solde_debit);
$r->solde_p = sprintf("%.2f", $solde_p_credit - $solde_p_debit);

$return = json_encode($r);

DEBUG($return);
echo $return;






?>


