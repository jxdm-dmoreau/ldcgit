<?php
/******************************************************************************
   request

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



/*****************************************************************************
 * Traitement dans la BDD
 *****************************************************************************/
$link = mysql_connect($LDC_MYSQL_HOST, $LDC_MYSQL_USER, $LDC_MYSQL_PASSWD);
mysql_select_db($LDC_MYSQL_DB, $link);



/* select de la table categories */
$query = 'SELECT MIN(date), MAX(date) FROM `operations`';
DEBUG($query);

$result = mysql_query($query);
$row = mysql_fetch_array($result);
mysql_close($link);

$date = preg_split('/-/', $row['MIN(date)']);
$year_min = $date[0];
$date = preg_split('/-/', $row['MAX(date)']);
$year_max = $date[0];

print "<select class=\"year\">\n";
for($i = $year_min; $i <= $year_max; $i++) {
    if ($i == date('Y')) {
        print "<option value=\"$i\" selected=\"seleced\">$i</option>\n";
    } else {
        print "<option value=\"$i\">$i</option>\n";
    }
}
print "</select>\n";

?>
