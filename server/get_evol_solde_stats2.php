<?php 
require_once 'logger.php';
require_once 'config.php';
setlocale (LC_TIME, 'fr_FR.utf8','fra');

function date2str($month, $year) {
    return strftime('%b', mktime(0, 0, 0, $month))." $year";
}


$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);


$query = "SELECT val, date, `from`, `to` FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id";
DEBUG($query);
$result = mysql_query($query);
$somme = array();
while($row = mysql_fetch_array($result)) {
    $date = preg_split('/-/', $row['date']);
    $year = $date[0];
    $month = $date[1]-1;
    if (!isset($somme[$year])) {
        $somme[$year] = array();
    }
    if (!isset($somme[$year][$month])) {
        $somme[$year][$month] = 0;
    }

   if ($row['from'] == 0) {
        $somme[$year][$month] += $row['val'];
    } else if ($row['to'] == 0) {
        $somme[$year][$month] += -1*$row['val'];
    }
}

#print_r($somme);

$query = "SELECT MIN(date), MAX(date) FROM `operations`";
DEBUG($query);
$result = mysql_query($query);
if (!$result) {
    die('Requête invalide : ' . mysql_error());
}
$row = mysql_fetch_array($result);
mysql_close($link);

$tmp = preg_split('/-/', $row['MIN(date)']);
$first_year = $tmp[0];
$first_month = $tmp[1]-1;
$tmp = preg_split('/-/', $row['MAX(date)']);
$last_year = $tmp[0];
$last_month = $tmp[1]-1;
#DEBUG("$first_year $first_month");
#DEBUG("$last_year $last_month");

$last = 0;
while(!($first_year == $last_year && $first_month > $last_month)) {
    if ($first_month >= 12) {
        $first_month = 0;
        $first_year++;
    }
    if (isset($somme[$first_year][$first_month])) {
        $last += $somme[$first_year][$first_month];
    }
    $data[] = $last;
    $legend[] = date2str($first_month+1, $first_year);

DEBUG("$first_year $first_month");
    $first_month++;
}


$json['data'] = $data;
$json['legend'] = $legend;
print(json_encode($json));





?>


