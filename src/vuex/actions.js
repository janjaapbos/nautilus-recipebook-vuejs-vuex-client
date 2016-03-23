import * as types from './types'
import store from './store'


var Action = function (context, type, trigger) {
  this.context = context
  this.type = type
  this.trigger = trigger
  this.key = Math.random().toString(36).substring(7)
  this.enabled = false
  this.running = false
  store.dispatch(types.ACTION_CREATE, this)
}

Action.prototype.log = function(msg) {
  console.log(this.key, "action msg", msg)
}

Action.prototype.enable = function() {
  this.enabled = true
}

Action.prototype.disable = function() {
  this.enabled = false
}

Action.prototype.run_test = function() {
  this.run()
  setTimeout(this.run_test_done.bind(this), 2000);
}

Action.prototype.run_test_done = function() {
  this.done()
  console.log("run_test_done", this)
}

Action.prototype.run = function() {
  this.running = true
  this.enabled = true
}

Action.prototype.done = function() {
  this.running = false
}

Action.prototype.delete = function() {
  this.disable()
  store.dispatch(types.ACTION_DELETE, this)
}

Action.prototype.finish = function() {
  this.finished = true
  this.enabled = false
  this.running = false
}

export var ActionGraphQLScroll = function (context, type, query_gen, data_key) {
  Action.call(this, context, "graphql", types.SCROLL_REACHED_BOTTOM)
  this.offset = 0
  this.first = 7
  this.query_gen = query_gen
  this.dispatch = store.dispatch
  this.type = type
  this.data_key = data_key
}

ActionGraphQLScroll.prototype = Object.create(Action.prototype)
ActionGraphQLScroll.prototype.constructor = ActionGraphQLScroll

ActionGraphQLScroll.prototype.run = function() {
  this.running = true
  this.enabled = true
  this.select_gen(this)
  var self = this
  var headers = {
    'Content-Type': 'application/graphql',
    'Authorization': 'Bearer ' + localStorage.getItem('id_token')
  }
  this.context.$http.post('/graphql', this.query_gen(this), {headers: headers}).then(function(response) {
    self.response = response
    if (response.data.data) {
      self.offset += response.data.data[self.data_key].edges.length
      if ((self.first) && (response.data.data[self.data_key].edges.length < self.first)) {
         self.finish()
      } else if ((self.last) && (response.data.data[self.data_key].edges.length < self.last)) {
         self.finish()
      }
    }
    self.process_response(self)
    self.done()
  }).catch(function(error) {
    console.log(error);
  });
}

ActionGraphQLScroll.prototype.select_gen = function(action) {
  if (action.first != null) {
    action.select = `(offset: ${action.offset}, first: ${action.first})`
  } else if (action.last != null) {
    action.select = `(offset: ${action.offset}, last: ${action.last})`
  }
}

ActionGraphQLScroll.prototype.process_response = function(action) {
  store.dispatch(action.type, action)
}

export const incrementCounter = ({dispatch}, n) => {
  dispatch(types.INCREMENT_COUNTER, n)
}

export const setRecipes = ({dispatch}, data) => {
  dispatch(types.RECIPES_SET, data)
}
