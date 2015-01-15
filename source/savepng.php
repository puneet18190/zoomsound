<?php
$outp = '';


   ob_start();
   print_r($GLOBALS["HTTP_RAW_POST_DATA"]);
   $outp = ob_get_contents();
   ob_end_clean();

   $outp = str_replace("'", '', $outp);
   $outp = trim(preg_replace('/\s+/', '', $outp));
   //echo $outp;
   
if ( isset ( $GLOBALS["HTTP_RAW_POST_DATA"] )) {


$fileName = 'img.png';
if(isset($_GET['location'])){
    $fileName = $_GET['location'];
    $fileName = str_replace('{{dirname}}', dirname(__FILE__) . '/', $fileName);
}
    
//the image file name   

// get the binary stream
$im = $GLOBALS["HTTP_RAW_POST_DATA"];

//write it
$fp = fopen($fileName, 'wb');
fwrite($fp, $im);
fclose($fp);

//echo the fileName;
echo $fileName;


} else {
    echo "error:http raw post data does not exist";
}