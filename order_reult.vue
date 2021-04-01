<template>
    <div class="wrap_flex_main js-main pc-w-mini">

        <div class="main ">

            <div class="alert_cont">
                판매되는 것으로 상품의 품질 및 배송관련 발생할 수 있는 각종 분쟁관련 사항은 오로지 판매자와 구매자사이에서 해결해야합니다*주문하신 상품 및 배송관련 문의는 판매자에 직접 해주세요.
                *본 사이트에서 판매되는 상품의 품질 및 배송 등은 이벤트 준비/운영사무국과는 관계가 없음을 알려드립니다. 또한, 주문하신 상품은 이벤트사이트 운영 기간 전후로 한시적으로 .


            </div>


            <div class="order_result_title">주문완료</div>

            <div class="order_result_block_1"><span class="address"></span> / <span class="order_user_name"></span></div>
            <div class="order_result_block_2">(으)로 보내실 주문이 완료되었습니다.</div>


            <div>
                <span class="my_btn btn-primary make_order ">닫기</span>
            </div>
        </div>
</template>
<script>


    module.exports = {
        name: 'product_detail',
        data: function () {
            return  {
                guestNumber: "",
                address: "",
                orderUserName: "",
                isLogin: false,
                orderId: this.$route.query.order_id,

            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.api_url = this.$store.getters.api_url;
                this.getUserInfo();
                this.setOrderDetail();
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
            setOrderDetail: async function () {
                let rs = await axios.get(`${this.api_url}/order/${this.orderId}`);
                let orderData = rs.data.result;
                this.address = orderData.address;
                this.orderUserName = orderData.recipient;

            },
        }
    }
</script>
