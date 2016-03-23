import { router } from '../router'
import Vue from 'vue'

const API_URL = '/nautilus/'
const LOGIN_URL = API_URL + 'get_jwt'
//const SIGNUP_URL = API_URL + 'users/'
const SIGNUP_URL = API_URL + 'get_jwt'


export default {

  user: {
    authenticated: false
  },

  login(context, creds, redirect) {
    context.$http.post(LOGIN_URL, creds).then((data) => {
      localStorage.setItem('id_token', data.id_token)
      Vue.http.headers.common['Authorization'] = 'Bearer ' + data.id_token
      this.user.authenticated = true

      if(redirect) {
        router.go(redirect)        
      }

    }).catch((err) => {
      context.error = err
    })
  },

  signup(context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds).then((data) => {
      localStorage.setItem('id_token', data.id_token)
      Vue.http.headers.common['Authorization'] = 'Bearer ' + data.id_token

      this.user.authenticated = true

      if(redirect) {
        router.go(redirect)        
      }

    }).catch((err) => {
      context.error = err
    })
  },

  logout() {
    localStorage.removeItem('id_token')
    Vue.http.headers.common['Authorization'] = 'Bearer null'
    this.user.authenticated = false
  },

  checkAuth() {
    var jwt = localStorage.getItem('id_token')
    if(jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false      
    }
  },


  getAuthHeader() {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    }
  }
}
