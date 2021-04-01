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
                        <span class="remove_product_from_basket" @click='deleteBasketItem(basketItem)' :data-id="basketItem.id">x</span>
                    </div>


                </div>
            </div>

            <div class="product_detail_control" v-bind:class="[isSticky ? stickyClass : '']">


                <div class="deliverry_total_price_cont">총 상품금액 <span class="total_price">{{totalPrice | toCurrency}}원</span></div>
                <div class="deliverry_total_price_cont">배송비 <span class="delivery_price">{{deliveryPrice | toCurrency}}원</span></div>
                <div class="poduct_detail_delimeter"></div>
                <div class="deliverry_total_price_cont">전체주문금액 <span class="total_price_with_delivery">{{totalPriceWithDelivery | toCurrency}}원</span></div>
                <div class="clearfix"></div>
                <div class="shop_btn_control_panel">
                    <span class="my_btn btn-primary make_order go_to_order_page" @click='goToOrderPage'>결제하기</span>
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
                isShowByNotLogedBtn: false,
                lastBtnClick: "",
                login: "",
                password: "",
                guestNumber: "",
                isSticky: false,
                stickyClass: 'is_sticky',
//                eventData: [],
                basketList: [],
//                productData: {
//                    "product_image": "",
//                    "title": "",
//                    "company_name": "",
//                    "sale_proc": "",
//                    "sale_price": "",
//                    "price": "",
//                    "product_image": "",
//                    "total_price": 0,
//                }
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.api_url = this.$store.getters.api_url;
                this.setMenuId();
                this.getUserInfo();
//                this.setProductDetail();
//                this.setEvetnIDByMenu();
//                this.setProductList();
            })

            window.addEventListener('scroll', this.handleScroll);
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

                this.setBasketList();
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
            setGuestNumber: async function () {
                if (localStorage.getItem("guestNumber") === null) {
                    localStorage.setItem('guestNumber', ['guest', Math.floor(Math.random() * 0x10000).toString(16)].join(''));
                }
                this.guestNumber = localStorage.getItem("guestNumber");
            },
            setBasketList: async function () {
                let rs = await axios.get(`${this.api_url}/basket?menu_id=${this.menuId}`);
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
            refreshPrice: function () {

                this.deliveryPrice = this.basketList[0].company.delivery_price;
                var total_price = 0;
                this.basketList.map(function (val, key) {
                    var product = val.product;
                    var company = val.company;
                    total_price += product.sale_price;
                });
                this.totalPrice = total_price;
                this.totalPriceWithDelivery = this.totalPrice + this.deliveryPrice;

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
            goToOrderPage: function (type) {
                window.location.href = "/shopping/main.html#/order?menu_id=" + this.menuId;
            },

        }
    }
</script>
