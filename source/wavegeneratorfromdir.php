<?php
$fv_multiplier = 1;
if(isset($_GET['multiplier'])){
    $fv_multiplier = $_GET['multiplier'];
}

$color_wavesbg = 'ffffff';
if(isset($_GET['color_wavesbg'])){
    $color_wavesbg = $_GET['color_wavesbg'];
}
$color_wavesprog = 'ef7d5d';
if(isset($_GET['color_wavesprog'])){
    $color_wavesprog = $_GET['color_wavesprog'];
}
$settings_wavestyle = 'reflect';
if(isset($_GET['settings_wavestyle'])){
    $settings_wavestyle = $_GET['settings_wavestyle'];
}

$dirname = 'sounds';
if(isset($_GET['dirname'])){
    $dirname = $_GET['dirname'];
}
$dir = dirname(__FILE__).'/'.$dirname;

$files2 = scandir($dir);


foreach($files2 as $lab => $file){
    if(strpos($file,'.mp3')===false){
        unset($files2[$lab]);
    }
}
//print_r($files2);
?>
<html>
<head>
    <title>Flash Waveform Generator From a Directory</title>
    <style>
        pre{
            background: #ddd;
            color: #555;
            padding: 15px 20px;
            -moz-hyphens: auto;
    word-wrap: break-word;
    white-space:pre-wrap;
    font-size: 10px;
    font-family: "Lucida Console", Monaco, monospace;
    
        }
    </style>
</head>
<body>
    <?php
    foreach($files2 as $file){
        //$san_filename = $file;
        $san_filename = str_replace(array(' ', '.'),'_',$file);
        echo '<p>
    <object type="application/x-shockwave-flash" data="wavegenerator.swf" width="1170" height="400" id="flashcontent" style="visibility: visible;">
        <param name="movie" value="wavegenerator.swf"><param name="menu" value="false"><param name="allowScriptAccess" value="always">
        <param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque">
        <param name="flashvars" value="settings_multiplier='.$fv_multiplier.'&media='.$dirname.'/'.$file.'&savetophp_loc=savepng.php&savetophp_pngloc=waves/'.$san_filename.'.png&savetophp_pngprogloc=waves/'.$san_filename.'prog.png&color_wavesbg='.$color_wavesbg.'&color_wavesprog='.$color_wavesprog.'&settings_wavestyle='.$settings_wavestyle.'">
    </object>
</p>';
    }
    ?>
    <h3>Demo Configuration</h3>
    <?php
    $aux = '<div id="ag1" class="audiogallery" style="opacity:0; margin-top: 70px;"><div class="items">';
    foreach($files2 as $file){
        $san_filename = str_replace(array(' ', '.'),'_',$file);
        $aux.='
<div class="audioplayer-tobe" style="width:100%; " data-thumb="img/adg3.jpg" data-bgimage="img/bg.jpg" data-scrubbg="'.$san_filename.'.png" data-scrubprog="'.$san_filename.'prog.png" data-videoTitle="Audio Video" data-type="normal" data-source="'.$dirname.'/'.$file.'" >
    <div class="meta-artist"><span class="the-artist">Mick Jagger</span><br/><span class="the-name">Revenge</span>
    </div>
    <div class="menu-description">
        <div class="menu-item-thumb-con"><div class="menu-item-thumb" style="background-image: url(img/adg3.jpg)"></div></div>
        <span class="the-artist">Mick Jagger</span>
        <span class="the-name">Revenge</span>
    </div>
</div>';
    }
    
    $aux.='</div></div>';
    $aux.='
<script>
jQuery(document).ready(function ($) {
        var settings_ap = {
            disable_volume: "off"
            ,disable_scrub: "default"
            ,design_skin: "skin-wave"
            ,skinwave_dynamicwaves:"off"
            ,skinwave_enableSpectrum:"off"
            ,settings_backup_type:"full"
            ,skinwave_enableReflect:"on"
        };
        dzsag_init("#ag1",{
            "transition":"fade"
            ,"autoplay" : "on"
            ,"autoplayNext" : "on"
            ,design_menu_position:"top"
            ,"settings_ap":settings_ap
        });
});</script>';
    
    echo '<pre>'.htmlentities($aux).'</pre>';
    ?>
</body>
</html>