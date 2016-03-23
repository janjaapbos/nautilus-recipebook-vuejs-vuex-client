<template>
<div>
  <nav class="navbar navbar-default">
    <div class="container">
      <ul class="nav navbar-nav">
        <li><a v-link="'home'">Home</a></li>
        <li><a v-link="'login'" v-if="!user.authenticated">Login</a></li>
        <li><a v-link="'signup'" v-if="!user.authenticated">Sign Up</a></li>
        <li><a v-link="'login'" v-if="user.authenticated" @click="logout()">Logout</a></li>
      </ul>
    </div>    
  </nav>
  <div class="container">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import store from '../vuex/store'
import auth from '../auth'
import '../vuex/scroll'

export default {
  store,

  data() {
    return {
      user: auth.user
    }
  },

  methods: {

    logout() {
      auth.logout()
    }
  }
}
</script>
