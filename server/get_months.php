<?php 
require_once 'logger.php';
require_once 'config.php';

setlocale (LC_TIME, 'fr_FR.utf8','fra');

if (isset($_GET['id']) ) {
    $compteId=$_GET['id'];
}


$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);
if (isset($compteId)) {
    $query="SELECT date FROM `operations` WHERE (`from`=$compteId OR `to`=$compteId) ORDER BY `date` LIMIT 1";
} else {
    $query="SELECT date FROM `operations` ORDER BY `date` LIMIT 1";
}
DEBUG($query);

$result = mysql_query($query);
if (!$result) {
    echo "Erreur Mysql";
}
$row = mysql_fetch_array($result);
mysql_close($link);
if (!isset($row['date'])) {
    die();
}
$date = $row['date'];
$tabs = preg_split('/-/', $date);

$year = $tabs[0];
$month = $tabs[1]+0;
$year_now = date("Y");
$month_now = date("n");

$date_name='';
echo "<select name=\"mois\">\n";
echo "\t<option value=\"$year\">=== $year ===</option>\n";
while($year != $year_now ||  $month != $month_now) {
    $date_name = strftime("%B %G", strtotime("$year-$month-".date('d')));
    echo "\t<option value=\"$year-$month\">$date_name</option>\n";
    $month += 1;
    if ($month == 13) {
        $month = 1;
        $year++;
        echo "\t<option value=\"$year\">=== $year ===</option>\n";
    }
}
$date_name = strftime("%B %G", strtotime($year_now."-".$month_now."-".date('d')));
echo "\t<option selected=\"selected\" value=\"$year_now-$month_now\">$date_name</option>\n";
echo "</select>\n";

?>


