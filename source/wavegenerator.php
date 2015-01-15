    <?php
$fv_multiplier = 1;
if(isset($_GET['multiplier'])){
    $fv_multiplier = $_GET['multiplier'];
}

$color_waveformbg = '4f4949';
if(isset($_GET['color_waveformbg'])){
    $color_waveformbg = $_GET['color_waveformbg'];
}
$color_waveformprog = 'ae1919';
if(isset($_GET['color_waveformprog'])){
    $color_waveformprog = $_GET['color_waveformprog'];
}
$settings_wavestyle = 'reflect';
if(isset($_GET['settings_wavestyle'])){
    $settings_wavestyle = $_GET['settings_wavestyle'];
}

$the_media = 'song.mp3';
if(isset($_GET['media'])){
    $the_media = $_GET['media'];
}
?>
<html>
<head>
    <title>Flash Waveform Generator</title>
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
<p>
    <object type="application/x-shockwave-flash" data="wavegenerator.swf" width="1170" height="450" id="flashcontent" style="visibility: visible;">
        <param name="movie" value="wavegenerator.swf"><param name="menu" value="false"><param name="allowScriptAccess" value="always">
        <param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque">
        <param name="flashvars" value="settings_multiplier=<?php echo $fv_multiplier; ?>&media=<?php echo $the_media; ?>&savetophp_loc=savepng.php&savetophp_pngloc=waves/scrubbg.png&savetophp_pngprogloc=waves/scrubprog.png&color_wavesbg=<?php echo $color_waveformbg; ?>&color_wavesprog=<?php echo $color_waveformprog; ?>&settings_wavestyle=<?php echo $settings_wavestyle; ?>&settings_enablejscallback=on">
    </object>
</p>
<h3>Demo Configuration</h3>
<pre>
<?php echo htmlentities('<div id="ap2" class="audioplayer-tobe skin-wave" style="" data-thumb="img/adg3.jpg" data-scrubbg="waves/scrubbg.png" data-scrubprog="waves/scrubprog.png" data-videoTitle="Audio Video" data-type="normal" data-source="'.$the_media.'">
<div class="meta-artist"><span class="the-artist">Mick Jagger</span><br/><span class="the-name">Revenge</div></div>');
?>
</pre>
<script>
window.api_wavesentfromflash = function(arg){
if(window.console) { console.info( arg); };
}
</script>
</body>
</html>