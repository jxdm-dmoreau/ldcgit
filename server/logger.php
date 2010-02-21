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
   $LOG_FILE='/tmp/ldc_server.log';
   $handle = fopen($LOG_FILE, 'a');
   fwrite($handle, "[ERROR] $msg\n");
   fclose($handle);
   print('1');
   die();
}
