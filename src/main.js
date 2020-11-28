import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import VueLocalStorage from 'vue-localstorage'
import Vuex from 'vuex'
import 'es6-promise/auto'
import VueAnalytics from 'vue-analytics';

Vue.use(VueAnalytics, {
  id: 'G-D1HBCY1M50'
});
Vue.config.productionTip = false
Vue.use(VueLocalStorage)
Vue.use(Vuex)

new Vue({
  localStorage: {
    obj: {
      type: Object,
      default: {
        update: '2020/01/01 10:00',
        path: '/images/',
        categories: [
          {
            index:1,
            name:'sampleCat1',
          },
          {
            index:2,
            name:'sampleCat2',
          }
        ],
        tags: [
          {
            index:1,
            name:'sampleTag1',
          },
          {
            index:2,
            name:'sampleTag2',
          },
          {
            index:3,
            name:'sampleTag3',
          }
        ],
        items: [
          {
            aid: 1,
            path:'/images/',
            created: '2020/01/01',
            updated: '2020/02/02',
            title: 'Sample Title1',
            description: 'Sample Description1',
            thumbnail: '/images/t1.jpg',
            category: 1,
            tag: [1,2],
            content: 'Sample Contents1'
          },
          {
            aid: 2,
            path:'/images/',
            created: '2020/01/02',
            updated: '2020/03/04',
            title: 'Sample Title2',
            description: 'Sample Description2',
            thumbnail: '/images/t2.jpg',
            category: 2,
            tag: [1,3],
            content: 'Sample Contents2'
          },
        ]
      }
    }
  },
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
