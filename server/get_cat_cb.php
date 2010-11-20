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
$query = 'SELECT * FROM `categories`';
DEBUG($query);

$result = mysql_query($query);
$cats = array();
$names = array();
while($row = mysql_fetch_array($result)) {
    $cats[$row['father_id']][] = $row['id'];
    $names[$row['id']] = utf8_encode($row['name']);
}

mysql_close($link);

function display_recursif($cats, $names, $id, $father_names){
    foreach($cats[$id] as $cat_id) {
        if ($father_names == "") {
            print("<option value=\"$cat_id\">$names[$cat_id]</option>\n");
            display_recursif($cats, $names, $cat_id, "$names[$cat_id]" );
        } else {
            print("<option value=\"$cat_id\">$father_names &rarr; $names[$cat_id]</option>\n");
            display_recursif($cats, $names, $cat_id, "$father_names &rarr; $names[$cat_id]" );
        }
    }
}

print "<select class=\"cats\">\n";
print "<option value=\"0\" selected=\"selected\">== Tout ==</option>\n";
print "<optgroup label=\"Catégories\">\n";
display_recursif($cats, $names, 0, "");
print "</optgroup>";
print "</select>\n";

?>
