<?php
/******************************************************************************
   request

response
[
    {
    "id":"4",
    "bank":"La Banque Postale",
    "name":"Courses",
    "solde_init":"0",
    "date":"2010-02-23",
    "solde_date":"0"
    },
    {
    "id":"6",
    "bank":"Boursorama",
    "name":"Compte courant",
    "solde_init":"0",
    "date":"0000-00-00",
    "solde_date":"0"
    }
]
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




/* update de la table categories */
$query = 'SELECT * FROM `comptes`';
DEBUG($query);
$result = mysql_query($query);
test_mysql_result($result);
$i = 0;
while ($row = mysql_fetch_array($result)) {
    extract($row);
    $return[$i]->id = $id;
    $return[$i]->bank = utf8_encode($bank);
    $return[$i]->name = utf8_encode($name);
    $return[$i]->solde_init = $solde_init;
    $return[$i]->date = $date;
    $return[$i]->solde_date = $solde_date;
    $i++;
}

mysql_close($link);
print(json_encode($return));

?>
