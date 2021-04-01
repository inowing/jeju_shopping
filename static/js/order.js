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
        $('body').on('click', '.js-hidePop', setHidePopup)                              // Close product sort popup
        $('body').on('click', '.add_to_payment', addToPayment)
        $('body').on('click', '.copy_user_data', copyUserData)
        $('body').on('click', '.make_order', makeOrder)
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

                    var user_date = response.result;
                    var phone = user_date.phone;

                    var phone_1 = phone.substring(0, 3);
                    var phone_2 = phone.substring(3, 7);
                    var phone_3 = phone.substring(7, 12);
                    $(".receiver_name_original").val(user_date.name);
                    $(".receiver_email_original").val(user_date.email);
                    $(".receiver_phone_original_1").val(phone_1);
                    $(".receiver_phone_original_2").val(phone_2);
                    $(".receiver_phone_original_3").val(phone_3);
                } else if (code == 401) {
                    $(".copy_user_data_form_check").css("display", "block");
                    $(".bayer_information_block").css("display", "block");
                    $(".password_row").css("display", "block");
                    $(".password_row_check").css("display", "block");

//                    $(".receiver_name_original").attr("required", "required");
//                    $(".receiver_phone_original_1").attr("required", "required");
//                    $(".receiver_phone_original_2").attr("required", "required");
//                    $(".receiver_phone_original_3").attr("required", "required");
                    $(".receiver_password_original").attr("required", "required");
                    $(".receiver_password_conf_original").attr("required", "required");

                    setGuestNumber();                                                // set guest number for not logged users (need for getting products from basket)   
                }
                setBasketList();                                                    // show products from basket
            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function setBasketList() {

        var data = {};
        data['menu_id'] = menuId;

        if (!isLogin)
            data['guest_number'] = guestNumber;

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
//                        html += '<span class="remove_product_from_basket" data-id="' + val.id + '">x</span>';
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






    function addToPayment() {
        if (!isLogin && eventData.is_login == 1) {
            showPopup('payment')
            return false;
        }
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


    function copyUserData() {
        $('input[name="receiver_name"]').val($(".receiver_name_original").val());
        $('input[name="receiver_phone_1"]').val($(".receiver_phone_original_1").val());
        $('input[name="receiver_phone_2"]').val($(".receiver_phone_original_2").val());
        $('input[name="receiver_phone_3"]').val($(".receiver_phone_original_3").val());
    }


    function makeOrder() {

        $('.order_form').parsley().validate()


        if (!$('.order_form').parsley().isValid()) {
            click_order_button = 0;
            $.alert({
                title: '',
                content: '주문자정보와 배송지정보를 확인해주세요.',
            });
            return false;
        }

        var data = {};

        var user_phone = $(".receiver_phone_original_1").val() + $(".receiver_phone_original_2").val() + $(".receiver_phone_original_3").val();
        var recepient_phone = $(".receiver_phone_1").val() + $(".receiver_phone_2").val() + $(".receiver_phone_3").val();




        var password = $(".receiver_password_original ").val();
        var password_confirm = $(".receiver_password_conf_original  ").val();

        if (password != password_confirm) {
            $.alert({
                title: '',
                content: 'Please check password',
            });
            return false;
        }

        if (!isLogin)
            data["guest_number"] = guestNumber;

        data["menu_id"] = menuId;
        data["user_name"] = $(".receiver_name_original").val();
        data["user_phone"] = user_phone;
        data["recipient"] = $("input[name='receiver_name']").val();
        data["recipient_phone"] = recepient_phone;
        data["recipient_zip"] = $("input[name='post_code']").val();
        data["recipient_address"] = $("input[name='address']").val();
        data["recipient_address_detail"] = $("input[name='address_detail']").val();
        data["recipient_request"] = $(".description").val();


        $.ajax({
            url: '/api/v1/order',
            method: 'post',
            data: data,
            success: function (response) {
                var code = response.code;

                if (code != 200) {
                    alert("API error")
                    return;
                }

                if (typeof (response.result) != "undefined" && response.result !== null) {
                    var order_id = response.result.id;

                    window.location.href = "/shopping/order_result_page.html?order_id=" + order_id;

                }
            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });

        console.log(data)
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



// ***** Address search *********************************************************************
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