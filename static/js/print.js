var PrintModule = (function () {
    var $root
    function init() {
        $root = $('.wrap');
        eventBind();
    }

    function eventBind(){
        $root.on('click','#print',printPage)
    }

    function printPage(){
        console.log('print!')
        // var mywindow = window.open('', 'PRINT', 'height=400,width=600');
        // var page_html = document.querySelector('.js-print').innerHTML
        // mywindow.document.write('<html><head><link rel="stylesheet" href="./static/css/main.css?v=200814_3"><title>' + document.title  + '</title>');
        // mywindow.document.write('</head><body >');
        // mywindow.document.write(page_html);
        // mywindow.document.write('</body></html>');

        // mywindow.document.close(); // necessary for IE >= 10
        // mywindow.focus(); // necessary for IE >= 10*/

        
        window.print();
        // mywindow.close();

        return true;
    }

    return {
        init: init
    };
})();
(function () {
    PrintModule.init();
})();
