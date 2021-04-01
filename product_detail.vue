<template>
    <div class="wrap_flex_main js-main pc-w-mini">


        <div class="alert_cont">
            *주문하신 상품 및 배송관련 문의는 판매자에 직접 해주세요.
            *본 사이트에서 판매되는 상품의 품질 및 배송 등은 이벤트 준비/운영사무국과는 관계가 없음을 알려드립니다. 또한, 주문하신 상품은 이벤트사이트 운영 기간 전후로 한시적으로 판매되는 것으로 상품의 품질 및 배송관련 발생할 수 있는 각종 분쟁관련 사항은 오로지 판매자와 구매자사이에서 해결해야합니다.

        </div>

        <div class="product_detal_container" data-type="0">
            <div class="product_header">
                <div class="product_image_cont"><img :src="productData.product_image" alt=""></div>
            </div>
            <div class="product_detail_cont">
                <div class="product_detail_title">{{productData.title}}</div>
                <div class="product_detail_company">{{productData.company_name}}</div>
                <div class="product_detail_price_cont">
                    <span class="product_detail_sale_proc">{{productData.sale_proc}}</span>
                    <span class="product_detail_sale_price"> {{ productData.sale_price | toCurrency }}원</span>
                    <span class="product_detail_price">{{productData.price | toCurrency}}원</span>
                </div>
            </div>
        </div>

        <div class="clearfix"></div>
        <div class="poduct_detail_delimeter"></div>


        <div>
            <b-modal id="modal-center" centered title="" v-model="modalShow" hide-footer hide-header>
                <div class="product_login_block" v-show="isShowLoginParts">
                    <h1>개인회운 로그인<span class="btn-x js-hidePop"></span></h1>
                    <input type="text" class="login shoping_input" v-model="login" placeholder="아이디(이메일)">    
                    <input type="password" class="password shoping_input" v-model="password" placeholder="비밀번호">   
                </div>

                <div class="ex_sd_btns">
                    <button class="" v-show="isShowLoginParts" @click="makeLogin" id="loginBtn">로그인</button><br>
                    <button class="buy_by_not_logged" @click="goToOrderPage">비회원으로 구매하기</button>
                    <button class="js-hidePop" @click="hidePopup">닫기<br><span>Close</span></button>
                </div>
            </b-modal>
        </div>


        <div class="product_detail_desc">
            <img :src="productData.product_image" alt="" class="desc_img">
        </div>
        <div class="product_detail_control">
            <div class="detail_cont_title">수량</div>
            <input type='button' value='-' class='qtyminus' field='quantity' @click="minusProductQuant" />
            <input type='text' name='quantity'   v-model="quantity"  class='qty quantity' />
            <input type='button' value='+' class='qtyplus' field='quantity' @click="plusProductQuant" />
            <span class="my_btn btn-primary calculate_price" @click="calculatePrice">선택</span>


            <div class="total_price_cont">총 상품금액 <span class="total_price" v-show="productData.total_price > 0">{{productData.total_price | toCurrency}}원</span></div>
            <div class="clearfix"></div>
            <div class="shop_btn_control_panel">
                <span class="my_btn btn-primary check_allow_basket" @click="checkAllowBasket">장바구니</span>
                <span class="my_btn btn-primary check_allow_order" @click="checkAllowOrder">구매하기</span>
            </div>
        </div>
        <div class="clearfix"></div>

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
                productSalePrice: 0,
                menuId: 0,
                quantity: 0,
                eventData: "",
                isLogin: false,
                isShowByNotLogedPopUp: false,
                modalShow: false,
                isShowLoginParts: true,
                lastBtnClick: "",
                login: "",
                password: "",
                guestNumber: "",
                eventData: [],
                productData: {
                    "product_image": "",
                    "title": "",
                    "company_name": "",
                    "sale_proc": "",
                    "sale_price": "",
                    "price": "",
                    "product_image": "",
                    "total_price": 0,
                }
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.api_url = this.$store.getters.api_url;
                this.getUserInfo();
                this.setProductDetail();
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
                } else {
                    this.setGuestNumber();
                }
            },
            setGuestNumber: async function () {
                if (localStorage.getItem("guestNumber") === null) {
                    localStorage.setItem('guestNumber', ['guest', Math.floor(Math.random() * 0x10000).toString(16)].join(''));
                }
                this.guestNumber = localStorage.getItem("guestNumber");
            },
            setProductDetail: async function () {
                let rs = await axios.get(`${this.api_url}/product/${this.productId}`);
                let product_data = rs.data.result;
                this.productData.product_image = product_data.product_image;
                this.productData.title = product_data.title;
                this.productData.company_name = product_data.company_name;
                this.productData.sale_proc = product_data.sale_proc;
                this.productData.sale_price = product_data.sale_price;
                this.productData.price = product_data.price;
                this.productData.product_image = product_data.product_image;
                this.menuId = product_data.menu_id;
                this.getMenuData();

            },
            plusProductQuant: async function () {
                this.quantity++;
            },
            minusProductQuant: async function () {
                if (this.quantity > 0)
                    this.quantity--;
            },
            calculatePrice: async function () {

                if (this.quantity == 0) {
                    alert("수량을 선택해주세요");
                    return false;
                }
                this.productData.total_price = parseInt(this.quantity) * parseInt(this.productData.sale_price);

            },
            getMenuData: async function () {

                let rs = await axios.get(`${this.api_url}/menu/${this.menuId}`);
                let code = rs.data.code;
                let response = rs.data.result;

                if (typeof (response) != "undefined" && response !== null) {
                    this.eventID = response.event_id;
                    this.getEventByID();
                }

            },
            getEventByID: async function () {

                let rs = await axios.get(`${this.api_url}/event/${this.eventID}/show_event_for_guest`);
                let code = rs.data.code;
                let response = rs.data.result;

                if (typeof (response) != "undefined" && response !== null) {
                    this.eventData = response;
                }
            },
            checkAllowBasket: function () {

                if (this.productData.total_price == 0) {
                    alert("선댁 해 주세요")
                    return false;
                }

                if (!this.isLogin && this.eventData.is_login == 1) {

                    this.$dialog
                            .confirm("로그인 후 이용해주세요", {
                                okText: '로그인',
                                cancelText: '닫기',
//                                loader: true // default: false - when set to true, the proceed button shows a loader when clicked.
                                // And a dialog object will be passed to the then() callback
                            })
                            .then(dialog => {
                                // Triggered when proceed button is clicked
                                this.showPopup("basket");
                            })
                            .catch(() => {
                                // Triggered when cancel button is clicked
                                console.log('Delete aborted');
                            });


                } else {
                    this.addToBasket("basket");
                }
            },

            showPopup: function (type) {

                if (type == "basket") {
                    this.isShowByNotLogedPopUp = true;
                    this.isShowLoginParts = true;
//                    $(".buy_by_not_logged").css("display", "none");
                } else {
                    this.isShowByNotLogedPopUp = true;
                    this.isShowLoginParts = false;
//                    $(".buy_by_not_logged").css("display", "block");
//                    $(".product_login_block").css("display", "none");
//                    $("#loginBtn").css("display", "none");
                }
                this.modalShow = true;
//                alert(this.isShowByNotLogedPopUp)

                this.lastBtnClick = type;

//                this.showPopup('payment')
            },

            addToBasket: async function (type = "basket") {


                var data = {};

                if (!this.isLogin)
                    data["guest_number"] = this.guestNumber;

                data["menu_id"] = this.menuId;
                data["product_id"] = this.productId;
                data["count"] = this.quantity;



                let rs = await axios.post(`${this.api_url}/basket`, data);
                let code = rs.data.code;
                let response = rs.data.result;

                if (code == 413) {
                    alert("배송비 등의 이유로 동일 매장의 상품만 한 장바구니에 담을 수 있습니다")
                    this.modalShow = false;
                    return;
                }

                if (code != 200) {
                    alert("API error")
                    return;
                }


                if (type == 'order') {

                    window.location.href = "/shopping/main.html#/order?menu_id=" + this.menuId;
                } else {
                    if (typeof (response) != "undefined" && response !== null) {


                        this.$dialog
                                .confirm("장바구니에 상품을 담았습니다", {
                                    okText: '계속쇼핑',
                                    cancelText: '장바구니로',
//                                loader: true // default: false - when set to true, the proceed button shows a loader when clicked.
                                    // And a dialog object will be passed to the then() callback
                                })
                                .then(dialog => {
                                    this.productData.total_price = 0;
                                    this.quantity = 0;
                                })
                                .catch(() => {
                                    window.location.href = "/shopping/main.html#/basket?menu_id=" + this.menuId;
                                });


                    }
            }
            },
            makeLogin: async function (type) {

                var data = {};

                data["app_id"] = this.appId;
                data["email"] = this.login;
                data["password"] = this.password;


                let rs = await axios.post(`${this.api_url}/auth/login`, data);
                let code = rs.data.code;
                let response = rs.data.result;

                if (code == 401) {
                    alert("Attemp error")
                    return;
                }

                if (code != 200) {
                    alert("API error")
                    return;
                }


                this.isLogin = true;

                if (typeof (response) != "undefined" && response !== null) {

                    this.isShowByNotLogedPopUp = false;
                    if (this.lastBtnClick == "payment") {
                        this.checkAllowOrder();
                    } else {
                        this.checkAllowBasket();
                    }

                }
            },
            checkAllowOrder: function (type) {

                if (this.productData.total_price == 0) {
                    alert("선댁 해 주세요")
                    return false;
                }


                if (!this.isLogin && this.eventData.is_login == 1) {
                    this.showPopup('payment')
                    return false;
                } else {
                    this.goToOrderPage();
                }
            },
            goToOrderPage: function (type) {
                this.addToBasket('order');
            },
            hidePopup: function (type) {
                this.modalShow = false;
            },

        }
    }
</script>
