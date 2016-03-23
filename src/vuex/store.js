import Vue from 'vue'
import Vuex from 'vuex'
import {
        RECIPE_TOGGLE_DETAIL,
        RECIPE_SET,
        RECIPES_SET,
        RECIPES_BY_ID_SET,
        RECIPES_KEYWORDS_SET,
        SCROLL_LAST_EVENT,
        SCROLL_REACHED_BOTTOM,
        HOME_SET_CURRENT_ACTION,
        ACTION_CREATE,
        ACTION_DELETE,
        ACTION_UPDATE
} from './types'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)
Vue.config.debug = debug

const state = {
  recipes: {edges: []},
  recipes_keywords: [],
  recipesByID: {},
  scroll: {},
  home_current_action: {running: false},
  actions: {
    SCROLL_REACHED_BOTTOM: {}
  }
}

const mutations = {

  [RECIPE_TOGGLE_DETAIL] (state, node) {
    state.recipesByID[node.id].show_details = !node.show_details
  },

  [RECIPE_SET] (state, action) {
    if (action.response.data.data[action.data_key].edges.length != 1) {
      console.log("RECIPE_SET data[action.data_key].edges.length != 1", action.node.id)
      return
    }
    if (action.response.data.data[action.data_key].edges[0].node.id != action.node.id) {
      console.log("RECIPE_SET unknown ID", action.node.id)
      return
    }
    for (var key in action.response.data.data[action.data_key].edges[0].node) {
      state.recipesByID[node.id][key] = action.response.data.data[action.data_key].edges[0].node[key]
    }
  },

  [RECIPES_SET] (state, action) {
    if (action.response == null) {
      state.recipes.edges = action
    } else {
      action.response.data.data[action.data_key].edges.forEach(function(edge) {
        state.recipes.edges.push(edge)
      })
    }
  },

  [RECIPES_BY_ID_SET] (state, node) {
    state.recipesByID[node.id] = node
  },

  [RECIPES_KEYWORDS_SET] (state, k) {
    (state.recipes_keywords.indexOf(k) >= 0) ||
        state.recipes_keywords.push(k)
  },

  [HOME_SET_CURRENT_ACTION] (state, action) {
    state.home_current_action = action
  },

  [ACTION_CREATE] (state, action) {
    state.actions[action.trigger][action.key] = action
  },

  [ACTION_DELETE] (state, action) {
    state.actions[action.trigger][action.key].deleted = true
    delete state.actions[action.trigger][action.key]
  },

  [ACTION_UPDATE] (state, action, values) {
    for (var k in values) {
      state.actions[action.trigger][action.key][k] = values[k]
    }
  },

  [SCROLL_LAST_EVENT] (state, event) {
    state.scroll['last_event'] = event
  },

  [SCROLL_REACHED_BOTTOM] (state, event) {
    state.scroll['reached_bottom'] = event
  },

}

export default new Vuex.Store({
  state,
  mutations
})
