<template>
    <div class="wrap_flex_main js-main pc-w1000">
        <div class="exhibition_wrap">
            <div class="search_wrap">
                <div class=" search_container">
                    <input id="searchQuery" type="text" v-model="searchKey" placeholder="Search">

                    <button id="searchBtn" class="btn-search" @click="makeProductSearch">검색</button>
                    <button class="btn-d_search js-pop_show js-d_search" @click="setShowPopup" data-page="exhibition_search_d">상세검색</button>
                </div>
                <div class="txt-r basket_icon_cont">
                    <div class='basket_block' @click='goToBasketPage'>
                        <span  class="product_in_basket_count">{{productInBasketCount}}</span>
                        <img class="basket_icon" src='./static/images/basket_icon.png'>
                    </div>
                    <button class="my_btn "  data-page="exhibition_search_d">주문내역 확인</button>
                </div>
            </div>

            <div class="clearfix"></div>
            <div class="product_container"  data-type="0">

                <a  v-for="product in productList" :href='"/shopping/main.html#/product_detail?product_id=" + product.id'>
                    <div class="product_item" :class=' product.is_sale == "1" ? "sale_product" : "normal_product"' :data-product_id='product.id'>
                        <div class='product_item_wrap'>

                            <div class='product_company_title'>
                                <div>{{product["name" + langPrefix]}}</div>

                                <div class='product_sale_text' v-if="product.is_sale == 1">(행사상품)</div>

                            </div>

                            <div class='product_bottom_cont'>
                                <div class='product_share_cont'><img src='./static/images/product_share_icon.png'></div>

                                <div class='product_main_image_cont'><img :src='product.product_image != "" ? product.product_image : "./static/images/no_image.png"'></div>

                                <div class='product_description_cont'>
                                    <div class='product_title'>{{product["title" + langPrefix]}}</div>
                                    <div class='product_phone'>{{product.phone}}</div>
                                    <div class='product_price_cont'>
                                        <span class='product_sale_proc'>{{Math.round((parseInt(product.price) - parseInt(product.sale_price)) * 100 / parseInt(product.price))}}%</span>
                                        <span class='product_sale_price'>  {{ product.sale_price | toCurrency }}원</span>
                                        <span class='product_price'>{{ product.price | toCurrency }}원</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </a>
            </div>

            <div class="js-pop_wrap">
                <div class="pop_bg" style="" v-show="searchPopupShowStatus">
                    <div class="pop_content_area ex_sd_wrap" style="">
                        <h1>맞춤검색<span class="btn-x js-hidePop"></span></h1>
                        <div class="ex_sd_guide">
                            <div>설정하신 모든 조건을 만족하는 결과를 검색해 보세요.</div>
                            <div>Search results that meet all the conditions you set.</div>
                        </div>
                        <div>
                            <div id="product_search_category">
                                <h2>
                                    <span class="icon">
                                        <img src="./static/images/product_search_category.png" alt="">
                                    </span>
                                    <span>카테고리 (Category)</span>
                                </h2>
                                <div class="location_wrap category_wrap">
                                    <div @click="categorySelectAllHandler" :class="isAllCategorySelected ? 'active' : '' " data-value="all"><span>전체</span>  <span>All</span>
                                    </div>

                                    <div  @click="categoryClickHandler(productCategory.id, $event, index)" :class="productCategory.is_active ? 'active' : ''" v-for="(productCategory,index) in productCategories" 
                                           :key="productCategory.id"  :data-value="productCategory.id">{{productCategory.name}}
                                        <span>{{productCategory.name_en}} </span>
                                    </div>
                                </div>
                            </div>

                            <div id="product_search_company">
                                <h2>
                                    <span class="icon">
                                        <img src="./static/images/product_search_company.png" alt="">
                                    </span>
                                    <span>판매사 (Company)</span>
                                </h2>
                                <div class="location_wrap company_wrap">
                                    <div @click="companySelectAllHandler" :class="isAllCompanySelected ? 'active' : '' " data-value="all"><span>전체</span>  <span>All</span></div>
                                    <div class="" @click="companyClickHandler(productCompany.id, $event, index)" v-for="(productCompany,index) in productCompanies" 
                                         :class="productCompany.is_active ? 'active' : ''">{{productCompany.name}}<span>{{productCompany.name_en}}</span></div>
                                </div>
                            </div>

                            <div id="product_search_company">
                                <h2>
                                    <span class="icon">
                                        <img src="./static/images/product_sort.jpg" alt="">
                                    </span>
                                    <span>가격정렬 (Sorting)</span>
                                </h2>
                                <div class="location_wrap sorting_wrap" >
                                    <div v-for='(sortingTypeItem,index) in sortingTypeArray' :key='index' :class="sortingTypeItem.is_active ? 'active' : ''" 
                                         :data-value="sortingTypeItem.type" @click='sortingTypeHandler($event,index)'>
                                        {{sortingTypeItem.title}}<span>{{sortingTypeItem.title_en}}</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="ex_sd_btns">
                            <button class="js-pop-submit" id="detailSearch" @click='makeDetailedProductSearch'>검색<br><span>Search</span></button><br>
                            <button class="js-hidePop" @click="setHidePopup">닫기<br><span>Close</span></button>
                            <!--<button class="" id="resetBtn">초기화<br><span>Reset</span></button>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>



</template>

<script>


    module.exports = {
        name: 'product_list',
        data: function () {
            return  {
                shopingMenuID: 0,
                eventID: 0,
                productInBasketCount: 0,
                LANG_TYPE: "ko",
                searchKey: "",
                searchPopupShowStatus: false,
                isAllCategorySelected: true,
                isAllCompanySelected: true,
                langPrefix: this.LANG_TYPE == "ko" ? "" : "_en",
                productCategories: [],
                productCompanies: [],
                productList: [],
                sortingTypeArray: [
                    {"title": "전체", "title_en": "All", "is_active": true, 'type': "all"}
                    , {"title": "낮은 가격순", "title_en": "", "is_active": false, 'type': "price_asc"}
                    , {"title": "높은 가격순", "title_en": "", "is_active": false, 'type': "price_desc"}
                    , {"title": "판매량순", "title_en": "", "is_active": false, 'type': "sale_count"}
                ],
                selectedSortType: "all"
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.api_url = this.$store.getters.api_url;
                this.getList();
                this.setMenuId();
                this.setCategoryList();
                this.setEvetnIDByMenu();
                this.setProductList();
                this.getUserInfo();
            })
        },
        methods: {
            getList: async function () {

            },
            getUserInfo: async function () {
                let rs = await axios.get(`${this.api_url}/user/info`);
                let code = rs.data.code;

                if (code == 200) {
                    this.productInBasketCount = rs.data.result.basket_count;
                }

            },
            setCategoryList: async function () {
                let rs = await axios.get(`${this.api_url}/menucategory/topcategory?menu_id=${this.shopingMenuID}`);
                this.productCategories = rs.data.result;
            },
            setEvetnIDByMenu: async function () {
                let rs = await axios.get(`${this.api_url}/menu/${this.shopingMenuID}`);
                if (typeof (rs.data.result) != "undefined" && rs.data.result !== null) {
                    this.eventID = rs.data.result.event_id;
                }
                this.setCompanyList()
            },
            setCompanyList: async function () {
                let rs = await axios.get(`${this.api_url}/company?event_id=${this.eventID}`);
                if (typeof (rs.data.result) != "undefined" && rs.data.result !== null) {
                    this.productCompanies = rs.data.result;
                }
            },
            setProductList: async function (add_data) {
                let url = `${this.api_url}/product?menu_id=${this.shopingMenuID}`;
                let rs = await axios.get(url, {"params": add_data});
                if (typeof (rs.data.result) != "undefined" && rs.data.result !== null) {
                    this.productList = rs.data.result;
                }
            },
            setMenuId: async function () {
                this.shopingMenuID = this.$route.query.menu_id
            },
            setShowPopup: function () {
                this.searchPopupShowStatus = true;
            },
            setHidePopup: function () {
                this.searchPopupShowStatus = false;
            },
            categoryClickHandler: function (category_id, event, index) {

                this.isAllCategorySelected = false;
                if (this.productCategories[index].is_active == 1) {
                    this.$set(this.productCategories[index], 'is_active', 0)
                } else {
                    this.$set(this.productCategories[index], 'is_active', 1)
                }

            },
            companyClickHandler: function (category_id, event, index) {

                this.isAllCompanySelected = false;
                if (this.productCompanies[index].is_active == 1) {
                    this.$set(this.productCompanies[index], 'is_active', 0)
                } else {
                    this.$set(this.productCompanies[index], 'is_active', 1)
                }

            },
            categorySelectAllHandler: function () {

                let that = this;
                if (this.isAllCategorySelected == true) {
                    this.isAllCategorySelected = false;
                    this.productCategories.map(function (val, key) {
                        that.$set(that.productCategories[key], 'is_active', 1)
                    })

                } else {
                    this.isAllCategorySelected = true;
                    this.productCategories.map(function (val, key) {
                        that.$set(that.productCategories[key], 'is_active', 0)
                    })
                }
            },
            companySelectAllHandler: function () {

                let that = this;
                if (this.isAllCompanySelected == true) {
                    this.isAllCompanySelected = false;
                    this.productCompanies.map(function (val, key) {
                        that.$set(that.productCompanies[key], 'is_active', 1)
                    })

                } else {
                    this.isAllCompanySelected = true;
                    this.productCompanies.map(function (val, key) {
                        that.$set(that.productCompanies[key], 'is_active', 0)
                    })
                }
            },
            makeProductSearch: function () {
                let params = {};
                params["search_key"] = this.searchKey;

                this.setProductList(params);
            },
            sortingTypeHandler: function (event, number) {
                var that = this;

                if (this.sortingTypeArray[number].is_active == true) {
                    this.sortingTypeArray[number].is_active = false;
                    this.selectedSortType = "";
                } else {
                    this.sortingTypeArray.map(function (val, key) {
                        that.sortingTypeArray[key].is_active = false;
                    })
                    this.sortingTypeArray[number].is_active = true;

                    this.selectedSortType = this.sortingTypeArray[number].type;

                }
            },
            makeDetailedProductSearch: function () {
                let params = {};
//                ****** Category handler ******
                let slected_category_id = [];
                this.productCategories.map(function (val, key) {
                    if (val.is_active == 1)
                        slected_category_id.push(val.id);
                })

                if (slected_category_id.length > 0)
                    params["categories"] = slected_category_id;
//                ****** Category handler end ******

//                ****** Category handler ******
                let slected_company_id = [];
                this.productCompanies.map(function (val, key) {
                    if (val.is_active == 1)
                        slected_company_id.push(val.id);
                })

                if (slected_company_id.length > 0)
                    params["companies"] = slected_company_id;
//                ****** Category handler end ******


                params["sort_type"] = this.selectedSortType;
                this.setProductList(params);

                this.searchPopupShowStatus = false;                                 // Close popup
            },
            goToBasketPage: function () {
                window.location.href = "/shopping/main.html#/basket?menu_id=" + this.shopingMenuID;
            },
        }
    }
</script>
