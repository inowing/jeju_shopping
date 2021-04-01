Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        event_id: 105,
        api_url: 'http://14.63.172.119/api/v1',
        selected_item: null,
        logo_url: ''
    },
    getters: {
        // usage
        // this.$store.getters.selected_item
        event_id: function (state) {
            return state.event_id;
        },
        api_url: function (state) {
            return state.api_url;
        },
        logo_url: function (state) {
            return state.logo_url;
        },
        selected_item: function (state) {
            return state.selected_item;
        }
    },
//    mutations: {
//        // usage
//        // this.$store.commit('increment', {key: '', value: ''})
//        event_id(state, payload) {
//            console.log('mutation', payload);
//            state.event_id = payload.event_id;
//        },
//        logo_url(state, payload) {
//            state.logo_url = payload;
//        },
//        selected_item(state, payload) {
//            console.log('selected_item set... ', payload);
//            state.selected_item = payload;
//        }
//    },
//    actions: {
//        // usage
//        // this.$store.dispatch('increment', {key:'', value:''});
//        async actionA ({ commit }) {
//            // commit('increment', await sometingAPI())
//        },
//        async increment(context) { // ({dispatch, commit})
//            await context.dispatch('actionA') // wait for `actionA` to finish
//            context.commit('increment')
//        }
//    }
})