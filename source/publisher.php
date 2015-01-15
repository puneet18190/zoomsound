<?php
    

//print_r($_POST);
if(isset($_POST['action']) && $_POST['action']=='dzsap_front_submitcomment'){
    
    $aux = 'comments';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
    $current = file_get_contents($file);
    $current .= $_POST['postdata'];
    $confirmer = file_put_contents($file, $current);

    echo $confirmer;
    
    
    die();
}

if(isset($_POST['action']) && $_POST['action']=='dzsap_get_comments'){
    
    
    $aux = 'comments';
    $playerid = '';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
        $playerid=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
//    echo $file;
    $current = file_get_contents($file);
    
    
    
    echo $current;
    
    
    
    //print_r($_COOKIE);
    
    die();
}



if(isset($_POST['action']) && $_POST['action']=='dzsap_get_rate'){
    
    
    $aux = 'db-rates';
    $playerid = '';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
        $playerid=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
    
    $current = file_get_contents($file);
    
    
    
    if(isset($_COOKIE['ratesubmitted-'.$playerid])){
        $current.='|'.$_COOKIE['ratesubmitted-'.$playerid];
    }
    
    echo $current;
    
    
    
    //print_r($_COOKIE);
    
    die();
}
if(isset($_POST['action']) && $_POST['action']=='dzsap_submit_rate'){
    
    
    
    $aux = 'db-rates';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
        $playerid=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
    
    
    
    $current = file_get_contents($file);
    $current_arr = explode("|", $current);
//    print_r($current_arr);
    
    $rate_index = 0;
    $rate_nr = 0;
    
    if(count($current_arr)==1 && $current_arr[0]==''){
//        echo 'ceva';
    }else{
        $rate_index = $current_arr[0];
        $rate_nr = intval($current_arr[1]);
        
        if($rate_index=='' || $rate_index==' '){
            $rate_index = 0;
        }
    }
    
    if(!isset($_COOKIE['ratesubmitted-'.$playerid])){
        $rate_nr++;
    }
    
    
        if($rate_nr<=0){
            $rate_nr = 1;
        }
    
    $rate_index = ($rate_index * ($rate_nr-1) + intval($_POST['postdata'])) / ($rate_nr);
    
//    echo ' $rate_index: '; print_r($rate_index);
//    echo ' $rate_nr: '; print_r($rate_nr);
    
    $fout =  $rate_index.'|'.$rate_nr;
    
//    echo ' $fout: '; print_r($fout);
    
    $confirmer = file_put_contents($file, $fout);
    
    
    setcookie('ratesubmitted-'.$playerid, intval($_POST['postdata']), time()+36000);

    echo $confirmer;
    
    die();
}






if(isset($_POST['action']) && $_POST['action']=='dzsap_get_likes'){
    
    
    $aux = 'db-likes';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
        $playerid=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
    
    $current = file_get_contents($file);
    echo $current;
    
    
    if(isset($_COOKIE['likesubmitted-'.$playerid])){
        echo 'likesubmitted';
    }
    
    //print_r($_COOKIE);
    
    die();
}


if(isset($_POST['action']) && $_POST['action']=='dzsap_submit_like'){
    
    
    
    $aux = 'db-likes';
        $playerid='';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
        $playerid=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
    
    
    
    $current = file_get_contents($file);
    $current = intval($current);
    $current = $current + 1;
    $confirmer = file_put_contents($file, $current);
    
    setcookie('likesubmitted-'.$playerid, '1', time()+36000);

    echo $confirmer;
    
    die();
}
if(isset($_POST['action']) && $_POST['action']=='dzsap_retract_like'){
    
    $aux = 'db-likes';
        $playerid='';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
        $playerid=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
    
    
    
    $current = file_get_contents($file);
    $current = intval($current);
    $current = $current - 1;
    $confirmer = file_put_contents($file, $current);
    
    
    setcookie('likesubmitted-'.$playerid, '', time()-36000);

    echo $confirmer;
    
    
    die();
}


if(isset($_POST['action']) && $_POST['action']=='dzsap_submit_views'){
    
    $aux = 'db-views';
        $playerid='';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
        $playerid=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
    
    
    $current = file_get_contents($file);
    
    if($current==''){
        $current = 0;
    }
    $current = intval($current);
    
    if(isset($_COOKIE['viewsubmitted-'.$playerid])){
        //echo $current;
    }else{
        $current = $current + 1;
        setcookie('viewsubmitted-'.$playerid, '1', time()+36000);
        $confirmer = file_put_contents($file, $current);
        //echo $current;
    }
    
    setcookie('viewsubmitted-'.$playerid, '1', time()+36000);

    echo $confirmer;
    
    die();
}

if(isset($_POST['action']) && $_POST['action']=='dzsap_get_views'){
    
    $aux = 'db-views';
        $playerid='';
    
    if(isset($_POST['playerid'])){
        $aux.=$_POST['playerid'];
        $playerid=$_POST['playerid'];
    }
    
    $file = dirname(__FILE__).'/db/'.$aux.'.html';
    
    
    $current = file_get_contents($file);
    echo $current;
    
    if(isset($_COOKIE['viewsubmitted-'.$playerid])){
        echo 'viewsubmitted';
    }
    
    
    
    //print_r($_COOKIE);
    
    die();
}