function htmlEncode(arg) {
    return jQuery("<div/>").text(arg).html()
}
function htmlDecode(value) {
    return jQuery("<div/>").html(arg).text()
}
var dzsap_list = [];
var dzsap_ytapiloaded = false;
var dzsap_globalidind = 20;
(function ($) {
    $.fn.prependOnce = function (arg, argfind) {
        var _t = $(this[0]);
        if (_t.children(argfind).length < 1)_t.prepend(arg)
    };
    $.fn.appendOnce = function (arg, argfind) {
        var _t = $(this[0]);
        if (_t.children(argfind).length < 1)_t.append(arg)
    };
    $.fn.audioplayer = function (o) {
        var defaults = {design_skin: "skin-default", autoplay: "off", cue: "on", swf_location: "ap.swf", swffull_location: "apfull.swf", settings_backup_type: "full", settings_extrahtml: "", design_thumbh: "default", design_thumbw: "200", disable_volume: "default", disable_scrub: "default",
            disable_player_navigation: "off", disable_timer: "default", type: "audio", skinwave_dynamicwaves: "off", soundcloud_apikey: "", parentgallery: undefined, skinwave_enableSpectrum: "off", skinwave_enableReflect: "on", settings_useflashplayer: "auto", skinwave_spectrummultiplier: "1", skinwave_comments_enable: "off", settings_php_handler: "publisher.php", php_retriever: "soundcloudretriever.php", skinwave_mode: "normal", skinwave_comments_playerid: "", skinwave_comments_account: "none", skinwave_comments_retrievefromajax: "off", skinwave_comments_displayontime: "on",
            skinwave_timer_static: "off", skinwave_comments_avatar: "http://www.gravatar.com/avatar/00000000000000000000000000000000?s=20", skinwave_spectrum_wavesbg: "4f4949", skinwave_spectrum_wavesprog: "ae1919", design_menu_show_player_state_button: "off", playfrom: "off", design_animateplaypause: "default"};
        o = $.extend(defaults, o);
        this.each(function () {
            var cthis = $(this);
            var cchildren = cthis.children(), cthisId = "ap1";
            var currNr = -1;
            var busy = true;
            var i = 0;
            var ww, wh, tw, th, cw, ch, sw = 0, sh, spos = 0;
            var _audioplayerInner, _apControls,
                _conControls, _conPlayPause, _controlsVolume, _scrubbar, _theMedia, _cmedia, _theThumbCon, _metaArtistCon, _scrubBgReflect = null, _scrubBgReflectCanvas = null, _scrubBgReflectCtx = null, _scrubProgReflect = null, _scrubProgCanvasReflect = null, _scrubProgCanvasReflectCtx = null, _scrubBgCanvas = null, _scrubBgCanvasCtx = null, _scrubProgCanvas = null, _scrubProgCanvasCtx = null, _commentsHolder = null, _commentsWriter = null, _currTime = null, _totalTime = null;
            var busy = false, playing = false, muted = false, loaded = false;
            var time_total = 0, time_curr = 0;
            var index_extrahtml_toloads = 0;
            var last_vol = 1, last_vol_before_mute = 1, the_player_id = "";
            var inter_check, inter_checkReady;
            var skin_minimal_canvasplay, skin_minimal_canvaspause;
            var is_flashplayer = false;
            var data_source;
            var res_thumbh = false;
            var str_ie8 = "";
            var javascriptNode = null;
            var audioCtx = null;
            var audioBuffer = null;
            var sourceNode = null;
            var analyser = null;
            var lastarray = null;
            var webaudiosource = null;
            var canw = 100;
            var canh = 100;
            var barh = 100;
            var type = "";
            var sposarg = 0;
            var arr_the_comments = [];
            var lasttime_inseconds =
                0;
            var controls_left_pos = 0;
            var controls_right_pos = 0;
            var ajax_view_submitted = "auto";
            var starrating_index = 0, starrating_nrrates = 0, starrating_alreadyrated = -1;
            var playfrom = "off", playfrom_ready = false;
            if (isNaN(parseInt(o.design_thumbh, 10)) == false)o.design_thumbh = parseInt(o.design_thumbh, 10);
            if (String(o.design_thumbw).indexOf("%") == -1)o.design_thumbw = parseInt(o.design_thumbw, 10);
            if (cthis.children(".extra-html").length > 0 && o.settings_extrahtml == "") {
                o.settings_extrahtml = cthis.children(".extra-html").eq(0).html();
                var re_ratesubmitted = /{{ratesubmitted=(.?)}}/g;
                if (re_ratesubmitted.test(String(o.settings_extrahtml))) {
                    re_ratesubmitted.lastIndex = 0;
                    var auxa = re_ratesubmitted.exec(String(o.settings_extrahtml));
                    starrating_alreadyrated = auxa[1];
                    o.settings_extrahtml = String(o.settings_extrahtml).replace(re_ratesubmitted, "");
                    if (o.parentgallery != undefined && ($(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_player_rateSubmitted != undefined))$(o.parentgallery).get(0).api_player_rateSubmitted()
                }
                cthis.children(".extra-html").remove()
            }
            init();
            function init() {
                if (o.design_skin == "")o.design_skin = "skin-default";
                if (cthis.attr("class").indexOf("skin-") == -1)cthis.addClass(o.design_skin);
                if (cthis.hasClass("skin-default"))o.design_skin = "skin-default";
                if (cthis.hasClass("skin-wave"))o.design_skin = "skin-wave";
                if (cthis.hasClass("skin-justthumbandbutton"))o.design_skin = "skin-justthumbandbutton";
                if (cthis.hasClass("skin-minimal")) {
                    o.design_skin = "skin-minimal";
                    if (o.disable_volume == "default")o.disable_volume = "on";
                    if (o.disable_scrub == "default")o.disable_scrub =
                        "on";
                    o.disable_timer = "on"
                }
                if (cthis.hasClass("skin-minion")) {
                    o.design_skin = "skin-minion";
                    if (o.disable_volume == "default")o.disable_volume = "on";
                    if (o.disable_scrub == "default")o.disable_scrub = "on";
                    o.disable_timer = "on"
                }
                if (o.design_skin == "skin-default")if (o.design_thumbh == "default") {
                    o.design_thumbh = cthis.height() - 40;
                    res_thumbh = true
                }
                if (o.design_skin == "skin-wave") {
                    cthis.addClass("skin-wave-mode-" + o.skinwave_mode);
                    if (o.skinwave_mode == "small")if (o.design_thumbh == "default")o.design_thumbh = 80
                }
                if (o.design_skin ==
                    "skin-justthumbandbutton") {
                    if (o.design_thumbh == "default")o.design_thumbh = "";
                    o.disable_timer = "on";
                    o.disable_volume = "on";
                    if (o.design_animateplaypause == "default")o.design_animateplaypause = "on"
                }
                if (o.design_thumbh == "default")o.design_thumbh = 200;
                if (o.design_animateplaypause == "default")o.design_animateplaypause = "off";
                if (o.skinwave_comments_playerid == "") {
                    if (typeof cthis.attr("id") != "undefined")the_player_id = cthis.attr("id")
                } else the_player_id = o.skinwave_comments_playerid;
                if (the_player_id == "")o.skinwave_comments_enable =
                    "off";
                playfrom = o.playfrom;
                if (isValid(cthis.attr("data-playfrom")))playfrom = cthis.attr("data-playfrom");
                if (isNaN(parseInt(playfrom, 10)) == false)playfrom = parseInt(playfrom, 10);
                if (cthis.attr("data-type") == "youtube") {
                    o.type = "youtube";
                    type = "youtube"
                }
                if (cthis.attr("data-type") == "soundcloud") {
                    o.type = "soundcloud";
                    type = "soundcloud"
                }
                if (cthis.attr("data-type") == "shoutcast") {
                    o.type = "shoutcast";
                    type = "audio";
                    o.disable_timer = "on";
                    if (o.design_skin == "skin-default")o.disable_scrub = "on"
                }
                if (type == "")type = "audio";
                if (cthis.hasClass("audioplayer"))return;
                if (cthis.attr("id") != undefined)cthisId = cthis.attr("id"); else cthisId = "ap" + dzsap_globalidind++;
                cthis.removeClass("audioplayer-tobe");
                cthis.addClass("audioplayer");
                if (cthis.find(".the-comments").length > 0 && cthis.find(".the-comments").eq(0).children().length > 0)arr_the_comments = cthis.find(".the-comments").eq(0).children(); else if (o.skinwave_comments_retrievefromajax == "on") {
                    var data = {action: "dzsap_get_comments", postdata: "1", playerid: the_player_id};
                    $.ajax({type: "POST", url: o.settings_php_handler, data: data,
                        success: function (response) {
                            if (typeof window.console != "undefined")console.log("Ajax - get - comments - " + response);
                            cthis.prependOnce('<div class="the-comments"></div>', ".the-comments");
                            cthis.find(".the-comments").eq(0).html(response);
                            arr_the_comments = cthis.find(".the-comments").eq(0).children();
                            setup_controls_commentsHolder()
                        }, error: function (arg) {
                            if (typeof window.console != "undefined")console.log("Got this from the server: " + arg, arg)
                        }})
                }
                if (is_ios()) {
                    o.disable_volume = "on";
                    o.autoplay = "off"
                }
                if (is_android())o.autoplay =
                    "off";
                if (type == "youtube")if (dzsap_ytapiloaded == false) {
                    var tag = document.createElement("script");
                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag = document.getElementsByTagName("script")[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    dzsap_ytapiloaded = true
                }
                data_source = cthis.attr("data-source");
                if (cthis.attr("data-source") != undefined && String(cthis.attr("data-source")).indexOf("https://soundcloud.com/") > -1)type = "soundcloud";
                if (type == "soundcloud") {
                    if (o.soundcloud_apikey == "")alert("soundcloud api key not defined, read docs!");
                    var aux = "http://api." + "soundcloud.com" + "/resolve?url=" + data_source + "&format=json&consumer_key=" + o.soundcloud_apikey;
                    if (o.design_skin == "skin-wave" && cthis.attr("data-scrubbg") == undefined)o.skinwave_enableReflect = "off";
                    aux = encodeURIComponent(aux);
                    $.getJSON(o.php_retriever + "?scurl=" + aux, function (data) {
                        type = "audio";
                        if (o.design_skin == "skin-wave" && cthis.attr("data-scrubbg") == undefined) {
                            cthis.attr("data-scrubbg", data.waveform_url);
                            cthis.attr("data-scrubprog", data.waveform_url);
                            _scrubbar.find(".scrub-bg").eq(0).append('<div class="scrub-bg-div"></div>');
                            _scrubbar.find(".scrub-bg").eq(0).append('<img src="' + cthis.attr("data-scrubbg") + '" class="scrub-bg-img"/>');
                            _scrubbar.children(".scrub-prog").eq(0).append('<div class="scrub-prog-div"></div>');
                            _scrubbar.find(".scrub-bg").css({"top": 0})
                        }
                        if (window.console)console.info(data);
                        cthis.attr("data-source", data.stream_url + "?consumer_key=" + o.soundcloud_apikey + "&origin=localhost");
                        if (o.cue == "on")setup_media()
                    })
                }
                if (can_playmp3() == false && cthis.attr("data-sourceogg") == undefined || (is_ie8() || o.settings_useflashplayer ==
                    "on"))is_flashplayer = true;
                setup_structure();
                if (o.design_skin == "skin-wave" && (type == "audio" && o.skinwave_comments_enable == "on")) {
                    cthis.appendOnce('<div class="comments-holder"><div class="the-bg"></div></div><div class="clear"></div><div class="comments-writer"><div class="comments-writer-inner"><div class="setting"><div class="setting-label"></div><input placeholder="Your email.." name="comment-email" type="text" class="comment-input"/><input name="comment-text" placeholder="Your comment.." type="text" class="comment-input"/><button class="submit-ap-comment dzs-button float-right">Submit</button><button class="cancel-ap-comment dzs-button float-right">Cancel</button><div class="clear"></div></div></div></div>',
                        ".comments-holder");
                    _commentsHolder = cthis.find(".comments-holder").eq(0);
                    _commentsWriter = cthis.find(".comments-writer").eq(0);
                    setup_controls_commentsHolder();
                    _commentsHolder.find(".the-bg").bind("click", click_comments_bg);
                    _commentsWriter.find(".cancel-ap-comment").bind("click", click_cancel_comment);
                    _commentsWriter.find(".submit-ap-comment").bind("click", click_submit_comment)
                }
                if (o.settings_extrahtml != "")cthis.append('<div class="extra-html">' + o.settings_extrahtml + "</div>");
                if (type == "youtube") {
                    dzsap_list.push(cthis);
                    _theMedia.append('<div id="ytplayer_' + cthisId + '"></div>');
                    cthis.get(0).fn_yt_ready = check_yt_ready
                }
                if (typeof o.parentgallery != "undefined" && o.disable_player_navigation != "on")_audioplayerInner.appendOnce('<div class="prev-btn"></div><div class="next-btn"></div>', ".prev-btn");
                if (o.design_skin == "skin-wave" && (typeof o.parentgallery != "undefined" && o.design_menu_show_player_state_button == "on"))_audioplayerInner.appendOnce('<div class="btn-menu-state"></div>', ".btn-menu-state");
                if (type == "audio");
                if (type == "youtube" &&
                    is_ios()) {
                    if (cthis.height() < 200)cthis.height(200);
                    aux = '<iframe width="100%" height="100%" src="//www.youtube.com/embed/F4CIwdN5ATM" frameborder="0" allowfullscreen></iframe>';
                    cthis.html(aux);
                    return
                } else if (o.cue == "on" && type != "soundcloud")setup_media(); else cthis.bind("click", click_cthis);
                cthis.find(".prev-btn").eq(0).bind("click", click_prev_btn);
                cthis.find(".next-btn").eq(0).bind("click", click_next_btn);
                cthis.find(".btn-menu-state").eq(0).bind("click", click_menu_state)
            }

            function setup_controls_commentsHolder() {
                for (i =
                         0; i < arr_the_comments.length; i++)_commentsHolder.append(arr_the_comments[i])
            }

            function click_cthis() {
                cthis.unbind("click", click_cthis);
                setup_media()
            }

            function blur_ap() {
                hide_comments_writer()
            }

            function click_menu_state(e) {
                if (typeof o.parentgallery.get(0) != "undefined")o.parentgallery.get(0).api_toggle_menu_state()
            }

            function click_comments_bg(e) {
                var _t = $(this);
                var lmx = parseInt(e.clientX, 10) - _t.offset().left;
                sposarg = lmx / _t.width() * 100 + "%";
                var argcomm = htmlEncode("");
                if (_commentsWriter.hasClass("active") ==
                    false) {
                    _commentsWriter.css({"height": _commentsWriter.find(".comments-writer-inner").eq(0).outerHeight()});
                    _commentsWriter.addClass("active");
                    if (o.parentgallery != undefined && ($(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_handleResize != undefined))$(o.parentgallery).get(0).api_handleResize()
                }
                if (o.skinwave_comments_account != "none")cthis.find("input[name=comment-email]").remove();
                _commentsHolder.find(".a-comment.placeholder").remove();
                _commentsHolder.append('<span class="a-comment placeholder" style="left:' +
                    sposarg + ';"><div class="the-avatar" style="background-image: url(' + o.skinwave_comments_avatar + ')"></div></span>')
            }

            function click_cancel_comment(e) {
                hide_comments_writer()
            }

            function click_submit_comment(e) {
                var comm_author = "";
                if (cthis.find("input[name=comment-email]").length > 0) {
                    var regex_mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (regex_mail.test(cthis.find("input[name=comment-email]").eq(0).val()) ==
                        false) {
                        alert("please insert email, your email is just used for gravatar. it will not be sent or stored anywhere");
                        return false
                    }
                    comm_author = String(cthis.find("input[name=comment-email]").eq(0).val()).split("@")[0];
                    o.skinwave_comments_account = comm_author;
                    o.skinwave_comments_avatar = "https://secure.gravatar.com/avatar/" + MD5(String(cthis.find("input[name=comment-email]").eq(0).val()).toLowerCase()) + "?s=20"
                } else;
                comm_author = o.skinwave_comments_account;
                var aux = '<span class="a-comment with-tooltip" style="left:' +
                    sposarg + '"><div class="aux-padder"></div><span class="dzstooltip arrow-bottom skin-black" style="width: 250px;"><span class="the-comment-author">@' + comm_author + "</span> says:<br>";
                aux += htmlEncode(cthis.find("input[name=comment-text]").eq(0).val());
                aux += '</span><div class="the-avatar" style="background-image: url(' + o.skinwave_comments_avatar + ')"></div></span>';
                cthis.find("input[name=comment-text]").eq(0).val("");
                skinwave_comment_publish(aux);
                hide_comments_writer();
                if (o.parentgallery != undefined && ($(o.parentgallery).get(0) !=
                    undefined && $(o.parentgallery).get(0).api_player_commentSubmitted != undefined))$(o.parentgallery).get(0).api_player_commentSubmitted();
                return false
            }

            function hide_comments_writer() {
                _commentsHolder.find(".a-comment.placeholder").remove();
                _commentsWriter.removeClass("active");
                _commentsWriter.css({"height": 0});
                if (o.parentgallery != undefined && ($(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_handleResize != undefined))$(o.parentgallery).get(0).api_handleResize()
            }

            function check_yt_ready() {
                if (loaded ==
                    true)return;
                _cmedia = new YT.Player("ytplayer_" + cthisId + "", {height: "200", width: "200", videoId: cthis.attr("data-source"), playerVars: {origin: ""}, events: {"onReady": check_yt_ready_phase_two, "onStateChange": change_yt_state}})
            }

            function check_yt_ready_phase_two(arg) {
                init_loaded()
            }

            function change_yt_state(arg) {
            }

            function check_ready() {
                if (type == "youtube"); else if (typeof _cmedia != "undefined")if (_cmedia.nodeName != "AUDIO" || o.type == "shoutcast")init_loaded(); else if (_cmedia.readyState >= 2)init_loaded()
            }

            function setup_structure() {
                cthis.append('<div class="audioplayer-inner"></div>');
                _audioplayerInner = cthis.children(".audioplayer-inner");
                _audioplayerInner.append('<div class="the-media"></div>');
                _audioplayerInner.append('<div class="ap-controls"></div>');
                _theMedia = _audioplayerInner.children(".the-media").eq(0);
                _apControls = _audioplayerInner.children(".ap-controls").eq(0);
                var aux = '<div class="scrubbar">';
                if (o.design_skin == "skin-wave" && o.skinwave_enableReflect == "on") {
                    aux += '<div class="scrub-bg-reflect"></div>';
                    aux += '<div class="scrub-prog-reflect"></div>'
                }
                aux += '<div class="scrub-bg"></div><div class="scrub-buffer"></div><div class="scrub-prog"></div><div class="scrubBox"></div><div class="scrubBox-prog"></div><div class="scrubBox-hover"></div>';
                if (o.design_skin == "skin-wave" && o.disable_timer != "on")aux += '<div class="total-time">00:00</div><div class="curr-time">00:00</div>';
                aux += "</div>";
                aux += '<div class="con-controls"><div class="the-bg"></div><div class="con-playpause"><div class="playbtn"><div class="play-icon"></div><div class="play-icon-hover"></div></div><div class="pausebtn" style="display:none"><div class="pause-icon"><div class="pause-part-1"></div><div class="pause-part-2"></div></div><div class="pause-icon-hover"></div></div></div>';
                if (o.design_skin != "skin-wave" && o.disable_timer != "on")aux += '<div class="curr-time">00:00</div><div class="total-time">00:00</div>';
                aux += "</div>";
                _apControls.append(aux);
                if (o.disable_timer != "on") {
                    _currTime = cthis.find(".curr-time").eq(0);
                    _totalTime = cthis.find(".total-time").eq(0)
                }
                _scrubbar = _apControls.children(".scrubbar");
                _conControls = _apControls.children(".con-controls");
                _conPlayPause = _conControls.children(".con-playpause").eq(0);
                _conControls.append('<div class="controls-volume"><div class="volumeicon"></div><div class="volume_static"></div><div class="volume_active"></div><div class="volume_cut"></div></div>');
                _controlsVolume = _conControls.children(".controls-volume");
                if (cthis.children(".meta-artist").length > 0)_audioplayerInner.append(cthis.children(".meta-artist"));
                _audioplayerInner.children(".meta-artist").eq(0).wrap('<div class="meta-artist-con"></div>');
                _metaArtistCon = _audioplayerInner.children(".meta-artist-con").eq(0);
                var str_thumbh = "";
                if (o.design_thumbh != "")str_thumbh = " height:" + o.design_thumbh + "px;";
                if (cthis.attr("data-thumb") != undefined && cthis.attr("data-thumb") != "") {
                    _audioplayerInner.prepend('<div class="the-thumb-con"><div class="the-thumb" style="' +
                        str_thumbh + " background-image:url(" + cthis.attr("data-thumb") + ')"></div></div>');
                    _theThumbCon = _audioplayerInner.children(".the-thumb-con").eq(0);
                    if (cthis.attr("data-thumb_link") != undefined)_theThumbCon.wrap('<a href="' + cthis.attr("data-thumb_link") + '" target="_blank"></a>')
                }
                if (o.disable_volume == "on")_controlsVolume.hide();
                if (o.disable_volume == "off")_controlsVolume.show();
                if (o.disable_scrub == "on")_scrubbar.hide();
                if (o.design_skin == "skin-wave") {
                    if (o.skinwave_enableSpectrum != "on") {
                        if (cthis.attr("data-scrubbg") !=
                            undefined)_scrubbar.children(".scrub-bg").eq(0).append('<img class="scrub-bg-img" src="' + cthis.attr("data-scrubbg") + '"/>');
                        if (cthis.attr("data-scrubprog") != undefined)_scrubbar.children(".scrub-prog").eq(0).append('<img class="scrub-prog-img" src="' + cthis.attr("data-scrubprog") + '"/>');
                        _scrubbar.find(".scrub-bg-img").eq(0).css({"width": _scrubbar.children(".scrub-bg").width()});
                        _scrubbar.find(".scrub-prog-img").eq(0).css({"width": _scrubbar.children(".scrub-bg").width()});
                        if (o.skinwave_enableReflect ==
                            "on") {
                            _scrubbar.children(".scrub-bg-reflect").eq(0).append('<img class="scrub-bg-img-reflect" src="' + cthis.attr("data-scrubbg") + '"/>');
                            if (cthis.attr("data-scrubprog") != undefined)_scrubbar.children(".scrub-prog-reflect").eq(0).append('<img class="scrub-prog-img-reflect" src="' + cthis.attr("data-scrubprog") + '"/>');
                            _scrubbar.find(".scrub-bg-img").eq(0).css({"transform-origin": "100% 100%"});
                            _scrubbar.find(".scrub-prog-img").eq(0).css({"transform-origin": "100% 100%"})
                        }
                    } else {
                        _scrubbar.children(".scrub-bg").eq(0).append('<canvas class="scrub-bg-canvas" style="width: 100%; height: 100%;"></canvas><div class="wave-separator"></div>');
                        _scrubBgCanvas = cthis.find(".scrub-bg-canvas").eq(0);
                        _scrubBgCanvasCtx = _scrubBgCanvas.get(0).getContext("2d");
                        if (type == "audio") {
                            _scrubbar.children(".scrub-prog").eq(0).append('<canvas class="scrub-prog-canvas" style="width: 100%; height: 100%;"></canvas>');
                            _scrubProgCanvas = cthis.find(".scrub-prog-canvas").eq(0);
                            _scrubProgCanvasCtx = _scrubProgCanvas.get(0).getContext("2d")
                        }
                        if (o.skinwave_enableReflect == "on") {
                            _scrubbar.children(".scrub-bg-reflect").eq(0).append('<canvas class="scrub-bg-canvas-reflect" style="width: 100%; height: 100%;"></canvas>');
                            _scrubBgReflectCanvas = _scrubbar.find(".scrub-bg-canvas-reflect").eq(0);
                            _scrubBgReflectCtx = _scrubBgReflectCanvas.get(0).getContext("2d");
                            if (type == "audio") {
                                _scrubbar.children(".scrub-prog-reflect").eq(0).append('<canvas class="scrub-prog-canvas-reflect" style="width: 100%; height: 100%;"></canvas>');
                                _scrubProgCanvasReflect = _scrubbar.find(".scrub-prog-canvas-reflect").eq(0);
                                _scrubProgCanvasReflectCtx = _scrubProgCanvasReflect.get(0).getContext("2d")
                            }
                        }
                    }
                    if (o.skinwave_timer_static == "on") {
                        if (_currTime)_currTime.addClass("static");
                        if (_totalTime)_totalTime.addClass("static")
                    }
                    _apControls.css({"height": o.design_thumbh})
                }
                if (cthis.hasClass("skin-minimal")) {
                    _conPlayPause.children(".playbtn").append('<canvas width="100" height="100" class="playbtn-canvas"/>');
                    skin_minimal_canvasplay = _conPlayPause.find(".playbtn-canvas").eq(0).get(0);
                    _conPlayPause.children(".pausebtn").append('<canvas width="100" height="100" class="pausebtn-canvas"/>');
                    skin_minimal_canvaspause = _conPlayPause.find(".pausebtn-canvas").eq(0).get(0)
                }
                if (typeof o.parentgallery !=
                    "undefined" && o.disable_player_navigation != "on");
                if (cthis.hasClass("skin-minion"))if (cthis.find(".menu-description").length > 0) {
                    _conPlayPause.addClass("with-tooltip");
                    _conPlayPause.prepend('<span class="dzstooltip" style="left:-7px;">' + cthis.find(".menu-description").html() + "</span>");
                    _conPlayPause.children("span").eq(0).css("width", _conPlayPause.children("span").eq(0).textWidth() + 10)
                }
            }

            function ajax_get_likes(argp) {
                var mainarg = argp;
                var data = {action: "dzsap_get_likes", postdata: mainarg, playerid: the_player_id};
                $.ajax({type: "POST", url: o.settings_php_handler, data: data, success: function (response) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + response);
                    var auxls = false;
                    if (response.indexOf("likesubmitted") > -1) {
                        response = response.replace("likesubmitted", "");
                        auxls = true
                    }
                    if (response == "")response = 0;
                    var auxhtml = cthis.find(".extra-html").eq(0).html();
                    auxhtml = auxhtml.replace("{{get_likes}}", response);
                    cthis.find(".extra-html").eq(0).html(auxhtml);
                    index_extrahtml_toloads--;
                    if (auxls)cthis.find(".extra-html").find(".btn-like").addClass("active");
                    if (index_extrahtml_toloads == 0)cthis.find(".extra-html").addClass("active")
                }, error: function (arg) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + arg, arg);
                    index_extrahtml_toloads--;
                    if (index_extrahtml_toloads == 0)cthis.find(".extra-html").addClass("active")
                }})
            }

            function ajax_get_rates(argp) {
                var mainarg = argp;
                var data = {action: "dzsap_get_rate", postdata: mainarg, playerid: the_player_id};
                $.ajax({type: "POST", url: o.settings_php_handler, data: data, success: function (response) {
                    if (typeof window.console !=
                        "undefined")console.log("Got this from the server: " + response);
                    var auxls = false;
                    if (response.indexOf("likesubmitted") > -1) {
                        response = response.replace("likesubmitted", "");
                        auxls = true
                    }
                    if (response == "")response = "0|0";
                    var auxresponse = response.split("|");
                    starrating_nrrates = auxresponse[1];
                    cthis.find(".extra-html .counter-rates .the-number").eq(0).html(starrating_nrrates);
                    index_extrahtml_toloads--;
                    cthis.find(".star-rating-set-clip").width(auxresponse[0] * (parseInt(cthis.find(".star-rating-bg").width(), 10) / 5));
                    if (typeof auxresponse[2] != "undefined") {
                        starrating_alreadyrated = auxresponse[2];
                        if (o.parentgallery != undefined && ($(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_player_rateSubmitted != undefined))$(o.parentgallery).get(0).api_player_rateSubmitted()
                    }
                    if (index_extrahtml_toloads <= 0)cthis.find(".extra-html").addClass("active")
                }, error: function (arg) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + arg, arg);
                    index_extrahtml_toloads--;
                    if (index_extrahtml_toloads <=
                        0)cthis.find(".extra-html").addClass("active")
                }})
            }

            function ajax_get_views(argp) {
                var mainarg = argp;
                var data = {action: "dzsap_get_views", postdata: mainarg, playerid: the_player_id};
                $.ajax({type: "POST", url: o.settings_php_handler, data: data, success: function (response) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + response);
                    if (response.indexOf("viewsubmitted") > -1) {
                        response = response.replace("viewsubmitted", "");
                        ajax_view_submitted = "on"
                    }
                    if (response == "")response = 0;
                    var auxhtml = cthis.find(".extra-html").eq(0).html();
                    auxhtml = auxhtml.replace("{{get_plays}}", response);
                    cthis.find(".extra-html").eq(0).html(auxhtml);
                    index_extrahtml_toloads--;
                    if (index_extrahtml_toloads == 0)cthis.find(".extra-html").addClass("active")
                }, error: function (arg) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + arg, arg);
                    index_extrahtml_toloads--;
                    if (index_extrahtml_toloads == 0)cthis.find(".extra-html").addClass("active")
                }})
            }

            function ajax_submit_rating(argp) {
                var mainarg = argp;
                var data = {action: "dzsap_submit_rate", postdata: mainarg,
                    playerid: the_player_id};
                if (starrating_alreadyrated > -1)return;
                $.ajax({type: "POST", url: o.settings_php_handler, data: data, success: function (response) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + response);
                    var aux = cthis.find(".star-rating-set-clip").outerWidth() / cthis.find(".star-rating-bg").outerWidth();
                    var nrrates = parseInt(cthis.find(".counter-rates .the-number").html(), 10);
                    nrrates++;
                    var aux2 = ((nrrates - 1) * (aux * 5) + starrating_index) / nrrates;
                    cthis.find(".star-rating-set-clip").width(aux2 *
                        (parseInt(cthis.find(".star-rating-bg").width(), 10) / 5));
                    cthis.find(".counter-rates .the-number").html(nrrates);
                    if (o.parentgallery != undefined && ($(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_player_rateSubmitted != undefined))$(o.parentgallery).get(0).api_player_rateSubmitted()
                }, error: function (arg) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + arg, arg);
                    var aux = cthis.find(".star-rating-set-clip").outerWidth() / cthis.find(".star-rating-bg").outerWidth();
                    var nrrates = parseInt(cthis.find(".counter-rates .the-number").html(), 10);
                    nrrates++;
                    var aux2 = ((nrrates - 1) * (aux * 5) + starrating_index) / nrrates;
                    cthis.find(".star-rating-set-clip").width(aux2 * (parseInt(cthis.find(".star-rating-bg").width(), 10) / 5));
                    cthis.find(".counter-rates .the-number").html(nrrates);
                    if (o.parentgallery != undefined && ($(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_player_rateSubmitted != undefined))$(o.parentgallery).get(0).api_player_rateSubmitted()
                }})
            }

            function ajax_submit_like(argp) {
                var mainarg =
                    argp;
                var data = {action: "dzsap_submit_like", postdata: mainarg, playerid: the_player_id};
                $.ajax({type: "POST", url: o.settings_php_handler, data: data, success: function (response) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + response);
                    cthis.find(".btn-like").addClass("active");
                    var auxlikes = cthis.find(".counter-likes .the-number").html();
                    auxlikes = parseInt(auxlikes, 10);
                    auxlikes++;
                    cthis.find(".counter-likes .the-number").html(auxlikes)
                }, error: function (arg) {
                    if (typeof window.console !=
                        "undefined")console.log("Got this from the server: " + arg, arg);
                    cthis.find(".btn-like").addClass("active");
                    var auxlikes = cthis.find(".counter-likes .the-number").html();
                    auxlikes = parseInt(auxlikes, 10);
                    auxlikes++;
                    cthis.find(".counter-likes .the-number").html(auxlikes)
                }})
            }

            function ajax_retract_like(argp) {
                var mainarg = argp;
                var data = {action: "dzsap_retract_like", postdata: mainarg, playerid: the_player_id};
                $.ajax({type: "POST", url: o.settings_php_handler, data: data, success: function (response) {
                    if (typeof window.console !=
                        "undefined")console.log("Got this from the server: " + response);
                    cthis.find(".btn-like").removeClass("active");
                    var auxlikes = cthis.find(".counter-likes .the-number").html();
                    auxlikes = parseInt(auxlikes, 10);
                    auxlikes--;
                    cthis.find(".counter-likes .the-number").html(auxlikes)
                }, error: function (arg) {
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + arg, arg);
                    cthis.find(".btn-like").removeClass("active");
                    var auxlikes = cthis.find(".counter-likes .the-number").html();
                    auxlikes = parseInt(auxlikes,
                        10);
                    auxlikes--;
                    cthis.find(".counter-likes .the-number").html(auxlikes)
                }})
            }

            function skinwave_comment_publish(argp) {
                var mainarg = argp;
                var data = {action: "dzsap_front_submitcomment", postdata: mainarg, playerid: the_player_id};
                $.ajax({type: "POST", url: o.settings_php_handler, data: data, success: function (response) {
                    if (response.charAt(response.length - 1) == "0")response = response.slice(0, response.length - 1);
                    if (typeof window.console != "undefined")console.log("Got this from the server: " + response);
                    _commentsHolder.append(data.postdata)
                },
                    error: function (arg) {
                        if (typeof window.console != "undefined")console.log("Got this from the server: " + arg, arg);
                        _commentsHolder.append(data.postdata)
                    }})
            }

            function setup_media() {
                if (loaded == true)return;
                if (type == "youtube") {
                    if (is_ie())_theMedia.css({"left": "-478em"});
                    return
                }
                var aux = "";
                aux += "<audio>";
                if (cthis.attr("data-source") != undefined) {
                    aux += '<source src="' + cthis.attr("data-source") + '" type="audio/mpeg">';
                    if (cthis.attr("data-sourceogg") != undefined)aux += '<source src="' + cthis.attr("data-sourceogg") + '" type="audio/ogg">'
                }
                aux +=
                    "</audio>";
                if (is_ie8() && dzsap_list.length > 0)str_ie8 = "&isie8=on";
                if (is_flashplayer)if (o.settings_backup_type == "light") {
                    aux = '<object type="application/x-shockwave-flash" data="' + o.swf_location + '" width="100" height="50" id="flashcontent_' + cthisId + '" allowscriptaccess="always" style="visibility: visible; "><param name="movie" value="ap.swf"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque"><param name="flashvars" value="media=' +
                        cthis.attr("data-source") + "&fvid=" + cthisId + str_ie8 + '"><embed src="' + o.swf_location + '" width="100" height="100" allowScriptAccess="always"></object>';
                    cthis.addClass("lightflashbackup")
                } else {
                    var str_vol = "";
                    var str_skip_buttons = "";
                    var str_design_menu_show_player_state_button = "";
                    if (typeof o.parentgallery != "undefined" && o.disable_player_navigation != "on")str_skip_buttons = "&design_skip_buttons=on";
                    if (typeof o.parentgallery != "undefined" && o.design_menu_show_player_state_button != "on")str_design_menu_show_player_state_button =
                        "&design_menu_show_player_state_button=on";
                    if (o.disable_volume == "on")str_vol += "&settings_enablevolume=off";
                    aux = '<object class="the-full-flash-backup" type="application/x-shockwave-flash" data="' + o.swffull_location + '" width="100%" height="100%" style="height:50px" id="flashcontent_' + cthisId + '" allowscriptaccess="always" style="visibility: visible; "><param name="movie" value="' + o.swffull_location + '"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="transparent"><param name="flashvars" value="media=' +
                        cthis.attr("data-source") + "&fvid=" + cthisId + str_ie8 + str_vol + "&autoplay=" + o.autoplay + "&skinwave_mode" + o.skinwave_mode + str_skip_buttons + str_design_menu_show_player_state_button;
                    cthis.addClass("fullflashbackup");
                    if (typeof cthis.attr("data-scrubbg") != "undefined")aux += "&scrubbg=" + cthis.attr("data-scrubbg");
                    if (typeof cthis.attr("data-scrubprog") != "undefined")aux += "&scrubprog=" + cthis.attr("data-scrubprog");
                    if (typeof cthis.attr("data-thumb") != "undefined" && cthis.attr("data-thumb") != "")aux += "&thumb=" + cthis.attr("data-thumb");
                    aux += "&settings_enablespectrum=" + o.skinwave_enableSpectrum;
                    aux += "&skinwave_enablereflect=" + o.skinwave_enableReflect;
                    aux += "&skin=" + o.design_skin;
                    aux += "&settings_multiplier=" + o.skinwave_spectrummultiplier;
                    aux += '">You need Flash Player.</object>';
                    _audioplayerInner.find(".the-thumb-con,.ap-controls,.the-media").remove();
                    _audioplayerInner.prepend(aux);
                    if (o.design_skin == "skin-wave")_audioplayerInner.find(".the-full-flash-backup").css("height", 200);
                    if (typeof cthis.attr("data-thumb") != "undefined" && cthis.attr("data-thumb") !=
                        "")_audioplayerInner.find(".the-full-flash-backup").css("height", 200);
                    aux = ""
                }
                _theMedia.append(aux);
                _cmedia = _theMedia.children("audio").get(0);
                if (is_flashplayer && o.settings_backup_type == "light")setTimeout(function () {
                    _cmedia = _theMedia.find("object").eq(0).get(0)
                }, 500);
                if (is_ios() || (is_ie8() || is_flashplayer == true))if (o.settings_backup_type == "full")init_loaded(); else setTimeout(init_loaded, 1500); else inter_checkReady = setInterval(check_ready, 50)
            }

            function setup_listeners() {
                _scrubbar.bind("mousemove", mouse_scrubbar);
                _scrubbar.bind("mouseleave", mouse_scrubbar);
                _scrubbar.bind("click", mouse_scrubbar);
                _controlsVolume.children(".volumeicon").bind("click", click_mute);
                _controlsVolume.children(".volume_active").bind("click", mouse_volumebar);
                _controlsVolume.children(".volume_static").bind("click", mouse_volumebar);
                _conControls.find(".con-playpause").eq(0).bind("click", click_playpause);
                $(document).delegate(".btn-like", "click", click_like);
                $(document).delegate(".star-rating-con", "mousemove", mouse_starrating);
                $(document).delegate(".star-rating-con",
                    "mouseleave", mouse_starrating);
                $(document).delegate(".star-rating-con", "click", mouse_starrating);
                $(window).bind("resize", handleResize);
                handleResize();
                cthis.get(0).fn_pause_media = pause_media;
                cthis.get(0).fn_play_media = play_media;
                return false
            }

            function click_like() {
                var _t = $(this);
                if (cthis.has(_t).length == 0)return;
                if (_t.hasClass("active"))ajax_retract_like(); else ajax_submit_like()
            }

            function init_loaded() {
                if (cthis.hasClass("loaded"))return;
                if (is_flashplayer == false)totalDuration = _cmedia.duration; else if (o.settings_backup_type ==
                    "light")if (typeof _cmedia != "undefined" && _cmedia.fn_getSoundDuration)eval("totalDuration = parseFloat(_cmedia.fn_getsoundduration" + cthisId + "())");
                if (typeof _cmedia != "undefined")if (_cmedia.nodeName == "AUDIO")_cmedia.addEventListener("ended", handle_end);
                clearTimeout(inter_checkReady);
                setup_listeners();
                if (is_ie8())cthis.addClass("lte-ie8");
                if (is_ie8())if (!Array.prototype.indexOf)Array.prototype.indexOf = function (elt) {
                    var len = this.length >>> 0;
                    var from = Number(arguments[1]) || 0;
                    from = from < 0 ? Math.ceil(from) : Math.floor(from);
                    if (from < 0)from += len;
                    for (; from < len; from++)if (from in this && this[from] === elt)return from;
                    return-1
                };
                if (dzsap_list.indexOf(cthis) == -1)dzsap_list.push(cthis);
                if (o.design_skin == "skin-wave")if (o.skinwave_enableSpectrum == "on") {
                    if (typeof AudioContext !== "undefined")audioCtx = new AudioContext; else if (typeof webkitAudioContext !== "undefined")audioCtx = new webkitAudioContext; else audioCtx = null;
                    if (audioCtx) {
                        if (typeof audioCtx.createJavaScriptNode != "undefined")javascriptNode = audioCtx.createJavaScriptNode(2048, 1, 1);
                        if (typeof audioCtx.createScriptProcessor != "undefined")javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
                        if (typeof audioCtx.createScriptProcessor != "undefined" || typeof audioCtx.createScriptProcessor != "undefined") {
                            javascriptNode.connect(audioCtx.destination);
                            analyser = audioCtx.createAnalyser();
                            analyser.smoothingTimeConstant = 0.3;
                            analyser.fftSize = 512;
                            var url = data_source;
                            if (is_safari() || is_ios()) {
                                loadSound(url);
                                audioBuffer = "placeholder";
                                _conControls.css({"opacity": 0.5})
                            }
                            function loadSound(url) {
                                var request =
                                    new XMLHttpRequest;
                                request.open("GET", url, true);
                                request.responseType = "arraybuffer";
                                request.onload = function () {
                                    audioCtx.decodeAudioData(request.response, function (buffer) {
                                        webaudiosource = audioCtx.createBufferSource();
                                        webaudiosource.buffer = buffer;
                                        audioBuffer = buffer;
                                        webaudiosource.connect(analyser);
                                        analyser.connect(audioCtx.destination);
                                        webaudiosource.connect(audioCtx.destination)
                                    }, onError);
                                    _conControls.css({"opacity": 1})
                                };
                                request.send()
                            }

                            if (is_chrome() || is_firefox()) {
                                webaudiosource = audioCtx.createMediaElementSource(_cmedia);
                                webaudiosource.connect(analyser);
                                analyser.connect(audioCtx.destination)
                            }
                            var stopaudioprocessfordebug = false;
                            setTimeout(function () {
                            }, 3E3);
                            javascriptNode.onaudioprocess = function () {
                                if (stopaudioprocessfordebug)return;
                                var array = new Uint8Array(analyser.frequencyBinCount);
                                analyser.getByteFrequencyData(array);
                                lastarray = array
                            }
                        }
                    }
                }
                if (o.settings_extrahtml != "") {
                    if (String(o.settings_extrahtml).indexOf("{{get_likes}}") > -1) {
                        index_extrahtml_toloads++;
                        ajax_get_likes()
                    }
                    if (String(o.settings_extrahtml).indexOf("{{get_plays}}") > -1) {
                        index_extrahtml_toloads++;
                        ajax_get_views()
                    }
                    if (String(o.settings_extrahtml).indexOf("{{get_rates}}") > -1) {
                        index_extrahtml_toloads++;
                        ajax_get_rates()
                    }
                    if (index_extrahtml_toloads == 0)cthis.find(".extra-html").addClass("active")
                }
                if (ajax_view_submitted == "auto")setTimeout(function () {
                    if (ajax_view_submitted == "auto")ajax_view_submitted = "off"
                }, 1E3);
                loaded = true;
                cthis.addClass("loaded");
                if (isInt(playfrom))seek_to(playfrom);
                if (playfrom == "last")if (typeof Storage != "undefined") {
                    setTimeout(function () {
                        playfrom_ready =
                            true
                    });
                    if (typeof localStorage["dzsap_" + the_player_id + "_lastpos"] != "undefined")seek_to(localStorage["dzsap_" + the_player_id + "_lastpos"])
                }
                if (is_ie8() == false && o.autoplay == "on")play_media()
            }

            function isInt(n) {
                return typeof n == "number" && Math.round(n) % 1 == 0
            }

            function isValid(n) {
                return typeof n != "undefined" && n != ""
            }

            function mouse_starrating(e) {
                var _t = $(this);
                if (cthis.has(_t).length == 0)return;
                if (e.type == "mouseout" || e.type == "mouseleave") {
                    cthis.find(".star-rating-prog-clip").css({"width": 0});
                    cthis.find(".star-rating-set-clip").css({"opacity": 1})
                }
                if (e.type ==
                    "mousemove") {
                    var mx = e.pageX - _t.offset().left;
                    var my = e.pageX - _t.offset().left;
                    if (starrating_alreadyrated > -1)starrating_index = starrating_alreadyrated; else starrating_index = mx / (_t.outerWidth() / 5);
                    if (starrating_index > 4)starrating_index = 5; else starrating_index = Math.round(starrating_index);
                    cthis.find(".star-rating-prog-clip").css({"width": _t.outerWidth() / 5 * starrating_index});
                    cthis.find(".star-rating-set-clip").css({"opacity": 0})
                }
                if (e.type == "click") {
                    if (starrating_alreadyrated > -1)return;
                    ajax_submit_rating(starrating_index)
                }
            }

            function onError() {
            }

            function drawSpectrum(array) {
                _scrubBgCanvas.get(0).width = _scrubBgCanvas.width();
                _scrubBgCanvas.get(0).height = _scrubBgCanvas.height();
                if (_scrubProgCanvas) {
                    _scrubProgCanvas.get(0).width = _scrubBgCanvas.width();
                    _scrubProgCanvas.get(0).height = _scrubBgCanvas.height()
                }
                if (o.skinwave_enableReflect == "on") {
                    _scrubBgReflectCanvas.get(0).width = _scrubBgCanvas.width();
                    _scrubBgReflectCanvas.get(0).height = _scrubBgCanvas.height();
                    if (_scrubProgCanvasReflect) {
                        _scrubProgCanvasReflect.get(0).width = _scrubBgCanvas.width();
                        _scrubProgCanvasReflect.get(0).height = _scrubBgCanvas.height()
                    }
                }
                var gradient = _scrubBgCanvasCtx.createLinearGradient(0, 0, canw, canh);
                _scrubBgCanvasCtx.clearRect(0, 0, canw, canh);
                _scrubBgCanvasCtx.fillStyle = "#" + o.skinwave_spectrum_wavesbg;
                if (_scrubProgCanvasCtx) {
                    _scrubProgCanvasCtx.clearRect(0, 0, canw, canh);
                    _scrubProgCanvasCtx.fillStyle = "#" + o.skinwave_spectrum_wavesprog
                }
                for (var i = 0; i < array.length; i++) {
                    var value = array[i];
                    _scrubBgCanvasCtx.fillRect(i / 256 * canw, canh - value / 256 * canh, canw / array.length, canh);
                    if (_scrubProgCanvasCtx)_scrubProgCanvasCtx.fillRect(i /
                        256 * canw, canh - value / 256 * canh, canw / array.length, canh)
                }
                if (o.skinwave_enableReflect == "on") {
                    _scrubBgReflectCtx.clearRect(0, 0, canw, canh);
                    _scrubBgReflectCtx.drawImage(_scrubBgCanvas.get(0), 0, 0);
                    if (_scrubProgCanvasReflect) {
                        _scrubProgCanvasReflectCtx.clearRect(0, 0, canw, canh);
                        _scrubProgCanvasReflectCtx.drawImage(_scrubProgCanvas.get(0), 0, 0)
                    }
                }
            }

            function onError(e) {
                console.log(e)
            }

            function click_prev_btn() {
                if (typeof o.parentgallery.get(0) != "undefined")o.parentgallery.get(0).api_goto_prev()
            }

            function click_next_btn() {
                if (typeof o.parentgallery.get(0) !=
                    "undefined")o.parentgallery.get(0).api_goto_next()
            }

            function check_time() {
                if (type == "youtube") {
                    time_total = _cmedia.getDuration();
                    time_curr = _cmedia.getCurrentTime();
                    if (playfrom == "last" && playfrom_ready)if (typeof Storage != "undefined")localStorage["dzsap_" + the_player_id + "_lastpos"] = time_curr
                }
                if (type == "audio")if (is_flashplayer == true) {
                    if (o.settings_backup_type == "light")if (str_ie8 == "" && typeof _cmedia != "undefined") {
                        eval("if(typeof _cmedia.fn_getsoundduration" + cthisId + " != 'undefined'){time_total = parseFloat(_cmedia.fn_getsoundduration" +
                            cthisId + "())};");
                        eval("if(typeof _cmedia.fn_getsoundcurrtime" + cthisId + " != 'undefined'){time_curr = parseFloat(_cmedia.fn_getsoundcurrtime" + cthisId + "())};")
                    }
                } else if (o.type != "shoutcast") {
                    time_total = _cmedia.duration;
                    time_curr = _cmedia.currentTime;
                    if (audioBuffer && audioBuffer != "placeholder") {
                        time_total = audioBuffer.duration;
                        time_curr = audioCtx.currentTime
                    }
                    if (playfrom == "last" && playfrom_ready)if (typeof Storage != "undefined")localStorage["dzsap_" + the_player_id + "_lastpos"] = time_curr;
                    if (o.design_skin == "skin-wave")if (o.skinwave_comments_displayontime ==
                        "on") {
                        var timer_curr_perc = Math.round(time_curr / time_total * 100) / 100;
                        if (_commentsHolder)_commentsHolder.children().each(function () {
                            var _t = $(this);
                            if (_t.hasClass("a-comment")) {
                                var aux = Math.round(parseFloat(_t.css("left")) / _commentsHolder.outerWidth() * 100) / 100;
                                if (aux)if (Math.abs(aux - timer_curr_perc) < 0.02) {
                                    _commentsHolder.find(".dzstooltip").removeClass("active");
                                    _t.find(".dzstooltip").addClass("active")
                                } else _t.find(".dzstooltip").removeClass("active")
                            }
                        })
                    }
                }
                spos = time_curr / time_total * sw;
                if (isNaN(spos))spos =
                    0;
                if (spos > sw)spos = sw;
                if (audioBuffer == null) {
                    _scrubbar.children(".scrub-prog").css({"width": spos});
                    if (o.skinwave_enableReflect == "on")_scrubbar.children(".scrub-prog-reflect").css({"width": spos})
                }
                if (cthis.hasClass("skin-minimal"))if (is_ie8() || (!can_canvas() || is_opera()))_conPlayPause.addClass("canvas-fallback"); else {
                    var ctx = skin_minimal_canvasplay.getContext("2d");
                    var ctx_w = $(skin_minimal_canvasplay).width();
                    var ctx_h = $(skin_minimal_canvasplay).height();
                    var pw = ctx_w / 100;
                    var ph = ctx_h / 100;
                    spos = Math.PI *
                        2 * (time_curr / time_total);
                    if (isNaN(spos))spos = 0;
                    if (spos > Math.PI * 2)spos = Math.PI * 2;
                    ctx.clearRect(0, 0, ctx_w, ctx_h);
                    var gradient = gradient = ctx.createLinearGradient(0, 0, 0, ctx_h);
                    gradient.addColorStop("0", "#ea8c52");
                    gradient.addColorStop("1.0", "#cb7641");
                    ctx.beginPath();
                    ctx.arc(50 * pw, 50 * ph, 40 * pw, 0, Math.PI * 2, false);
                    ctx.fillStyle = "rgba(0,0,0,0.1)";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(50 * pw, 50 * ph, 30 * pw, 0, Math.PI * 2, false);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(50 * pw, 50 * ph, 34 * pw, 0, spos, false);
                    ctx.lineWidth = 10 * pw;
                    ctx.strokeStyle = "rgba(0,0,0,0.3)";
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.strokeStyle = "red";
                    ctx.moveTo(44 * pw, 40 * pw);
                    ctx.lineTo(57 * pw, 50 * pw);
                    ctx.lineTo(44 * pw, 60 * pw);
                    ctx.lineTo(44 * pw, 40 * pw);
                    ctx.fillStyle = "#ddd";
                    ctx.fill();
                    ctx = skin_minimal_canvaspause.getContext("2d");
                    ctx_w = $(skin_minimal_canvaspause).width();
                    ctx_h = $(skin_minimal_canvaspause).height();
                    pw = ctx_w / 100;
                    ph = ctx_h / 100;
                    ctx.clearRect(0, 0, ctx_w, ctx_h);
                    ctx.beginPath();
                    ctx.arc(50 * pw, 50 * ph, 40 * pw, 0, Math.PI * 2, false);
                    ctx.fillStyle = "rgba(0,0,0,0.1)";
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(50 * pw, 50 * ph, 30 * pw, 0, Math.PI * 2, false);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(50 * pw, 50 * ph, 34 * pw, 0, spos, false);
                    ctx.lineWidth = 10 * pw;
                    ctx.strokeStyle = "rgba(0,0,0,0.35)";
                    ctx.stroke();
                    ctx.fillStyle = "#ddd";
                    ctx.fillRect(43 * pw, 40 * pw, 6 * pw, 20 * pw);
                    ctx.fillRect(53 * pw, 40 * pw, 6 * pw, 20 * pw)
                }
                if (o.design_skin == "skin-wave") {
                    if (o.skinwave_enableSpectrum == "on")if (lastarray)drawSpectrum(lastarray);
                    if (_currTime)if (o.skinwave_timer_static != "on") {
                        _currTime.css({"left": spos});
                        if (spos > sw - _currTime.outerWidth())_currTime.css({"left": sw - _currTime.outerWidth()});
                        if (spos > sw - 30)_totalTime.css({"opacity": 1 - (spos - (sw - 30)) / 30}); else if (_totalTime.css("opacity") != "1")_totalTime.css({"opacity": 1})
                    }
                }
                if (_currTime) {
                    _currTime.html(formatTime(time_curr));
                    _totalTime.html(formatTime(time_total))
                }
                if (time_total > 0 && time_curr >= time_total - 0.07)handle_end();
                if (is_flashplayer == true || type == "youtube")inter_check = setTimeout(check_time, 500); else requestAnimFrame(check_time)
            }

            function click_playpause(e) {
                var _t =
                    $(this);
                if (o.design_skin == "skin-minimal") {
                    var center_x = _t.offset().left + 50;
                    var center_y = _t.offset().top + 50;
                    var mouse_x = e.pageX;
                    var mouse_y = e.pageY;
                    var pzero_x = center_x + 50;
                    var pzero_y = center_y;
                    var AB = Math.sqrt(Math.pow(mouse_x - center_x, 2) + Math.pow(mouse_y - center_y, 2));
                    var AC = Math.sqrt(Math.pow(pzero_x - center_x, 2) + Math.pow(pzero_y - center_y, 2));
                    var BC = Math.sqrt(Math.pow(pzero_x - mouse_x, 2) + Math.pow(pzero_y - mouse_y, 2));
                    var angle = Math.acos((AB + AC + BC) / (2 * AC * AB));
                    var angle2 = Math.acos((mouse_x - center_x) / 50);
                    var perc = -(mouse_x - center_x - 50) * 0.005;
                    if (mouse_y < center_y)perc = 0.5 + (0.5 - perc);
                    if (!(is_flashplayer == true && is_firefox()) && AB > 20) {
                        seek_to_perc(perc);
                        return
                    }
                }
                if (playing == false)play_media(); else pause_media()
            }

            function handle_end() {
                seek_to(0);
                pause_media();
                if (typeof o.parentgallery != "undefined")o.parentgallery.get(0).api_handle_end()
            }

            function handleResize() {
                ww = $(window).width();
                tw = cthis.width();
                th = cthis.height();
                if (_scrubBgCanvas) {
                    canw = _scrubBgCanvas.width();
                    canh = _scrubBgCanvas.height()
                }
                if (o.design_skin ==
                    "skin-default")sw = tw;
                if (o.design_skin == "skin-justthumbandbutton") {
                    tw = cthis.children(".audioplayer-inner").outerWidth();
                    sw = tw
                }
                if (o.design_skin == "skin-wave") {
                    sw = _scrubbar.outerWidth(false);
                    if (_commentsHolder) {
                        _commentsHolder.css({"width": sw, "left": _scrubbar.offset().left - cthis.offset().left});
                        _commentsHolder.addClass("active");
                        _commentsHolder.find(".a-comment").each(function () {
                            var _t = $(this);
                            if (_t.offset().left + _t.find(".dzstooltip").eq(0).width() > ww - 50)_t.find(".dzstooltip").eq(0).addClass("align-right");
                            else _t.find(".dzstooltip").eq(0).removeClass("align-right")
                        })
                    }
                    if (cthis.hasClass("fullflashbackup"))if (_commentsHolder) {
                        _commentsHolder.css({"width": tw - 212, "left": 212});
                        if (tw <= 480)_commentsHolder.css({"width": tw - 112, "left": 112});
                        _commentsHolder.addClass("active")
                    }
                }
                check_time();
                if (res_thumbh == true) {
                    if (o.design_skin == "skin-default") {
                        if (cthis.get(0) != undefined)if (cthis.get(0).style.height == "auto")cthis.height(200);
                        o.design_thumbh = cthis.height() - 44
                    }
                    _audioplayerInner.find(".the-thumb").eq(0).css({"height": o.design_thumbh})
                }
                if (cthis.css("display") !=
                    "none") {
                    _scrubbar.find(".scrub-bg-img").eq(0).css({"width": _scrubbar.children(".scrub-bg").width()});
                    _scrubbar.find(".scrub-prog-img").eq(0).css({"width": _scrubbar.children(".scrub-bg").width()});
                    _scrubbar.find(".scrub-prog-canvas").eq(0).css({"width": _scrubbar.children(".scrub-bg").width()});
                    _scrubbar.find(".scrub-prog-img-reflect").eq(0).css({"width": _scrubbar.children(".scrub-bg").width()});
                    _scrubbar.find(".scrub-prog-canvas-reflect").eq(0).css({"width": _scrubbar.children(".scrub-bg").width()})
                }
                cthis.removeClass("under-240 under-480");
                if (tw <= 240)cthis.addClass("under-240");
                if (tw <= 480) {
                    cthis.addClass("under-480");
                    if (_controlsVolume)if (o.disable_volume == "on")_controlsVolume.hide(); else _controlsVolume.hide()
                } else if (o.disable_volume == "on")_controlsVolume.hide(); else _controlsVolume.show();
                var aux2 = 50;
                if (o.design_skin == "skin-wave") {
                    controls_left_pos = cthis.find(".the-thumb").width() + 80;
                    var sh = _scrubbar.eq(0).height();
                    if (is_flashplayer && o.settings_backup_type == "full") {
                        sh = 140;
                        controls_left_pos = 280;
                        if (tw <= 480)controls_left_pos = 180
                    }
                    if (o.skinwave_mode ==
                        "small") {
                        controls_left_pos -= 80;
                        sh = 5;
                        controls_left_pos += 10;
                        _conPlayPause.css({"left": controls_left_pos});
                        controls_left_pos += _conPlayPause.outerWidth()
                    }
                    if (o.skinwave_mode == "small" && (is_flashplayer && o.settings_backup_type == "full")) {
                        controls_left_pos = 140;
                        cthis.find(".meta-artist-con").hide()
                    }
                    if (typeof o.parentgallery != "undefined" && o.disable_player_navigation != "on")if (cthis.find(".prev-btn").eq(0).css("display") != "none") {
                        cthis.find(".prev-btn").eq(0).css({"top": sh + 20, "left": controls_left_pos});
                        controls_left_pos +=
                            30;
                        cthis.find(".next-btn").eq(0).css({"top": sh + 20, "left": controls_left_pos});
                        controls_left_pos += 40
                    }
                    _metaArtistCon.css({"left": controls_left_pos});
                    if (_metaArtistCon.css("display") != "none")controls_left_pos += _metaArtistCon.outerWidth();
                    controls_right_pos = 0;
                    if (_controlsVolume && _controlsVolume.css("display") != "none")controls_right_pos += 55;
                    cthis.find(".btn-menu-state").eq(0).css({"right": controls_right_pos});
                    if (cthis.find(".btn-menu-state").eq(0).css("display") != "none")controls_right_pos += cthis.find(".btn-menu-state").eq(0).outerWidth();
                    if (o.skinwave_mode == "small") {
                        controls_left_pos += 10;
                        _scrubbar.css({"left": controls_left_pos});
                        cthis.find(".btn-menu-state").eq(0).css({"bottom": "auto", "top": 25});
                        sw = tw - controls_left_pos - controls_right_pos;
                        controls_right_pos += 10;
                        _scrubbar.css({"width": sw});
                        _scrubbar.find(".scrub-bg-img").eq(0).css({"width": sw});
                        _scrubbar.find(".scrub-prog-img").eq(0).css({"width": sw});
                        cthis.find(".comments-holder").eq(0).css({"width": sw, "left": controls_left_pos})
                    }
                }
                if (o.design_skin == "skin-default")if (_currTime) {
                    _metaArtistCon_l =
                        parseInt(_metaArtistCon.css("left"), 10);
                    _metaArtistCon_w = _metaArtistCon.outerWidth();
                    if (_metaArtistCon.css("display") == "none")_metaArtistCon_w = 0;
                    if (isNaN(_metaArtistCon_l))_metaArtistCon_l = 20;
                    _currTime.css({"left": _metaArtistCon_l + _metaArtistCon_w + 10});
                    _totalTime.css({"left": _metaArtistCon_l + _metaArtistCon_w + 55})
                }
                if (o.design_skin == "skin-minion") {
                    aux2 = parseInt(_conControls.find(".con-playpause").eq(0).offset().left, 10) - parseInt(_conControls.eq(0).offset().left, 10) - 18;
                    _conControls.find(".prev-btn").eq(0).css({"top": 0,
                        "left": aux2});
                    aux2 += 36;
                    _conControls.find(".next-btn").eq(0).css({"top": 0, "left": aux2})
                }
            }

            function mouse_volumebar(e) {
                var _t = jQuery(this);
                if (e.type == "mousemove");
                if (e.type == "mouseleave");
                if (e.type == "click") {
                    aux = (e.pageX - _controlsVolume.children(".volume_static").offset().left) / _controlsVolume.children(".volume_static").width();
                    set_volume(aux);
                    muted = false
                }
            }

            function mouse_scrubbar(e) {
                var mousex = e.pageX;
                if (e.type == "mousemove")_scrubbar.children(".scrubBox-hover").css({"left": mousex - _scrubbar.offset().left});
                if (e.type == "mouseleave");
                if (e.type == "click") {
                    if (audioBuffer)time_total = audioBuffer.duration;
                    var aux = (e.pageX - _scrubbar.offset().left) / sw * time_total;
                    if (is_flashplayer == true)aux = (e.pageX - _scrubbar.offset().left) / sw;
                    seek_to(aux);
                    if (playing == false)play_media()
                }
            }

            function seek_to_perc(argperc) {
                seek_to(argperc * time_total)
            }

            function seek_to(arg) {
                if (type == "youtube")_cmedia.seekTo(arg);
                if (type == "audio")if (audioBuffer != null) {
                    lasttime_inseconds = arg;
                    audioCtx.currentTime = lasttime_inseconds;
                    pause_media({"audioapi_setlasttime": false});
                    play_media()
                } else if (is_flashplayer == true) {
                    if (o.settings_backup_type == "light")if (str_ie8 == "")eval("_cmedia.fn_seek_to" + cthisId + "(" + arg + ")");
                    play_media()
                } else _cmedia.currentTime = arg
            }

            function set_volume(arg) {
                if (type == "youtube")_cmedia.setVolume(arg * 100);
                if (type == "audio")if (is_flashplayer == true) {
                    if (o.settings_backup_type == "light")if (str_ie8 == "")eval("_cmedia.fn_volumeset" + cthisId + "(arg)")
                } else _cmedia.volume = arg;
                _controlsVolume.children(".volume_active").css({"width": _controlsVolume.children(".volume_static").width() *
                    arg});
                if (o.design_skin == "skin-wave" && o.skinwave_dynamicwaves == "on") {
                    _scrubbar.find(".scrub-bg-img").eq(0).css({"transform": "scaleY(" + arg + ")"});
                    _scrubbar.find(".scrub-prog-img").eq(0).css({"transform": "scaleY(" + arg + ")"});
                    if (o.skinwave_enableReflect == "on")if (arg == 0)cthis.find(".scrub-bg-img-reflect").fadeOut("slow"); else cthis.find(".scrub-bg-img-reflect").fadeIn("slow")
                }
                last_vol = arg
            }

            function click_mute() {
                if (muted == false) {
                    last_vol_before_mute = last_vol;
                    set_volume(0);
                    muted = true
                } else {
                    set_volume(last_vol_before_mute);
                    muted = false
                }
            }

            function pause_media(pargs) {
                var margs = {"audioapi_setlasttime": true};
                if (pargs)margs = $.extend(margs, pargs);
                if (o.design_animateplaypause != "on") {
                    _conPlayPause.children(".playbtn").css({"display": "block"});
                    _conPlayPause.children(".pausebtn").css({"display": "none"})
                } else {
                    _conPlayPause.children(".playbtn").stop().fadeIn("fast");
                    _conPlayPause.children(".pausebtn").stop().fadeOut("fast")
                }
                if (type == "youtube")_cmedia.pauseVideo();
                if (type == "audio")if (audioBuffer != null) {
                    if (audioBuffer != "placeholder") {
                        if (margs.audioapi_setlasttime ==
                            true)lasttime_inseconds = audioCtx.currentTime;
                        webaudiosource.stop(0)
                    }
                } else if (is_flashplayer == true && (o.settings_backup_type == "light" && cthis.css("display") != "none")) {
                    if (o.settings_backup_type == "light")eval("_cmedia.fn_pausemedia" + cthisId + "()")
                } else if (_cmedia)if (_cmedia.pause != undefined)_cmedia.pause();
                playing = false;
                cthis.removeClass("is-playing")
            }

            function play_media() {
                for (i = 0; i < dzsap_list.length; i++)if (!is_ie8() && (typeof dzsap_list[i].get(0) != "undefined" && typeof dzsap_list[i].get(0).fn_pause_media !=
                    "undefined"))dzsap_list[i].get(0).fn_pause_media({"audioapi_setlasttime": false});
                if (type == "youtube")_cmedia.playVideo();
                if (type == "audio")if (audioBuffer != null)if (audioBuffer != "placeholder") {
                    webaudiosource = audioCtx.createBufferSource();
                    webaudiosource.buffer = audioBuffer;
                    webaudiosource.connect(audioCtx.destination);
                    webaudiosource.connect(analyser);
                    webaudiosource.start(0, lasttime_inseconds)
                } else return; else if (is_flashplayer == true && cthis.css("display") != "none") {
                    if (o.settings_backup_type == "light")eval("_cmedia.fn_playmedia" +
                        cthisId + "()")
                } else if (_cmedia)if (typeof _cmedia.play != "undefined")_cmedia.play();
                if (o.design_animateplaypause != "on") {
                    _conPlayPause.children(".playbtn").css({"display": "none"});
                    _conPlayPause.children(".pausebtn").css({"display": "block"})
                } else {
                    _conPlayPause.children(".playbtn").stop().fadeOut("fast");
                    _conPlayPause.children(".pausebtn").stop().fadeIn("fast")
                }
                playing = true;
                cthis.addClass("is-playing");
                var data = {action: "dzsap_submit_views", postdata: 1, playerid: the_player_id};
                if (ajax_view_submitted == "off")$.ajax({type: "POST",
                    url: o.settings_php_handler, data: data, success: function (response) {
                        if (typeof window.console != "undefined")console.log("Got this from the server: " + response);
                        cthis.find(".btn-like").addClass("active");
                        var auxlikes = cthis.find(".counter-hits .the-number").html();
                        auxlikes = parseInt(auxlikes, 10);
                        auxlikes++;
                        cthis.find(".counter-hits .the-number").html(auxlikes);
                        ajax_view_submitted = "on"
                    }, error: function (arg) {
                        if (typeof window.console != "undefined")console.log("Got this from the server: " + arg, arg);
                        cthis.find(".btn-like").addClass("active");
                        var auxlikes = cthis.find(".counter-likes .the-number").html();
                        auxlikes = parseInt(auxlikes, 10);
                        auxlikes++;
                        cthis.find(".counter-hits .the-number").html(auxlikes);
                        ajax_view_submitted = "on"
                    }})
            }

            function formatTime(arg) {
                var s = Math.round(arg);
                var m = 0;
                if (s > 0) {
                    while (s > 59) {
                        m++;
                        s -= 60
                    }
                    return String((m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s)
                } else return"00:00"
            }

            return this
        })
    };
    window.dzsap_init = function (selector, settings) {
        $(selector).audioplayer(settings)
    };
    $.fn.audiogallery = function (o) {
        var defaults = {design_skin: "skin-default",
            cueFirstMedia: "on", autoplay: "off", autoplayNext: "on", design_menu_position: "bottom", design_menu_state: "open", design_menu_show_player_state_button: "off", design_menu_width: "default", design_menu_height: "default", design_menu_space: "default", design_menuitem_width: "default", design_menuitem_height: "default", design_menuitem_space: "default", disable_menu_navigation: "off", disable_player_navigation: "off", settings_ap: {}, transition: "direct"};
        o = $.extend(defaults, o);
        this.each(function () {
            var cthis = $(this);
            var cchildren =
                cthis.children(), cthisId = "ag1";
            var currNr = -1, lastCurrNr = 0, tempNr = 0;
            var busy = true;
            var i = 0;
            var ww, wh, tw, th, n_maindim, nc_maindim, sw = 0, sh, spos = 0;
            var _sliderMain, _sliderClipper, _navMain, _navClipper, _cache;
            var busy = false, playing = false, muted = false, loaded = false, first = true;
            var time_total = 0, time_curr = 0;
            var last_vol = 1, last_vol_before_mute = 1;
            var inter_check, inter_checkReady;
            var skin_minimal_canvasplay, skin_minimal_canvaspause;
            var is_flashplayer = false;
            var data_source;
            var aux_error = 20;
            var res_thumbh = false;
            var str_ie8 =
                "";
            var arr_menuitems = [];
            var str_alertBeforeRate = "You need to comment or rate before downloading.";
            if (window.dzsap_settings && typeof window.dzsap_settings.str_alertBeforeRate != "undefined")str_alertBeforeRate = window.dzsap_settings.str_alertBeforeRate;
            init();
            function init() {
                if (o.design_menu_width == "default")o.design_menu_width = "100%";
                if (o.design_menu_height == "default")o.design_menu_height = "200";
                cthis.append('<div class="slider-main"><div class="slider-clipper"></div></div>');
                cthis.addClass("menu-position-" +
                    o.design_menu_position);
                _sliderMain = cthis.find(".slider-main").eq(0);
                var auxlen = cthis.find(".items").children().length;
                if (auxlen == 0 || auxlen == 1) {
                    o.design_menu_position = "none";
                    o.settings_ap.disable_player_navigation = "on"
                }
                if (o.design_menu_position == "top")_sliderMain.before('<div class="nav-main"><div class="nav-clipper"></div></div>');
                if (o.design_menu_position == "bottom")_sliderMain.after('<div class="nav-main"><div class="nav-clipper"></div></div>');
                _sliderClipper = cthis.find(".slider-clipper").eq(0);
                _navMain = cthis.find(".nav-main").eq(0);
                _navClipper = cthis.find(".nav-clipper").eq(0);
                for (i = 0; i < auxlen; i++) {
                    arr_menuitems.push(cthis.find(".items").children().eq(0).find(".menu-description").html());
                    _sliderClipper.append(cthis.find(".items").children().eq(0))
                }
                for (i = 0; i < arr_menuitems.length; i++)_navClipper.append('<div class="menu-item">' + arr_menuitems[i] + "</div>");
                if (o.disable_menu_navigation == "on")_navMain.hide();
                _navMain.css({"height": o.design_menu_height});
                if (is_ios() || is_android())_navMain.css({"overflow": "auto"});
                if (o.design_menu_state == "closed")_navMain.css({"height": 0});
                if (cthis.css("opacity") == 0)cthis.animate({"opacity": 1}, 1E3);
                handleResize();
                goto_item(tempNr);
                calculateDims();
                _navClipper.children().bind("click", click_menuitem);
                cthis.find(".download-after-rate").bind("click", click_downloadAfterRate);
                cthis.get(0).api_goto_next = goto_next;
                cthis.get(0).api_goto_prev = goto_prev;
                cthis.get(0).api_handle_end = handle_end;
                cthis.get(0).api_toggle_menu_state = toggle_menu_state;
                cthis.get(0).api_handleResize = handleResize;
                cthis.get(0).api_player_commentSubmitted = player_commentSubmitted;
                cthis.get(0).api_player_rateSubmitted = player_rateSubmitted
            }

            function click_downloadAfterRate() {
                var _t = $(this);
                if (_t.hasClass("active") == false) {
                    alert(str_alertBeforeRate);
                    return false
                }
            }

            function toggle_menu_state() {
                if (_navMain.height() == 0)_navMain.css({"height": o.design_menu_height}); else _navMain.css({"height": 0})
            }

            function handle_end() {
                goto_next()
            }

            function player_commentSubmitted() {
                _navClipper.children(".menu-item").eq(currNr).find(".download-after-rate").addClass("active")
            }

            function player_rateSubmitted() {
                _navClipper.children(".menu-item").eq(currNr).find(".download-after-rate").addClass("active")
            }

            function calculateDims() {
                _sliderClipper.css("height", _sliderClipper.children().eq(currNr).height());
                n_maindim = _navMain.outerHeight();
                nc_maindim = _navClipper.outerHeight();
                if (nc_maindim > n_maindim)_navMain.bind("mousemove", mousemove_navMain)
            }

            function mousemove_navMain(e) {
                var _t = $(this);
                var mx = e.pageX - _t.offset().left;
                var my = e.pageY - _t.offset().top;
                n_maindim = _navMain.outerHeight();
                var vix = 0;
                var viy = 0;
                viy = my / n_maindim * -(nc_maindim - n_maindim + 10 + aux_error * 2) + aux_error;
                if (viy > 0)viy = 0;
                if (viy < -(nc_maindim - n_maindim + 10))viy = -(nc_maindim - n_maindim + 10);
                _navClipper.css({"transform": "translateY(" + viy + "px)"})
            }

            function click_menuitem(e) {
                var _t = $(this);
                var ind = _t.parent().children().index(_t);
                goto_item(ind)
            }

            function handleResize() {
                setTimeout(function () {
                    _sliderClipper.css("height", _sliderClipper.children().eq(currNr).height())
                }, 500);
                calculateDims()
            }

            function transition_end() {
                _sliderClipper.children().eq(lastCurrNr).hide();
                lastCurrNr = currNr;
                busy = false
            }

            function transition_bg_end() {
                cthis.parent().children(".the-bg").eq(0).remove();
                busy = false
            }

            function goto_prev() {
                tempNr = currNr;
                tempNr--;
                if (tempNr < 0)tempNr = _sliderClipper.children().length - 1;
                goto_item(tempNr)
            }

            function goto_next() {
                tempNr = currNr;
                tempNr++;
                if (tempNr >= _sliderClipper.children().length)tempNr = 0;
                goto_item(tempNr)
            }

            function goto_item(arg) {
                if (busy == true)return;
                if (currNr == arg)return;
                _cache = _sliderClipper.children().eq(arg);
                if (currNr > -1) {
                    if (typeof _sliderClipper.children().eq(currNr).get(0) !=
                        "undefined")if (typeof _sliderClipper.children().eq(currNr).get(0).fn_pause_media != "undefined")_sliderClipper.children().eq(currNr).get(0).fn_pause_media();
                    if (o.transition == "fade") {
                        _sliderClipper.children().eq(currNr).css({"position": "absolute", "left": 0, "top": 0, "opacity": 1});
                        _sliderClipper.children().eq(currNr).animate({"opacity": 0}, {queue: false, complete: transition_end})
                    }
                    if (o.transition == "direct")transition_end()
                }
                if (o.settings_ap.design_skin == "sameasgallery")o.settings_ap.design_skin = o.design_skin;
                if (currNr == -1 && o.autoplay == "on")o.settings_ap.autoplay = "on";
                if (currNr > -1 && o.autoplayNext == "on")o.settings_ap.autoplay = "on";
                o.settings_ap.disable_player_navigation = o.disable_player_navigation;
                o.settings_ap.parentgallery = cthis;
                o.settings_ap.design_menu_show_player_state_button = o.design_menu_show_player_state_button;
                o.settings_ap.cue = "on";
                if (first == true) {
                    if (o.cueFirstMedia == "off")o.settings_ap.cue = "off";
                    first = false
                }
                if (_cache.hasClass("audioplayer-tobe"))_cache.audioplayer(o.settings_ap);
                if (o.transition ==
                    "fade") {
                    _cache.css({"position": "absolute", display: "block", "left": 0, "top": 0, "opacity": 0});
                    _cache.animate({"opacity": 1}, {queue: false})
                }
                if (o.transition == "direct");
                if (currNr > -1 && (_cache.attr("data-bgimage") != undefined && (cthis.parent().hasClass("ap-wrapper") && cthis.parent().children(".the-bg").length > 0))) {
                    cthis.parent().children(".the-bg").eq(0).after('<div class="the-bg" style="background-image: url(' + _cache.attr("data-bgimage") + ');"></div>');
                    cthis.parent().children(".the-bg").eq(0).css({"opacity": 1});
                    cthis.parent().children(".the-bg").eq(1).css({"opacity": 0});
                    cthis.parent().children(".the-bg").eq(1).animate({"opacity": 1}, {queue: false, duration: 1E3, complete: transition_bg_end, step: function () {
                        busy = true
                    }});
                    busy = true
                }
                currNr = arg
            }
        })
    };
    window.dzsag_init = function (selector, settings) {
        $(selector).audiogallery(settings)
    }
})(jQuery);
function is_ios() {
    return navigator.platform.indexOf("iPhone") != -1 || (navigator.platform.indexOf("iPod") != -1 || navigator.platform.indexOf("iPad") != -1)
}
function is_android() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("android") > -1
}
function is_ie() {
    if (navigator.appVersion.indexOf("MSIE") != -1)return true;
    return false
}
function is_firefox() {
    if (navigator.userAgent.indexOf("Firefox") != -1)return true;
    return false
}
function is_opera() {
    if (navigator.userAgent.indexOf("Opera") != -1)return true;
    return false
}
function is_chrome() {
    return navigator.userAgent.toLowerCase().indexOf("chrome") > -1
}
function is_safari() {
    return Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0
}
function version_ie() {
    return parseFloat(navigator.appVersion.split("MSIE")[1])
}
function version_firefox() {
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        var aversion = new Number(RegExp.$1);
        return aversion
    }
}
function version_opera() {
    if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        var aversion = new Number(RegExp.$1);
        return aversion
    }
}
function is_ie8() {
    if (is_ie() && version_ie() < 9)return true;
    return false
}
function is_ie9() {
    if (is_ie() && version_ie() == 9)return true;
    return false
}
function can_playmp3() {
    var a = document.createElement("audio");
    return!!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""))
}
function can_canvas() {
    var oCanvas = document.createElement("canvas");
    if (oCanvas.getContext("2d"))return true;
    return false
}
function onYouTubeIframeAPIReady() {
    for (i = 0; i < dzsap_list.length; i++)if (dzsap_list[i].get(0) != undefined && typeof dzsap_list[i].get(0).fn_yt_ready != "undefined")dzsap_list[i].get(0).fn_yt_ready()
}
jQuery.fn.textWidth = function () {
    var _t = jQuery(this);
    var html_org = _t.html();
    if (_t[0].nodeName == "INPUT")html_org = _t.val();
    var html_calcS = '<span class="forcalc">' + html_org + "</span>";
    jQuery("body").append(html_calcS);
    var _lastspan = jQuery("span.forcalc").last();
    _lastspan.css({"font-size": _t.css("font-size"), "font-family": _t.css("font-family")});
    var width = _lastspan.width();
    _lastspan.remove();
    return width
};
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || (window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || function (callback, element) {
        window.setTimeout(callback, 1E3 / 60)
    }))))
}();
var MD5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
        return lValue << iShiftBits | lValue >>> 32 - iShiftBits
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 2147483648;
        lY8 = lY & 2147483648;
        lX4 = lX & 1073741824;
        lY4 = lY & 1073741824;
        lResult = (lX & 1073741823) + (lY & 1073741823);
        if (lX4 & lY4)return lResult ^ 2147483648 ^ lX8 ^ lY8;
        if (lX4 | lY4)if (lResult & 1073741824)return lResult ^ 3221225472 ^ lX8 ^ lY8; else return lResult ^ 1073741824 ^ lX8 ^ lY8; else return lResult ^ lX8 ^ lY8
    }

    function F(x, y, z) {
        return x & y | ~x & z
    }

    function G(x, y, z) {
        return x & z | y & ~z
    }

    function H(x, y, z) {
        return x ^ y ^ z
    }

    function I(x, y, z) {
        return y ^ (x | ~z)
    }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b)
    }

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b)
    }

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b)
    }

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b,
            c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b)
    }

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] |
                string.charCodeAt(lByteCount) << lBytePosition;
            lByteCount++
        }
        lWordCount = (lByteCount - lByteCount % 4) / 4;
        lBytePosition = lByteCount % 4 * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray
    }

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = lValue >>> lCount * 8 & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue =
                WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2)
        }
        return WordToHexValue
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128)utftext += String.fromCharCode(c); else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode(c >> 6 | 192);
                utftext += String.fromCharCode(c & 63 | 128)
            } else {
                utftext += String.fromCharCode(c >> 12 | 224);
                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                utftext += String.fromCharCode(c & 63 | 128)
            }
        }
        return utftext
    }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 3614090360);
        d = FF(d, a, b, c, x[k + 1], S12, 3905402710);
        c = FF(c, d, a, b, x[k + 2], S13, 606105819);
        b = FF(b, c, d, a, x[k + 3], S14, 3250441966);
        a = FF(a, b, c, d, x[k + 4], S11, 4118548399);
        d = FF(d,
            a, b, c, x[k + 5], S12, 1200080426);
        c = FF(c, d, a, b, x[k + 6], S13, 2821735955);
        b = FF(b, c, d, a, x[k + 7], S14, 4249261313);
        a = FF(a, b, c, d, x[k + 8], S11, 1770035416);
        d = FF(d, a, b, c, x[k + 9], S12, 2336552879);
        c = FF(c, d, a, b, x[k + 10], S13, 4294925233);
        b = FF(b, c, d, a, x[k + 11], S14, 2304563134);
        a = FF(a, b, c, d, x[k + 12], S11, 1804603682);
        d = FF(d, a, b, c, x[k + 13], S12, 4254626195);
        c = FF(c, d, a, b, x[k + 14], S13, 2792965006);
        b = FF(b, c, d, a, x[k + 15], S14, 1236535329);
        a = GG(a, b, c, d, x[k + 1], S21, 4129170786);
        d = GG(d, a, b, c, x[k + 6], S22, 3225465664);
        c = GG(c, d, a, b, x[k + 11], S23, 643717713);
        b = GG(b, c, d, a, x[k + 0], S24, 3921069994);
        a = GG(a, b, c, d, x[k + 5], S21, 3593408605);
        d = GG(d, a, b, c, x[k + 10], S22, 38016083);
        c = GG(c, d, a, b, x[k + 15], S23, 3634488961);
        b = GG(b, c, d, a, x[k + 4], S24, 3889429448);
        a = GG(a, b, c, d, x[k + 9], S21, 568446438);
        d = GG(d, a, b, c, x[k + 14], S22, 3275163606);
        c = GG(c, d, a, b, x[k + 3], S23, 4107603335);
        b = GG(b, c, d, a, x[k + 8], S24, 1163531501);
        a = GG(a, b, c, d, x[k + 13], S21, 2850285829);
        d = GG(d, a, b, c, x[k + 2], S22, 4243563512);
        c = GG(c, d, a, b, x[k + 7], S23, 1735328473);
        b = GG(b, c, d, a, x[k + 12], S24, 2368359562);
        a = HH(a, b, c, d, x[k + 5], S31, 4294588738);
        d = HH(d, a, b, c, x[k + 8], S32, 2272392833);
        c = HH(c, d, a, b, x[k + 11], S33, 1839030562);
        b = HH(b, c, d, a, x[k + 14], S34, 4259657740);
        a = HH(a, b, c, d, x[k + 1], S31, 2763975236);
        d = HH(d, a, b, c, x[k + 4], S32, 1272893353);
        c = HH(c, d, a, b, x[k + 7], S33, 4139469664);
        b = HH(b, c, d, a, x[k + 10], S34, 3200236656);
        a = HH(a, b, c, d, x[k + 13], S31, 681279174);
        d = HH(d, a, b, c, x[k + 0], S32, 3936430074);
        c = HH(c, d, a, b, x[k + 3], S33, 3572445317);
        b = HH(b, c, d, a, x[k + 6], S34, 76029189);
        a = HH(a, b, c, d, x[k + 9], S31, 3654602809);
        d = HH(d, a, b, c, x[k + 12], S32, 3873151461);
        c = HH(c, d, a, b, x[k + 15], S33, 530742520);
        b = HH(b, c, d, a, x[k + 2], S34, 3299628645);
        a = II(a, b, c, d, x[k + 0], S41, 4096336452);
        d = II(d, a, b, c, x[k + 7], S42, 1126891415);
        c = II(c, d, a, b, x[k + 14], S43, 2878612391);
        b = II(b, c, d, a, x[k + 5], S44, 4237533241);
        a = II(a, b, c, d, x[k + 12], S41, 1700485571);
        d = II(d, a, b, c, x[k + 3], S42, 2399980690);
        c = II(c, d, a, b, x[k + 10], S43, 4293915773);
        b = II(b, c, d, a, x[k + 1], S44, 2240044497);
        a = II(a, b, c, d, x[k + 8], S41, 1873313359);
        d = II(d, a, b, c, x[k + 15], S42, 4264355552);
        c = II(c, d, a, b, x[k + 6], S43, 2734768916);
        b = II(b, c, d, a, x[k + 13], S44, 1309151649);
        a = II(a, b, c, d, x[k + 4], S41, 4149444226);
        d = II(d, a, b, c, x[k + 11], S42, 3174756917);
        c = II(c, d, a, b, x[k + 2], S43, 718787259);
        b = II(b, c, d, a, x[k + 9], S44, 3951481745);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD)
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase()
};
function formatTime(arg) {
    var s = Math.round(arg);
    var m = 0;
    if (s > 0) {
        while (s > 59) {
            m++;
            s -= 60
        }
        return String((m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s)
    } else return"00:00"
};