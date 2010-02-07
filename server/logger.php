<?php

function DEBUG($msg)
{
    $LOG_FILE='/tmp/ldc_server.log';
    $handle = fopen($LOG_FILE, 'a');
    fwrite($handle, "[DEBUG] $msg\n");
    fclose($handle);
}

function ERROR($msg)
{
   $handle = fopen($LOG_FILE, 'a');
   fwrite($handle, "[ERROR] $msg\n");
   fclose($handle);
   die("die on error!");
}
