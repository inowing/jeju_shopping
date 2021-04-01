var ProductList = (function () {
    var $root
    var shopingMenuID = 0;
    var eventID = 0;
    var LANG_TYPE = 'ko'

    function init() {
        $root = $('.wrap');
        eventBind();

        var url = location.search;
        if (url != undefined && url != "" && url != undefined) {
            shopingMenuID = url.split('?menu_id=')[1];
        }

        setCategoryList();                                                          // Insert product category list to the product sort popup
        setEvetnIDByMenu();                                                         // Get event id by menu data
        setProductList();                                                           // Set product list


    }

    function eventBind() {
        $root.on('click', '.js-pop_show', setShowPopup)                             // Open product sort popup
        $root.on('click', '.js-hidePop', setHidePopup)                              // Close product sort popup
        $root.on('click', '#searchBtn', searchProduct)                              // When search product by keword
        $root.on('click', '#detailSearch', productDetailSearch)                     // Search product by category, company, and sort
//        $('body').on('change', ".subproduct_select", showSubProductData)  
    }

    function setShowPopup() {
        var this_pop_page = this.getAttribute('data-page');
        if (this_pop_page == undefined || this_pop_page == null || this_pop_page == '') {
            this_pop_page = 0;
        }
        showPopup(this_pop_page);
    }


    function showPopup(show_page) {
        var load_pop_html = show_page;
        $('.js-pop_wrap').load('./popup/' + load_pop_html + '.html', // url 
                function (data, status, jqXGR) {  // callback function
                    setPopupVertical()
                });
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



    function resetBtn() {
        $('#resetBtn').on('click', function (e) {
            $('.location_wrap > div').removeClass('active');
            $('.location_wrap > div[data-value=모든지역]').addClass('active');
            $("#slider_sale").slider("option", "values", [slider_values.sale_start, slider_values.sale_end]);
            $('#sale_handle_start').text(slider_values.sale_start);
            $('#sale_handle_end').text(slider_values.sale_end);
            $("#slider_num").slider("option", "values", [slider_values.num_start, slider_values.num_end]);
            $('#num_handle_start').text(slider_values.num_start);
            $('#num_handle_end').text(slider_values.num_end);

        });
    }


    $('body').on('click', ".category_wrap > div", function () {
        if (!$(this).hasClass('active')) {
            if ($('.category_wrap > div[data-value=all]').hasClass('active')) {
                $('.category_wrap > div[data-value=all]').removeClass('active');
            }
            if ($(this).data('value') == "all") {
                $('.category_wrap > div').removeClass('active');
                $('.category_wrap > div[data-value=all]').addClass('active');
            } else {
                $(this).addClass('active');
            }
        }
    })

    $('body').on('click', ".company_wrap > div", function () {
        if (!$(this).hasClass('active')) {
            if ($('.company_wrap > div[data-value=all]').hasClass('active')) {
                $('.company_wrap > div[data-value=all]').removeClass('active');
            }
            if ($(this).data('value') == "all") {
                $('.company_wrap > div').removeClass('active');
                $('.company_wrap > div[data-value=all]').addClass('active');
            } else {
                $(this).addClass('active');
            }
        }
    })

    $('body').on('click', ".sorting_wrap > div", function () {
        $('.sorting_wrap > div').removeClass('active')
        $(this).addClass('active');
    })




    function setCategoryList() {
        $.ajax({
            url: '/api/v1/menucategory/topcategory',
            method: 'get',
            data: {
                menu_id: shopingMenuID,
            },
            success: function (response) {

                var code = response.code;

                if (code != 200) {
                    alert("API error")
                    return;
                }


                if (typeof (response.result) != "undefined" && response.result !== null) {

                    var meny_html = "";
                    meny_html += ' <div class="active" data-value="all">전체<span>All</span></div>';
                    $.each(response.result, function (key, val) {
                        meny_html += ' <div class="" data-value="' + val.id + '">' + val.name + '<span>' + val.name_en + '</span></div>';

                    })
                    $(".category_wrap").html(meny_html);
                }
            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function setEvetnIDByMenu() {
        $.ajax({
            url: '/api/v1/menu/' + shopingMenuID,
            method: 'get',
            data: {
            },
            success: function (response) {
                if (typeof (response.result) != "undefined" && response.result !== null) {
                    eventID = response.result.event_id;
                }

                setCompanyList();                                                           // Insert product company list to the product sort popup
            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }

    function setCompanyList() {
        $.ajax({
            url: '/api/v1/company',
            method: 'get',
            data: {
                event_id: eventID,
            },
            success: function (response) {

                if (typeof (response.result) != "undefined" && response.result !== null) {
                    var meny_html = "";
                    meny_html += ' <div class="active" data-value="all">전체<span>All</span></div>';
                    $.each(response.result, function (key, val) {
                        meny_html += ' <div class="" data-value="' + val.id + '">' + val.name + '<span>' + val.name_en + '</span></div>';

                    })

                    $(".company_wrap").html(meny_html);
                }
            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }



    function setProductList() {

        $.ajax({
            url: '/api/v1/product',
            method: 'get',
            data: {
                menu_id: shopingMenuID,
            },
            success: function (response) {
                var product_html = "";

                console.log(response)

                if (typeof (response.result) != "undefined" && response.result !== null) {

                    var lang_prefix = LANG_TYPE == "ko" ? "" : "_en";

                    $.each(response.result, function (key, product) {
                        var sale_proc = (parseInt(product.price) - parseInt(product.sale_price)) * 100 / parseInt(product.price);
                        sale_proc = Math.round(sale_proc);
                        var sale_class = product.is_sale == "1" ? "sale_product" : "normal_product";
                        var image = product.product_image != "" ? product.product_image : "./static/images/no_image.png";

                        product_html += "<a href='/shopping/product_detail.html?product_id=" + product.id + "'>"
                        product_html += "<div class='product_item " + sale_class + "' data-product_id='" + product.id + "'>"
                        product_html += "<div class='product_item_wrap'>"

                        product_html += "<div class='product_company_title'>"
                        product_html += "<div>" + product["name" + lang_prefix] + "</div>";
                        if (product.is_sale == "1")
                            product_html += " <div class='product_sale_text'>(행사상품)</div>"

                        product_html += "</div>"

                        product_html += "<div class='product_bottom_cont'>"
                        product_html += "<div class='product_share_cont'><img src='./static/images/product_share_icon.png'></div>"

                        product_html += "<div class='product_main_image_cont'><img src='" + image + "'></div>"

                        product_html += "<div class='product_description_cont'>"
                        product_html += "<div class='product_title'>" + product["title" + lang_prefix] + "</div>"
                        product_html += "<div class='product_phone'>" + product.phone + "</div>"
                        product_html += "<div class='product_price_cont'>"
                        product_html += "<span class='product_sale_proc'>" + sale_proc + "%</span>"
                        product_html += "<span class='product_sale_price'>" + formatter.format(product.sale_price) + "원</span>"
                        product_html += "<span class='product_price'>" + formatter.format(product.price) + "원</span>"
                        product_html += "</div>"
                        product_html += "</div>"
                        product_html += "</div>"

                        product_html += "</div>"
                        product_html += "</div>"
                        product_html += "</a>"

                    })

                    $(".product_container").html(product_html);

                }


            },
            error: function (error) {
                console.log(error['responseText'])
            },
        });
    }


    function searchProduct() {
        var search = $("#searchQuery").val();

        $.ajaxSetup({
            data: {
                search_key: search
            }
        });

        setProductList()
    }


    function productDetailSearch() {

        var categories = $('.category_wrap .active').map(function () {
            return $(this).attr("data-value");
        }).get().join('||');

        var companies = $('.company_wrap .active').map(function () {
            return $(this).attr("data-value");
        }).get().join('||');


        var sort_type = $(".sorting_wrap .active").attr("data-value");

        $.ajaxSetup({
            data: {
                categories: categories,
                companies: companies,
                sort_type: sort_type,
            }
        });

        setProductList();
        $(".js-hidePop").trigger("click")

    }


    var formatter = new Intl.NumberFormat('en-US', {
        currency: 'KRW',
        minimumFractionDigits: 0,

    });

    return {
        init: init,
    };
})();

$(function () {
    ProductList.init();
})