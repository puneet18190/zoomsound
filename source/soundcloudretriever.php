<?php

if(!function_exists('dzs_get_contents')){
    function dzs_get_contents($url, $pargs = array()) {
        $margs = array(
            'force_file_get_contents' => 'off',
        );
        $margs = array_merge($margs, $pargs);
        if (function_exists('curl_init') && $margs['force_file_get_contents'] == 'off') { // if cURL is available, use it...
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $cache = curl_exec($ch);
            curl_close($ch);
        } else {
            $cache = @file_get_contents($url); // ...if not, use the common file_get_contents()
        }
        return $cache;
    }
}

if ( isset ( $_GET["scurl"] )) {
    $aux =  dzs_get_contents($_GET["scurl"]);
    $aux = json_decode($aux);
    //print_r($aux);
    if(is_object($aux)){
        $aux2 = dzs_get_contents($aux->location);
        echo $aux2;
    }else{
        echo 'aux is not array ';
        print_r($aux);
    }
}
