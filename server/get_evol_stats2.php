<?php 
require_once 'logger.php';
require_once 'config.php';
setlocale (LC_TIME, 'fr_FR.utf8','fra');


/* parameters */
if (!isset($_GET['id'])) {
    die("missing parameters");
}
$id   = $_GET['id'];


/* MySQL connection */
$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);



/* FIRST: retrieve all children */
$query = "SELECT * FROM `categories`";
DEBUG($query);
$result = mysql_query($query);
$cats = array();
while($row = mysql_fetch_array($result)) {
    $cats[$row['father_id']][] = $row['id'];
}




function date2str($month, $year) {
    return strftime('%b', mktime(0, 0, 0, $month))." $year";
}

function construct_query_rec(&$query, $cat_id, $cats) {
    foreach($cats[$cat_id] as $child) {
        $query .= "`valeurs`.cat_id = $child OR";
        construct_query_rec($query, $child, $cats);
    }
}

$query = "SELECT val, date, `from`, `to`, cat_id FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND (";
construct_query_rec($query, $id, $cats);
$len = strlen($query);
$query = substr ($query, 0, strlen($qeury)-3);
$query .= ")";

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
        $somme[$year][$month] = array();
    }
    if (!isset($somme[$year][$month][$row['cat_id']])) {
        $somme[$year][$month][$row['cat_id']] = 0;
    }

   if ($row['from'] == 0) {
        $somme[$year][$month][$row['cat_id']] += $row['val'];
    } else if ($row['to'] == 0) {
        $somme[$year][$month][$row['cat_id']] += -1*$row['val'];
    }
}

/* filter only on debit/credit */
#foreach($somme as $year) {
#    foreach($somme as $
#}


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
$credit;
$debit;
while(!($first_year == $last_year && $first_month > $last_month)) {
    if ($first_month >= 12) {
        $first_month = 0;
        $first_year++;
    }
    if (isset($somme[$first_year][$first_month])) {
        foreach($somme[$first_year][$first_month] as $cat) {
            if ($cat < 0) {
                $last_debit += abs($cat);
            } else if ($cat > 0) {
                $last_credit += abs($cat);
            }
        }
    }
    $credit[] = $last_credit;
    $debit[] = $last_debit;
    $last_credit = 0;
    $last_debit = 0;
    $legend[] = date2str($first_month+1, $first_year);

DEBUG("$first_year $first_month");
    $first_month++;
}


$json['data'][0]['name'] = 'debit';
$json['data'][0]['data'] = $debit;
$json['data'][1]['name'] = 'credit';
$json['data'][1]['data'] = $credit;
$json['legend'] = $legend;
print(json_encode($json));
#
#
#
#

?>


