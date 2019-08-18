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
        <v-text-field
          v-model="username"
          label="Regular"
          placeholder="username"
        ></v-text-field>
      </v-card-actions>
      <v-card-actions class="d-flex justify-end">
        <v-btn @click="signup(email, password, username)">signup</v-btn>
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
      username: ''
    }
  },
  asyncData: async () => {
    let isSignin
    await firebase.auth().onAuthStateChanged((user) => {
      console.log(!!user)
      isSignin = !!user
    })
    return {
      isSignin
    }
  },
  methods: {
    signup: function(email, password, username) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorCode, errorMessage)
        })
      this.registFireStore(username)
    },
    signin: (email, password) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorCode, errorMessage)
        })
    },
    registFireStore: function(user_name) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          db.collection('user_list')
            .doc(user.uid)
            .set({ user_id: user.uid, user_name })
        }
      })
    }
  }
}
</script>
