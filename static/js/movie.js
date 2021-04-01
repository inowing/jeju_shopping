var MovieModule = (function () {
    var $root
    function init() {
        $root = $('.wrap');

        startSlide();
    }

    function startSlide(){
        var n = $( ".js-bxSlider li" ).length;
        $('.js-bxSlider').bxSlider({
            minSlides: 5,
            ticker: true,
            slideWidth:300,
            slideMargin:0,
            speed: 5000*n
          })
        if(n<=5){
            $('<style type="text/css"></style>').text('.js-bxSlider {transition-duration: 0 !important;}').appendTo('head');
        }
        
    }

    return {
        init: init
    };
})();
(function () {
    MovieModule.init();
})();
