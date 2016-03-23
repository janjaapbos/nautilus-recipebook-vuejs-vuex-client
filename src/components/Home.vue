<template>

  <div v-show="current_action.running">
    <alert
      type="info"
      width="300px"
      placement="top">
      <span class="icon-info-circled alert-icon-float-left"></span>
      <strong>Loading data ...</strong>
    </alert>
  </div>

  <div class="col-sm-9 col-sm-offset-3">
    <h1>Nautulis Recipes example</h1>
    <button class="btn btn-success" v-on:click="getQuery()">Reload recipes</button>
  </div>

  <div class="col-sm-9 col-sm-offset-3">

    <div v-if="recipes.edges.length > 0">
      <h4>Recipes <i>{{keyword}}</i> </h4>
      <typeahead
        :data="recipes_keywords"
        placeholder="Filter recipes"
        :on-hit="setKeyword">
      </typeahead>

     <div class="jumbotron" v-if="!keyword" v-for="edge in recipes.edges" track-by="$index">
       <template v-if="true">
        <recipe-detail :node=edge.node>
        </recipe-detail>
      </template>
    </div>

     <div class="jumbotron" v-if="keyword" v-for="edge in recipes.edges | filterBy keyword in 'node.name' 'node.category'" track-by="$index">
       <template v-if="true">
        <recipe-detail :node=edge.node>
        </recipe-detail>
      </template>
    </div>

  </div>

</template>

<script>
import Vue from 'vue'
import RecipeDetail from './recipe/RecipeDetail.vue'
Vue.component('recipe-detail', RecipeDetail)

import {
        setRecipes,
        getRecipes
} from '../vuex/actions'

import store from '../vuex/store'
import * as types from '../vuex/types'
import graphql from '../graphql'
import { ActionGraphQLScroll } from '../vuex/actions'

import { alert, typeahead } from 'vue-strap'

var loading = false
var keyword = ""
var route_active = false

const recipes_process_response = function(action) {
  store.dispatch(action.type, action)
  if (action.type == types.RECIPES_SET) {
    action.response.data.data[action.data_key].edges.forEach(function(edge) {
      edge.node.show_details = true
      store.dispatch(types.RECIPES_KEYWORDS_SET, edge.node.name)
      store.dispatch(types.RECIPES_KEYWORDS_SET, edge.node.category)
      store.dispatch(types.RECIPES_BY_ID_SET, edge.node)
    })
  }
}


export default {

  components: {
    RecipeDetail,
    alert,
    typeahead
  },

  data() {
    return {
      route_active: route_active,
      keyword: keyword
    }
  },

  route: {
    activate() {
      this.route_active = true
      if (this.current_action.enable != null) {
         this.current_action.enable()
      }
    },
    deactivate() {
      this.route_active = false
      if (this.current_action.disable != null) {
         this.current_action.disable()
      }
    }
  },

  methods: {
    getQuery() {
      loading = true
      this.setRecipes([])
      if (this.current_action.delete != null) {
       this.current_action.delete()
      }
      var action = new ActionGraphQLScroll(this, types.RECIPES_SET, graphql.genQueryRecipesIngredients, "recipes")
      store.dispatch(types.HOME_SET_CURRENT_ACTION, action)
      this.current_action.process_response = recipes_process_response
      this.current_action.run()
    },
    setKeyword(k, targetVM) {
       if (targetVM.query == "") {
         this.keyword = ""
       } else {
         this.keyword = k
       }
       targetVM.reset()
    },
    showRecipeDetails(node_id) {
      return this.recipesByID[node_id].show_details
    },
    toggleShowRecipeDetail(node) {
      store.dispatch(types.RECIPE_TOGGLE_DETAIL, node)
    },
  },

  ready: function() {
    (this.recipes.edges.length > 0) || this.getQuery()
  },

  vuex: {
    getters: {
      recipes: state => state.recipes,

      recipes_keywords: state => state.recipes_keywords,

      recipesByID: state => state.recipesByID,

      current_action: state => state.home_current_action,

    },
    actions: {
        setRecipes,
        getRecipes,
    }
  }
}
</script>
