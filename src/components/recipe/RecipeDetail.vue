<template>

  <p class="text-left">
    <h4>{{node.name}}</h4>
    <h5>{{node.category}} (cook time: {{node.cookTime}} minutes)</h5>
    <h6>Ingredients</h6>
    <ul id="ingredients-{node.id}">
      <li v-for="ingredient in node.ingredients.edges">
        {{ ingredient.node.name }}
      </li>
    </ul>
  </td>
  </p>

</template>

<script>

import {
        getRecipe
} from '../../vuex/actions'
import graphql from '../../graphql'

export default {

  props: ['node'],

  methods: {
    loadRecipe() {
      this.getRecipe(
        this,
        graphql.genQueryRecipesIngredients(`(pk: ${this.node.primaryKey})`),
        this.node
      )
    },
  },

  ready: function() {
    //this.loadRecipe()
  },

  vuex: {
    actions: {
        getRecipe
    }
  }
}
</script>
