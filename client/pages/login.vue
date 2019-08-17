<template>
  <v-app dark>
    <v-card>
      <v-card-actions>
        <v-text-field
          v-model="email"
          label="Regular"
          placeholder="email"
        ></v-text-field>
        <v-spacer />
        <v-text-field
          v-model="password"
          label="Regular"
          placeholder="password"
        ></v-text-field>
      </v-card-actions>
      <v-card-actions class="d-flex justify-end">
        <v-btn @click="signup(email, password)">signup</v-btn>
        <v-btn @click="signin(email, password)">signin</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import { db } from './db'

export default {
  data: () => {
    return {
      email: '',
      password: '',
      db
    }
  },
  asyncData: async ({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error
  }) => {
    let isSignin
    await firebase.auth().onAuthStateChanged(function(user) {
      console.log(!!user)
      isSignin = !!user
    })
    return {
      isSignin
    }
  },
  methods: {
    signup: (email, password) => {
      console.log('mail,pass', email, password)
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorCode, errorMessage)
        })
    },
    signin: (email, password) => {
      console.log('mail,pass', email, password)
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(function(error) {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorCode, errorMessage)
        })
    }
  }
}
</script>
