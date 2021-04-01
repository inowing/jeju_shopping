<template>
    <footer class="footer m0">
        <div class="pc-w">
            주최 : 보건복지부 / 주관 :사울시의사회<br>준비사무국: 02-1233-1234 , 1234@daum.net<br>서울시 서초구 방배천로 111-23
        </div>
    </footer>
</template>

<script>
    module.exports = {
        name: 'shop_footer',
        data: function () {
            return {
                routePath: '/',
                classObject: {
                    // https://getbootstrap.com/docs/4.5/utilities/text/
                    'text-danger': true,
                    'font-weight-bolder': true
                },
                active_parent_menu: {
                    'active': true,
                    'font-weight-bolder': true,
                    'text-align': 'left'
                }
            }
        },
        watch: {
            $route: function (to, from) {
                this.routePath = to.path;
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                // this.routePath = this.$route.path;	// 네비게이션의 패스 감지용
                this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
                    // console.log('collapseId:', collapseId)
                    // console.log('isJustShown:', isJustShown)
                }); // 네비게이션 클릭 감지
            })
        },
        methods: {
            visibleHandler: function (isVisible) {
                if (isVisible) {
                    // console.log('open');
                    // Do something
                } else {
                    // console.log('close');
                    // Do something else
                }
            }
        }
    }
</script>
