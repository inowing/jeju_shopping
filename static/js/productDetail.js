var ProductDetailModule = (function () {

    var productId = 0;
    var productSalePrice = 0;
    var menuId = 0;
    var eventData;
    var isLogin = false;
    var lastBtnClick = "";
    var guestNumber = "";

    function init() {
        eventBind();
        setProductDetail();
        getUserInfo();

    }

    function eventBind() {

        var url = location.search;
        if (url != undefined && url != "" && url != undefined) {
            productId = url.split('?product_id=')[1];
        }
        $('body').on('click', ".qtyplus", plusProductQuant)
        $('body').on('click', ".qtyminus", minusProductQuant)
        $('body').on('click', ".calculate_price", calculatePrice)
        $('body').on('click', ".check_allow_basket", checkAllowBasket)
//        $('body').on('click', ".add_to_basket", addToBasket)
//        $('body').on('click', '.js-pop_show', setShowPopup)
        $('body').on('click', '.js-hidePop', setHidePopup)                              // Close product sort popup
        $('body').on('click', '#loginBtn', makeLogin)
        $('body').on('click', '.check_allow_order', checkAllowOrder)
        $('body').on('click', '.buy_by_not_logged', goToOrderPage)                      // add selected product to basket and go to order page by not logged user
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
                } else {
                    setGuestNumber();
                }


            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function setProductDetail() {
        $.ajax({
            url: '/api/v1/product/' + productId,
            method: 'get',
            data: {
            },
            success: function (response) {

                var code = response.code;

                if (code != 200) {
                    alert("API error")
                    return;
                }


                if (typeof (response.result) != "undefined" && response.result !== null) {
                    var product = response.result;

                    var sale_proc = Math.round((parseInt(product.price) - parseInt(product.sale_price)) * 100 / parseInt(product.price));
                    productSalePrice = product.sale_price;
                    menuId = product.menu_id;

                    $(".product_image_cont img").attr("src", product.product_image);
                    $(".product_detail_title").html(product.title);
                    $(".product_detail_company").html(product.company_name);
                    $(".product_detail_sale_proc").html(sale_proc + "%");
                    $(".product_detail_sale_price").html(formatter.format(product.sale_price) + "원");
                    $(".product_detail_price").html(formatter.format(product.price) + "원");
                    $(".desc_img").attr("src", product.product_image);

                }

                getMenuData();

            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function plusProductQuant() {
        var current_quant = $(".quantity").val();

        $(".quantity").val(parseInt(current_quant) + 1);

    }


    function minusProductQuant() {

        var current_quant = parseInt($(".quantity").val());

        if (current_quant - 1 < 0)
            return false;

        $(".quantity").val(current_quant - 1);

    }


    function calculatePrice() {
        var current_quant = parseInt($(".quantity").val());

        if (current_quant == 0) {
            alert("수량을 선택해주세요");
            return false;
        }

        var total_price = current_quant * productSalePrice;

        $(".total_price").html(formatter.format(total_price) + "원")
    }


    var formatter = new Intl.NumberFormat('en-US', {
        currency: 'KRW',
        minimumFractionDigits: 0,

    });

    var floatPosition = parseInt($(".product_detail_control").css('top'));

    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        var newPosition = scrollTop + floatPosition + "px";
        $(".product_detail_control").stop().animate({
            "top": newPosition
        }, 500);
    }).scroll();



    function addToBasket(type = "basket") {

        var current_quant = parseInt($(".quantity").val());
        var data = {};

        if (!isLogin)
            data["guest_number"] = guestNumber;

        data["menu_id"] = menuId;
        data["product_id"] = productId;
        data["count"] = current_quant;

        var current_quant = parseInt($(".quantity").val());
        $.ajax({
            url: '/api/v1/basket',
            method: 'post',
            data: data,
            success: function (response) {

                var code = response.code;


                if (code == 413) {
                    alert("배송비 등의 이유로 동일 매장의 상품만 한 장바구니에 담을 수 있습니다")
                    return;
                }


                if (code != 200) {
                    alert("API error")
                    return;
                }


                if (type == 'order') {
                    window.location.href = "/shopping/order.html?menu_id=" + menuId;
                } else {
                    if (typeof (response.result) != "undefined" && response.result !== null) {

                        $.confirm({
                            title: '',
                            content: "장바구니에 상품을 담았습니다",
                            buttons: {
                                cancel: {
                                    text: '계속쇼핑',
                                    btnClass: 'close_btn_cust',
                                    keys: ['enter', 'shift'],
                                    action: function () {
                                        $(".total_price").html("");
                                        $(".quantity").val(0)
                                    }
                                },

                                somethingElse: {
                                    text: '장바구니로',
                                    btnClass: 'btn-blue',
                                    keys: ['enter', 'shift'],
                                    action: function () {
                                        window.location.href = "/shopping/basket.html?menu_id=" + menuId;

                                    }
                                }
                            }
                        });
                    }
                }

            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function getMenuData() {
        $.ajax({
            url: '/api/v1/menu/' + menuId,
            method: 'get',
            data: {
            },
            success: function (response) {
                if (typeof (response.result) != "undefined" && response.result !== null) {
                    eventID = response.result.event_id;
                    getEventByID(eventID);
                }

            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function getEventByID(eventID) {
        $.ajax({
            url: '/api/v1/event/' + eventID + '/show_event_for_guest',
            method: 'get',
            data: {
            },
            success: function (response) {
                if (typeof (response.result) != "undefined" && response.result !== null) {
                    eventData = response.result;
                }

            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }



    function setShowPopup() {
        var this_pop_page = this.getAttribute('data-page');
        if (this_pop_page == undefined || this_pop_page == null || this_pop_page == '') {
            this_pop_page = 0;
        }
        showPopup(this_pop_page);
    }


    function showPopup(type) {

        if (type == "basket") {
            $(".buy_by_not_logged").css("display", "none");
        } else {
            $(".buy_by_not_logged").css("display", "block");
            $(".product_login_block").css("display", "none");
            $("#loginBtn").css("display", "none");

        }
        lastBtnClick = type;

        setPopupVertical()
    }

    function setPopupVertical() {
        var pop_el = document.querySelector('.js-pop_wrap .pop_bg');
        pop_el.style.visiblelity = 'hidden';
        pop_el.style.display = 'block'
        var pop_content_els = $(".js-pop_wrap .pop_bg").find('.pop_content_area')
        var pop_content_el
        for (var i = 0; i < pop_content_els.length; i++) {
            if (pop_content_els.eq(i).is(':visible')) {
                pop_content_el = pop_content_els.eq(i);
                break;
            }
        }
        var top = ($(window).height() - pop_content_el.outerHeight()) / 2 + $(window).scrollTop()
        var left = ($(window).width() - pop_content_el.outerWidth()) / 2 + $(window).scrollLeft()
        top = (top <= 0) ? 0 : top;
        left = (left <= 0) ? 0 : left;
        pop_content_el.css('margin-top', top + "px")
        if (pop_content_els.hasClass("exd_pop")) {
            pop_content_el.css('margin-top', '20%')
        }
        pop_content_el.css('margin-left', left + "px")
        $('.js-pop_wrap .pop_bg').show();
        document.body.style.overflow = 'hidden';
    }

    function setHidePopup() {
        var this_pop_page = this.getAttribute('data-page');
        if (this_pop_page == undefined || this_pop_page == null || this_pop_page === '') {
            this_pop_page = -1;
        }
        if (this_pop_page == 'exhibition_popup_d') {
            $('.ex_d_pop').empty();
        }
        hidePopup(this_pop_page);
    }


    function hidePopup(show_page) {
        var this_index = show_page;
        if (this_index == undefined || this_index == null || this_index === '') {
            this_index = -1;
        }
        if (show_page == -1) {
            $('.pop_bg').hide();
        } else {
            $('.pop_bg').eq(show_page).hide();
        }
        document.body.style.overflow = '';
    }



    function makeLogin() {
        var login = $(".login.shoping_input").val()
        var password = $(".password.shoping_input").val();

        $.ajax({
            url: '/api/v1/auth/login',
            method: 'post',
            data: {
                app_id: 1,
                email: login,
                password: password,
            },
            success: function (response) {

                var code = response.code;

                if (code == 401) {
                    alert("Attemp error")
                    return;
                }

                if (code != 200) {
                    alert("API error")
                    return;
                }

                isLogin = true;

                if (typeof (response.result) != "undefined" && response.result !== null) {
                    $(".js-hidePop").trigger("click")

                    if (lastBtnClick == "payment") {
                        $(".check_allow_order").trigger("click")
                    } else {
                        $(".check_allow_basket").trigger("click")
                    }

                }

            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function checkAllowOrder() {

        var total_price = $(".total_price").html();

        if (total_price == "") {
            alert("선댁 해 주세요")
            return false;
        }


        if (!isLogin && eventData.is_login == 1) {
            showPopup('payment')
            return false;
        } else {
            goToOrderPage();
        }
    }


    function goToOrderPage() {
        addToBasket('order');
    }

    function setGuestNumber() {
        if (localStorage.getItem("guestNumber") === null) {
            localStorage.setItem('guestNumber', ['guest', Math.floor(Math.random() * 0x10000).toString(16)].join(''));
        }

        guestNumber = localStorage.getItem("guestNumber");
    }


    function checkAllowBasket() {
        var total_price = $(".total_price").html();

        if (total_price == "") {
            alert("선댁 해 주세요")
            return false;
        }
   
        if (!isLogin && eventData.is_login == 1) {
            $.confirm({
                title: '',
                content: "로그인 후 이용해주세요",
                buttons: {
                    cancel: {
                        text: '닫기',
                        btnClass: 'close_btn_cust',
                        keys: ['enter', 'shift'],
                        action: function () {
                            $(".total_price").html("");
                            $(".quantity").val(0)
                        }
                    },

                    somethingElse: {
                        text: '로그인',
                        btnClass: 'btn-blue',
                        keys: ['enter', 'shift'],
                        action: function () {
                            showPopup("basket");
                        }
                    }
                }
            });

        } else {
            addToBasket();
        }


    }

    return {
        init: init,
    };
})();

$(function () {
    ProductDetailModule.init();


})