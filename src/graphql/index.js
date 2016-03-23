
export default {

  genQueryRecipes(action) {

    if (action.select == null) {
       var select = ""
    } else {
       var select = action.select
    }

    return `query {
recipes ${select} {
  edges {
    node {
      id
      primaryKey
      name
      category
      cookTime
    }
  }
}}`},

  genQueryRecipesIngredients(action) {

    if (action.select == null) {
       var select = ""
    } else {
       var select = action.select
    }

    return `query {
recipes ${select} {
  edges {
    node {
      id
      primaryKey
      name
      category
      cookTime
      ingredients {
        edges {
          node {
            name
          }
        }
      }
    }
  }
}}`}

}

