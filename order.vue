<template>
    <div class="wrap_flex_main js-main pc-w-mini">

        <div class="alert_cont">
            *주문하신 상품 및 배송관련 문의는 판매자에 직접 해주세요.
            *본 사이트에서 판매되는 상품의 품질 및 배송 등은 이벤트 준비/운영사무국과는 관계가 없음을 알려드립니다. 또한, 주문하신 상품은 이벤트사이트 운영 기간 전후로 한시적으로 판매되는 것으로 상품의 품질 및 배송관련 발생할 수 있는 각종 분쟁관련 사항은 오로지 판매자와 구매자사이에서 해결해야합니다.

        </div>


        <div class="clearfix"></div>
        <div class="poduct_detail_delimeter"></div>

        <div class="product_detail_desc_cont">
            <div class="product_detail_desc">
                <div class="product_detal_container_main ">
                    <div v-for="basketItem in basketList" :data-basket_id="basketItem.id" class="basket_detal_container " data-type="0" :data-price="basketItem.product.sale_price">
                        <div class="product_header">
                            <div class="product_image_cont"><img :src="basketItem.product.product_image" alt=""></div>
                        </div>
                        <div class="product_detail_cont">
                            <div class="basket_detail_title">{{basketItem.product.title}}</div>
                            <div class="basket_detail_company">{{basketItem.company.name}}</div>
                            <div class="basket_detail_price_cont">
                                <span class="basket_detail_sale_price">{{basketItem.product.sale_price | toCurrency}}원</span>
                                <span class="product_count">/{{basketItem.count}}개</span>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="order_block">
                    <form class="order_form" id="order_form">
                        <div class="shopping_delimeter_order"></div>
                        <div class="bayer_information_block" style=""> 
                            <!--<div class="row">-->
                            <div class="shopping_title shopping_title_order">
                                주문자정보 
                            </div>
                            <!--</div>-->  
                            <div class="form-group row ">
                                <label for="inputEmail3" class="col-xs-3 col-form-label order_label">*이름</label>
                                <div class="col-xs-9">
                                    <b-form-input type="text" 
                                                  v-model='orderForm.receiverNameOriginal'
                                                  class="form-control  receiver_name_original" 
                                                  id="inputEmail3" 
                                                  required=""
                                                  name="receiver_name_original" 
                                                  :state="validation.validReceiverNameOriginal"
                                                  data-parsley-trigger="focusout"
                                                  placeholder="" value="">
                                    </b-form-input>

                                    <!--<b-form-invalid-feedback :state="validation.validReceiverNameOriginal">업태를 입력하세요.</b-form-invalid-feedback>-->
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="phone_original" class="col-xs-3 col-form-label order_label">*휴대폰</label>

                                <div class="col-xs-9">
                                    <!--                                        <input type="number"
                                                                                   oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                                                   maxlength = "3"
                                                                                   required=""
                                                                                   v-model='orderForm.receiverPhoneOriginal1'
                                                                                   class="form-control receiver_phone receiver_phone_original_1" id="phone_original" placeholder="" value="" name="receiver_phone_original_1">-->
                                    <b-form-input type="number"
                                                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                  maxlength = "3"
                                                  required=""
                                                  v-model='orderForm.receiverPhoneOriginal1'
                                                  :state="validation.validReceiverPhoneOriginal1"
                                                  class="form-control receiver_phone receiver_phone_original_1" id="phone_original" placeholder="" value="" name="receiver_phone_original_1">
                                    </b-form-input>
                                    <div class="phone_delimeter">-</div>
                                    <b-form-input type="number"
                                                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                  maxlength = "4"
                                                  required=""
                                                  v-model='orderForm.receiverPhoneOriginal2'
                                                  :state="validation.validReceiverPhoneOriginal2"
                                                  class="form-control receiver_phone receiver_phone_original_2" id="" placeholder="" value="" name="receiver_phone_original_2">
                                    </b-form-input>
                                    <div class="phone_delimeter">-</div>
                                    <b-form-input type="number"
                                                  required=""
                                                  maxlength = "4"
                                                  v-model='orderForm.receiverPhoneOriginal3'
                                                  :state="validation.validReceiverPhoneOriginal3"
                                                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                  class="form-control receiver_phone receiver_phone_original_3" id="" placeholder="" value="" name="receiver_phone_original_3">
                                    </b-form-input>
                                </div>
                            </div>

                            <div class="form-group row password_row" v-show='orderForm.passwordRow'>
                                <label for="inputEmail3" class="col-xs-3 col-form-label order_label">*비밀번호</label>
                                <div class="col-xs-9">
                                    <b-form-input type="password" 
                                                  class="form-control receiver_password_original password" 
                                                  v-model='orderForm.receiverPasswordOriginal'
                                                  :state="validation.validRreceiverPasswordOriginal"
                                                  id="inputEmail3" 
                                                  name="password" 
                                                  data-parsley-trigger="focusout"
                                                  placeholder="" value="">
                                    </b-form-input>
                                </div>
                            </div>

                            <div class="form-group row password_row_check" v-show='orderForm.passwordRowCheck'>
                                <label for="inputEmail3" class="col-xs-3 col-form-label order_label">*비밀번호<br>확인</label>
                                <div class="col-xs-9">
                                    <b-form-input type="password" 
                                                  class="form-control receiver_password_conf_original password_check" 
                                                  v-model='orderForm.receiverPasswordConfOriginal'
                                                  :state="validation.validIsReqReceiverPasswordConfOriginal"
                                                  id="inputEmail3" 
                                                  name="password_check" 
                                                  data-parsley-trigger="focusout"
                                                  placeholder="" value="">
                                    </b-form-input>
                                </div>
                            </div>

                            <!--                                        <div class="form-group row">
                                                                        <label for="inputPassword3" class="col-xs-3 col-form-label order_label">이메일</label>
                                                                        <div class="col-xs-9">
                                                                            <input type="text" class="form-control receiver_email_original"  id="inputPassword3" placeholder="" value="">
                                                                        </div>
                                                                    </div>-->
                        </div>


                        <div class="shipping_information_block"> 

                            <!--<div class="row">-->
                            <div class="shopping_title shopping_title_order">
                                배송지 정보 
                            </div>
                            <!--</div>-->
                        </div>

                        <div class="form-check copy_user_data_form_check" v-show='orderForm.copyUserDataFormCheck'>
                            <label>
                                <input type="checkbox" name="check"  class="copy_user_data" @click='copyUserData'><span class="label-text needsclick">주문자 정보와 동일</span>
                            </label>
                        </div>

                        <div class="form-group row">
                            <label for="receiver_name" class="col-xs-3 col-form-label order_label">*이 름</label>
                            <div class="col-xs-9">
                                <b-form-input type="text" name="receiver_name" v-model='orderForm.receiverName' :state="validation.validReceiverName" class="form-control"></b-form-input>
                            </div>
                        </div>

                        <div class="form-group row">


                            <label for="inputPassword3" class="col-xs-3 col-form-label order_label">*휴대폰</label>
                            <div class="col-xs-9">
                                <b-form-input type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="3" minlength="3" required="" v-model='orderForm.receiverPhone1' :state="validation.validReceiverPhone1" class="form-control receiver_phone receiver_phone_1" id="inputPassword3" placeholder="" value="" name="receiver_phone_1"></b-form-input><div class="phone_delimeter">-</div>
                                <b-form-input type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="4" minlength="4" required="" v-model='orderForm.receiverPhone2' :state="validation.validReceiverPhone2" class="form-control receiver_phone receiver_phone_2" id="" placeholder="" value="" name="receiver_phone_2"></b-form-input><div class="phone_delimeter">-</div>
                                <b-form-input type="number" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="4" minlength="4" required="" v-model='orderForm.receiverPhone3' :state="validation.validReceiverPhone3" class="form-control receiver_phone receiver_phone_3" id="" placeholder="" value=""  name="receiver_phone_3"></b-form-input>
                            </div>
                        </div>

                        <div class="clearfix"></div>
                        <div class="col-xs-12 col-md-12" style="position: relative;">
                            <div class="row">
                                <div id="address_search" v-show='orderForm.isShowAddressSearch' style="border:1px solid;width:100%;min-height:500px;margin:5px 0;position:relative">
                                    <span href=""  class="address_search_close" @click='addressSearchClose' style="position: absolute;cursor:pointer;right:0;top:-1px;z-index:10000" ><img src="./static/images/close.png"  alt="접기 버튼"></span>
                                </div>
                            </div>
                        </div> 
                        <div class="form-group row">
                            <label for="inputPassword3" class="col-xs-3 col-form-label order_label">배송지</label>
                            <div class="col-xs-9">

                                <ul class="receiver_address_ul">

                                    <li class="receiver_address_li">

                                    <b-form-input type="text" class="form-control post_code" v-model='orderForm.postCode' :state="validation.validPostCode" disabled="" id="" placeholder="" required="" value="" name="post_code"></b-form-input><span  @click='addressSearch' class="btn btn-default search_address">주소검색</span> 
                                    </li>
                                    <li class="receiver_address_li address">
                                    <b-form-input type="text" class="form-control" v-model='orderForm.address' :state="validation.validAddress" id="" disabled="" placeholder=""  required="" value="" name="address"></b-form-input>
                                    </li>
                                    <li class="receiver_address_li">
                                    <b-form-input type="text" class="form-control" v-model='orderForm.addressDetail' :state="validation.validAddressDetail" id="" placeholder="상세 주소를 입력하세요" required="" value="" name="address_detail"></b-form-input>
                                    </li>

                                </ul>
                            </div>

                            <label for="description" class="col-xs-3 col-form-label order_label">*배송<br>요청사항</label>
                            <div class="col-xs-9">
                                <b-form-textarea name="description" class="form-control description" v-model='orderForm.description' :state="validation.validDescription" id="description" placeholder=""></b-form-textarea> 
                            </div>

                        </div>
                    </form>
                </div>
            </div>



            <div class="product_detail_control" v-bind:class="[isSticky ? stickyClass : '']">
                <div class="deliverry_total_price_cont">총 상품금액 <span class="total_price">{{totalPrice | toCurrency}}원</span></div>
                <div class="deliverry_total_price_cont">배송비 <span class="delivery_price">{{deliveryPrice | toCurrency}}원</span></div>
                <div class="poduct_detail_delimeter"></div>
                <div class="deliverry_total_price_cont">전체주문금액 <span class="total_price_with_delivery">{{totalPriceWithDelivery | toCurrency}}원</span></div>
                <div class="clearfix"></div>
                <div class="shop_btn_control_panel">
                    <span class="my_btn btn-primary make_order go_to_order_page" @click='makeOrder' >결제하기</span>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>

</template>

<script>

    module.exports = {
        name: 'product_detail',
        data: function () {
            return  {
//                shopingMenuID: this.$route.query.productId,
                productId: this.$route.query.product_id,
                appId: 1,
                totalPrice: 0,
                deliveryPrice: 0,
                totalPriceWithDelivery: 0,
                menuId: 0,
                quantity: 0,
                eventData: "",
                isLogin: false,
                lastBtnClick: "",
                orderForm: {
                    receiverNameOriginal: "",
                    receiverEmailOriginal: "",
                    receiverPhoneOriginal1: "",
                    receiverPhoneOriginal2: "",
                    receiverPhoneOriginal3: "",
                    receiverPasswordOriginal: "",
                    receiverPasswordConfOriginal: "",
                    receiverName: "",
                    receiverPhone1: "",
                    receiverPhone2: "",
                    receiverPhone3: "",
                    postCode: "",
                    address: "",
                    addressDetail: "",
                    password: "",
                    copyUserDataFormCheck: false,
                    bayerInformationBlock: false,
                    passwordRowCheck: false,
                    passwordRow: false,
                    isReqReceiverPasswordOriginal: false,
                    isReqReceiverPasswordConfOriginal: false,
                    isShowAddressSearch: false,
                    description: "",
                },
                isSticky: false,
                stickyClass: 'is_sticky',
                scrollPosition: 0,
                guestNumber: "",
                basketList: [],
            }
        },
        computed: {
            validation: function () {

                let validReceiverNameOriginal = this.orderForm.receiverNameOriginal ? true : false;
                let validReceiverPhoneOriginal1 = this.orderForm.receiverPhoneOriginal1 && this.orderForm.receiverPhoneOriginal1.length >= 3 ? true : false;
                let validReceiverPhoneOriginal2 = this.orderForm.receiverPhoneOriginal2 && this.orderForm.receiverPhoneOriginal2.length >= 4 ? true : false;
                let validReceiverPhoneOriginal3 = this.orderForm.receiverPhoneOriginal3 && this.orderForm.receiverPhoneOriginal3.length >= 4 ? true : false;
                let validRreceiverPasswordOriginal = this.orderForm.receiverPasswordOriginal ? true : false;
                let validIsReqReceiverPasswordConfOriginal = this.orderForm.receiverPasswordConfOriginal ? true : false;
                let validReceiverName = this.orderForm.receiverName ? true : false;
                let validReceiverPhone1 = this.orderForm.receiverPhone1 && this.orderForm.receiverPhone1.length >= 3 ? true : false;
                let validReceiverPhone2 = this.orderForm.receiverPhone2 && this.orderForm.receiverPhone2.length >= 4 ? true : false;
                let validReceiverPhone3 = this.orderForm.receiverPhone3 && this.orderForm.receiverPhone3.length >= 4 ? true : false;
                let validPostCode = this.orderForm.postCode ? true : false;
                let validAddress = this.orderForm.address ? true : false;
                let validAddressDetail = this.orderForm.addressDetail ? true : false;
                let validDescription = this.orderForm.description ? true : false;

                return {
                    validReceiverNameOriginal,
                    validReceiverPhoneOriginal1,
                    validReceiverPhoneOriginal2,
                    validReceiverPhoneOriginal3,
                    validRreceiverPasswordOriginal,
                    validIsReqReceiverPasswordConfOriginal,
                    validReceiverName,
                    validReceiverPhone1,
                    validReceiverPhone2,
                    validReceiverPhone3,
                    validPostCode,
                    validAddress,
                    validAddressDetail,
                    validDescription,

                }
            }
        },

        mounted: function () {
            this.$nextTick(async function () {
                this.api_url = this.$store.getters.api_url;
                this.setMenuId();
                this.getUserInfo();
                this.daumPostInit();

                window.addEventListener('scroll', this.handleScroll);
                //                this.setProductDetail();
//                this.setEvetnIDByMenu();
//                this.setProductList();
            })
        },

        methods: {
            getUserInfo: async function () {
                let rs = await axios.get(`${this.api_url}/user/info`);
                let code = rs.data.code;

                if (code == 200) {
                    this.isLogin = true;
                    let user_data = rs.data.result;
                    var phone = user_data.phone;

                    var phone_1 = phone.substring(0, 3);
                    var phone_2 = phone.substring(3, 7);
                    var phone_3 = phone.substring(7, 12);

                    this.orderForm.receiverNameOriginal = user_data.name;
                    this.orderForm.receiverEmailOriginal = user_data.email;
                    this.orderForm.receiverPhoneOriginal1 = phone_1;
                    this.orderForm.receiverPhoneOriginal2 = phone_2;
                    this.orderForm.receiverPhoneOriginal3 = phone_3;




                } else {

                    this.orderForm.copyUserDataFormCheck = true;
                    this.orderForm.bayerInformationBlock = true;
                    this.orderForm.passwordRow = true;
                    this.orderForm.passwordRowCheck = true;


                    this.setGuestNumber();
                }

                this.setBasketList();
            },
            isFormValid: function () {
                return this.validation.validReceiverNameOriginal && this.validation.validReceiverPhoneOriginal1 && this.validation.validReceiverPhoneOriginal2 && this.validation.validReceiverPhoneOriginal3
                        && this.validation.validRreceiverPasswordOriginal && this.validation.validIsReqReceiverPasswordConfOriginal && this.validation.validReceiverName && this.validation.validReceiverPhone1 && this.validation.validReceiverPhone2
                        && this.validation.validReceiverPhone3 && this.validation.validPostCode && this.validation.validPostCode && this.validation.validAddress && this.validation.validAddress && this.validation.validAddressDetail && this.validation.validDescription;
            },

            setMenuId: async function () {
                this.menuId = this.$route.query.menu_id
            },
            setGuestNumber: async function () {
                if (localStorage.getItem("guestNumber") === null) {
                    localStorage.setItem('guestNumber', ['guest', Math.floor(Math.random() * 0x10000).toString(16)].join(''));
                }
                this.guestNumber = localStorage.getItem("guestNumber");
            },
            setMenuId: async function () {
                this.menuId = this.$route.query.menu_id
            },
            handleScroll: async function () {
                this.scrollPosition = window.scrollY
                if (this.scrollPosition >= 100) {
                    this.isSticky = true
                } else {
                    this.isSticky = false
                }


            },
            setBasketList: async function () {

                var data = {};
                data['menu_id'] = this.menuId;

                if (!this.isLogin)
                    data['guest_number'] = this.guestNumber;

                let rs = await axios.get(`${this.api_url}/basket`, {"params": data});
                let baskets = rs.data.result;


                this.deliveryPrice = rs.data.result[0].company.delivery_price;
                var total_price = 0;
                var basket_array = [];
                baskets.map(function (val, key) {
                    var product = val.product;
                    var company = val.company;
                    total_price += product.sale_price;

                    basket_array.push(val)
                });
                this.totalPrice = total_price;
                this.basketList = basket_array;

                this.totalPriceWithDelivery = this.totalPrice + this.deliveryPrice;

            },
            deleteBasketItem: async function (basketItem) {

                this.$dialog.confirm("삭제하게셌습니까?", {
                    okText: '삭제',
                    cancelText: '닫기',
//                                loader: true // default: false - when set to true, the proceed button shows a loader when clicked.
                    // And a dialog object will be passed to the then() callback
                }).then(dialog => {
                    this.basketDeleteHandler(basketItem);
                }).catch(() => {
                    // Triggered when cancel button is clicked
                    console.log('Delete aborted');
                });


            },
            basketDeleteHandler: async function (basketItem) {

                var data = {};
                if (!this.isLogin)
                    data['guest_number'] = guestNumber;

                let rs = await axios.delete(`${this.api_url}/basket/${basketItem.id}`);
                let baskets = rs.data.result;


                let code = rs.data.code;
                if (code != 200) {
                    alert("API Error")
                    return;
                }

                var new_basket_array = [];

                this.basketList.map(function (val, key) {
                    if (val !== basketItem)
                        new_basket_array.push(val);

                });

                this.basketList = new_basket_array;

                this.refreshPrice();
            },
            daumPostInit: function () {
                let element_wrap = document.getElementById('address_search');
                let th = this;
                new daum.Postcode({
                    oncomplete: function (data) {
                        th.searchAddressResultHandler(data)
                        th.daumPostInit()

                    },
                    onresize: function (size) {
                        element_wrap.style.height = size.height + 'px';
                    },
                    width: '100%',
                    height: '100%',
                    hideMapBtnL: true
                }).embed(element_wrap);

            },
            addressSearch: function () {
                this.orderForm.isShowAddressSearch = true;
            },
            addressSearchClose: function () {
                this.orderForm.isShowAddressSearch = false;
            },
            copyUserData: function () {
                this.orderForm.receiverName = this.orderForm.receiverNameOriginal;
                this.orderForm.receiverPhone1 = this.orderForm.receiverPhoneOriginal1;
                this.orderForm.receiverPhone2 = this.orderForm.receiverPhoneOriginal2;
                this.orderForm.receiverPhone3 = this.orderForm.receiverPhoneOriginal3;
            },
            searchAddressResultHandler: function (data) {
                this.orderForm.postCode = data.zonecode;
                this.orderForm.address = data.roadAddress;
                this.orderForm.isShowAddressSearch = false;
                this.orderForm.addressDetail = "";

            },
            makeOrder: async  function () {

                if (this.isLogin) {
                    this.validation.validRreceiverPasswordOriginal = true;          // remove validation inspect from password field
                    this.validation.validIsReqReceiverPasswordConfOriginal = true;
                }

                if (!this.isFormValid()) {                                // Check is validation
                    alert("주문자정보와 배송지정보를 확인해주세요.")
                    return;
                }


                var data = {};

                var user_phone = this.orderForm.receiverPhoneOriginal1 + this.orderForm.receiverPhoneOriginal2 + this.orderForm.receiverPhoneOriginal3;
                var recepient_phone = this.orderForm.receiverPhone1 + this.orderForm.receiverPhone2 + this.orderForm.receiverPhone3;



                Vue.use(VuejsDialog, {
                    html: true,
                    loader: true,
                    okText: 'Pro112121ceed',
                    cancelText: 'Cancel',
                    animation: 'bounce'
                });

                if (this.orderForm.receiverPasswordOriginal != this.orderForm.receiverPasswordConfOriginal) {

//                    this.$dialog.alert({
//                        title: 'Server overheating',
//                        text: 'Please add an ice or something',
//                        icon: 'warning',
//                        okText: 'googd',
//                        // variant: 'my-alert',
//                        // ...More props
//                    }).then((result) => {
//                        console.log(result)
//                    })

//                    this.$dialog.alert('Please check password!').then(function (dialog) {
//                    });

                    alert("Please check password")
                    return false;
                }

                if (!this.isLogin)
                    data["guest_number"] = this.guestNumber;

                data["menu_id"] = this.menuId;
                data["user_name"] = this.orderForm.receiverNameOriginal;
                data["user_phone"] = user_phone;
                data["recipient"] = this.orderForm.receiverName;
                data["recipient_phone"] = recepient_phone;
                data["recipient_zip"] = this.orderForm.postCode;
                data["recipient_address"] = this.orderForm.address;
                data["recipient_address_detail"] = this.orderForm.addressDetail;
                data["recipient_request"] = this.orderForm.description;


                let rs = await axios.post(`${this.api_url}/order`, data);

                let code = rs.data.code;
                let response = rs.data.result;


                if (code != 200) {
                    alert("API Error")
                    return;
                }

                if (typeof (response) != "undefined" && response !== null) {
                    this.eventData = response;

                    let order_id = response.id;
                    window.location.href = "/shopping/main.html#/order_result_page?order_id=" + order_id;
                }

                console.log(data)
            },

        }
    }
</script>
