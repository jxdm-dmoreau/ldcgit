<?php 
require_once 'logger.php';
require_once 'config.php';
setlocale (LC_TIME, 'fr_FR.utf8','fra');


if (!isset($_GET['year'])) {
    die("missing parameters");
}

$year = $_GET['year'];


$query = "SELECT val, date, `from`, `to` FROM `operations`, `valeurs` WHERE `operations`.id = `valeurs`.op_id AND date >= '$year-01-01' AND date <= '$year-12-31' ORDER by date";
DEBUG($query);


$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);

$result = mysql_query($query);
$somme = array();
while($row = mysql_fetch_array($result)) {
    $date = preg_split('/-/', $row['date']);
    if (!isset($somme[$date[1]-1])) {
        $somme[$date[1]-1] = 0;
    }

    if ($row['from'] == 0) {
        $somme[$date[1]-1] += $row['val'];
    } else if ($row['to'] == 0) {
        $somme[$date[1]-1] += -1*$row['val'];
    }
}

mysql_close($link);

$i = 0;
for($i=0; $i < 12; $i++) {
    if ($i == 0) {
        $data[$i] = 0;
    } else {
        $data[$i] = $data[$i-1];
    }
    if (isset($somme[$i])) {
        $data[$i] += $somme[$i];
    }
}


print(json_encode($data));





?>


