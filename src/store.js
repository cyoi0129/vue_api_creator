import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  //strict: true,
  state:{
    obj: {
      update: '2020/01/01 10:00',
      path: '/images/',
      categories: [{index:1, name:'sampleCat1'}, {index:2, name:'sampleCat2'}],
      tags: [{index:1,name:'sampleTag1'}, {index:2, name:'sampleTag2'}, {index:3, name:'sampleTag3'}],
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
    },
    noitem: {
      aid: 0,
      path:'/images/',
      created: '2999/12/31',
      updated: '2999/12/31',
      title: 'No contents',
      description: 'No contents',
      thumbnail: '/images/noimage.jpg',
      category: 1,
      tag: [],
      content: 'No contents'
    }
  },
  getters: {
    getCatName (state) {
      return index => {
        if (state.obj.categories.filter(category => category.index === index)[0]) {
          return state.obj.categories.filter(category => category.index === index)[0].name
        } else {
          return 'none'
        }
      }
    },
    getItem (state) {
      return aid => {
        if (state.obj.items.filter(item => item.aid === aid)[0]) {
          return state.obj.items.filter(item => item.aid === aid)[0]
        } else {
          return state.noitem
        }
      }
    }
  },

  mutations:{
    changeData(state, obj){
      state.obj = obj
    },
    changeItem(state, article){
      const updateArticle = state.obj.items.filter(item => item.aid === article.aid)[0]
      if (updateArticle) {
        state.obj.items.filter(item => item.aid === article.aid)[0] = article
      } else {
        console.log('No such item.')
      }
    },
    removeItem(state, article){
      const targetIndex = state.obj.items.findIndex(item => item.aid === article.aid)
      if (targetIndex) {
        state.obj.items.splice(targetIndex, 1)
      } else {
        console.log('No such item.')
      }
    },
  },

  actions:{
    changeData(context, obj){
      context.commit('changeData', obj)
    },
    changeItem(context, article){
      context.commit('changeItem', article)
    },
    removeItem(context, article){
      context.commit('removeItem', article)
    }
  }
})