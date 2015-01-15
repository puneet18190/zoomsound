(function($) {

    $.fn.dzstooltip = function(o) {

        var defaults = {
            settings_slideshowTime : '5' //in seconds
            , settings_autoHeight : 'on'
            , settings_skin : 'skin_default'
        }

        o = $.extend(defaults, o);
        this.each( function(){
            var cthis = $(this);
            var cchildren = cthis.children();
            var currNr=-1;
            
            //console.info(cthis);

            cthis.bind('click', click_cthis);

            function click_cthis(e){

                var _c = cthis.find('.dzstooltip');
                if(_c.hasClass('active')){
                    _c.removeClass('active');



                }else{
                    _c.addClass('active');


                    if(parseInt(cthis.offset().left, 10) + _c.width() > parseInt($(window).width(), 10) - 50){
                        _c.addClass('align-right');
                    }else{
                        _c.removeClass('align-right');
                    }
                }

                //console.info(cthis.offset().left);




            }
            return this;
        })
    }
    window.dzstt_init = function(arg, optargs){
        $(arg).dzstooltip(optargs);
    }
})(jQuery);

if(typeof jQuery!='undefined'){
    jQuery(document).ready(function($){
        dzstt_init('.dzstooltip-con.js',{});
    })
}

