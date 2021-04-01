var BasketModule = (function () {

    var productId = 0;
    var productSalePrice = 0;
    var menuId = 0;
    var eventData;
    var isLogin = false;
    var lastBtnClick = "";
    var deliveryPrice = 0;
    var guestNumber = "";


    function init() {
        setTimeout(function () {
            eventBind();
            getUserInfo();
        }, 200);

    }

    function eventBind() {

        var url = location.search;
        if (url != undefined && url != "" && url != undefined) {
            menuId = url.split('?menu_id=')[1];
        }

    }


    function getUserInfo() {
        $.ajax({
            url: '/api/v1/user/info',
            method: 'get',
            data: {
            },
            success: function (response) {
                var code = response.code;


                if (code == 200) {
                    isLogin = true;


                } else if (code == 401) {
                    setGuestNumber();                                                // set guest number for not logged users (need for getting products from basket)   
                }
                setBasketList();                                                    // show products from basket
            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }




    function setGuestNumber() {
        if (localStorage.getItem("guestNumber") === null) {
            localStorage.setItem('guestNumber', ['guest', Math.floor(Math.random() * 0x10000).toString(16)].join(''));
        }

        guestNumber = localStorage.getItem("guestNumber");
    }

    return {
        init: init,
    };
})();



$(function () {
    BasketModule.init();

})