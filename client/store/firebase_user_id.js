import firebase from 'firebase'

export const state = () => ({
  firebase_uid: ''
})

export const mutations = {
  set_user_id(state, uid) {
    state.firebase_uid = uid
  }
}

export const actions = {
  async get_user_id({ commit }) {
    await firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        await commit('set_user_id', user.uid)
      }
    })
  }
}
