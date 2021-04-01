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
            getUserInfo();
            eventBind();

        }, 200);

    }

    function eventBind() {

        var url = location.search;
        if (url != undefined && url != "" && url != undefined) {
            menuId = url.split('?menu_id=')[1];
        }
        $('body').on('click', ".qtyplus", plusProductQuant)
        $('body').on('click', ".qtyminus", minusProductQuant)
        $('body').on('click', ".calculate_price", calculatePrice)
        $('body').on('click', ".add_to_basket", addToBasket)
//        $('body').on('click', '.js-pop_show', setShowPopup)
        $('body').on('click', '.js-hidePop', setHidePopup)                              // Close product sort popup
        $('body').on('click', '#loginBtn', makeLogin)
        $('body').on('click', '.go_to_order_page', goToOrderPage)
        $('body').on('click', '.remove_product_from_basket', removeProductFromBasket)
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

                setBasketList();
            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function setBasketList() {
        var data = {};

        if (!isLogin)
            data["guest_number"] = guestNumber;

        data["menu_id"] = menuId;

        $.ajax({
            url: '/api/v1/basket',
            method: 'get',
            data: data,
            success: function (response) {

                var code = response.code;

                if (code != 200) {
                    alert("API error")
                    return;
                }


                if (typeof (response.result) != "undefined" && response.result !== null) {

                    var html = "";
                    var total_price = 0;
                    var delivery_price = response.result[0].company.delivery_price;
                    deliveryPrice = delivery_price;
                    $.each(response.result, function (key, val) {

                        var product = val.product;
                        var company = val.company;
                        total_price += product.sale_price;

                        html += '<div class="basket_detal_container basket_detal_container_' + val.id + '" data-type="0" data-price="' + product.sale_price + '">';
                        html += '<div class="product_header">';
                        html += '    <div class="product_image_cont"><img src="' + product.product_image + '" alt=""></div>';
                        html += '</div>';
                        html += '<div class="product_detail_cont">';
                        html += '    <div class="basket_detail_title">' + product.title + '</div>';
                        html += '    <div class="basket_detail_company">' + company.name + '</div>';
                        html += '    <div class="basket_detail_price_cont">';
                        html += '        <span class="basket_detail_sale_price">' + formatter.format(product.sale_price) + "원" + '</span>';
                        html += '        <span class="product_count">/' + val.count + '개</span>';
                        html += '    </div>';
                        html += '</div>';
                        html += '<span class="remove_product_from_basket" data-id="' + val.id + '">x</span>';
                        html += '</div>';


//                        $(".product_image_cont img").attr("src", product.product_image);
//                        $(".product_detail_title").html(product.title);
//                        $(".product_detail_company").html(product.company_name);
//                        $(".product_detail_sale_proc").html(sale_proc + "%");
//                        $(".product_detail_sale_price").html(formatter.format(product.sale_price) + "원");
//                        $(".product_detail_price").html(formatter.format(product.price) + "원");
//                        $(".desc_img").attr("src", product.product_image);
                    })

                    var total_price_with_delivery = total_price + delivery_price;


                    $(".product_detal_container_main").html(html)
                    $(".total_price").html(formatter.format(total_price) + "원")
                    $(".delivery_price").html(formatter.format(delivery_price) + "원")
                    $(".total_price_with_delivery").html(formatter.format(total_price_with_delivery) + "원")

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


    function addToBasket() {
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
            return 1;
        }


        var current_quant = parseInt($(".quantity").val());
        $.ajax({
            url: '/api/v1/basket',
            method: 'post',
            data: {
                menu_id: menuId,
                product_id: productId,
                count: current_quant,
            },
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
                                    window.location.href = "/shopping/basket.html";

                                }
                            }
                        }
                    });
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
                        $(".add_to_payment").trigger("click")
                    } else {
                        $(".add_to_basket").trigger("click")
                    }

                }

            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function goToOrderPage() {
        window.location.href = "/shopping/order.html?menu_id=" + menuId;
    }

    function removeProductFromBasket() {
        var basket_id = $(this).attr("data-id");


        $.confirm({
            title: '',
            content: "삭제하게셌습니까?",
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
                    text: '삭제',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function () {
                        var data = {};

                        if (!isLogin)
                            data['guest_number'] = guestNumber;

                        $.ajax({
                            url: '/api/v1/basket/' + basket_id,
                            method: 'delete',
                            data: data,
                            success: function (response) {
                                var code = response.code;

                                if (code != 200) {
                                    alert("API Error")
                                    return;
                                }

                                $(".basket_detal_container_" + basket_id).fadeOut('300', function () {
                                    $(".basket_detal_container_" + basket_id).remove();
                                    refreshPrice();
                                });

                            },
                            error: function (error) {
                                console.log(error['responseText'])
                            },
                        });

                    }
                }
            }
        });
    }


    function refreshPrice() {
        var total_price = 0;
        $(".basket_detal_container").each(function (key, val) {
            total_price += parseInt($(this).attr("data-price"));
        })
        var price_with_delivery = total_price + deliveryPrice;

        $(".total_price").html(formatter.format(total_price) + "원");
        $(".total_price_with_delivery").html(formatter.format(price_with_delivery) + "원")
    }


    function search_address_result_handler(data) {
        $('[name=post_code]').val(data.zonecode);
        $('[name=address]').val(data.roadAddress);

        $(".order_block").css("display", "block");
        $(".search_address_block").css("display", "none");

//    $("#modal-search_address").modal('hide');
        $(".update_receiver_data").removeAttr('checked');


        $('html, body').animate({
            scrollTop: $("input[name=address_detail]").offset().top
        }, 100);

//
        $(".receiver_address_li")[0].scrollIntoView();
        $('input[name=address_detail]').val('')

//    setTimeout(function () {
//        .scrollTo();
//    }, 2000);


//
//    $('html,body').animate({scrollTop: 485}, 2000);
    }


    function searchAddress(e) {
        e.preventDefault();
        $element_wrap.style.display = 'block';

        //    var link = '/api/v1/user/search_address_for_shopping';
//            $(".order_block").css("display", "none");
//            $(".search_address_block").css("display", "block");
//            $(".top_nav_container")[0].scrollIntoView(); // scroll to top after showing Address search block
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



// ***** Address search *****
var adressSearchModule = (function () {
    var $element_wrap;
    function init() {
        $("#wrap").html("");
        $element_wrap = document.getElementById('address_search');

        eventBind();
        daumPostInit();

    }

    function eventBind() {
        $('body').on('click', ".search_address", searchAddress)
        $('body').on('click', ".address_search_close", searchAddressClose)
    }


    function searchAddress(e) {
        e.preventDefault();
        $element_wrap.style.display = 'block';

        //    var link = '/api/v1/user/search_address_for_shopping';
//            $(".order_block").css("display", "none");
//            $(".search_address_block").css("display", "block");
//            $(".top_nav_container")[0].scrollIntoView(); // scroll to top after showing Address search block
    }

    function searchAddressClose(e) {
        e.preventDefault();
        $element_wrap.style.display = 'none';
    }


    function daumPostInit() {
        new daum.Postcode({
            oncomplete: function (data) {
                searchAddressResultHandler(data)
                daumPostInit()

            },
            onresize: function (size) {
                $element_wrap.style.height = size.height + 'px';
            },
            width: '100%',
            height: '100%',
            hideMapBtnL: true
        }).embed($element_wrap);
    }

    function searchAddressResultHandler(data) {
        $('[name=post_code]').val(data.zonecode).removeClass("parsley-error");
        $('[name=address]').val(data.roadAddress).removeClass("parsley-error");
//            $(".order_block").css("display", "block");
        $("#address_search").css("display", "none");
        $(".update_receiver_data").removeAttr('checked');
        $('html, body').animate({
            scrollTop: $("input[name=address_detail]").offset().top
        }, 100);
        $(".receiver_address_li")[0].scrollIntoView();
        $('input[name=address_detail]').val('')

        $(".address").trigger("input_address");
    }

    return {
        init: init,
    };
})();

$(function () {
    BasketModule.init();
    adressSearchModule.init();


})