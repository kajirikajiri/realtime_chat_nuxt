<template>
  <div>
    {{ computedCurrentUserName }}
    <v-select
      v-model="room_id"
      :items="room_list"
      item-text="room_name"
      item-value="room_id"
      label="room"
    ></v-select>
    <v-text-field v-model="new_message" placeholder="newMessage"></v-text-field>
    <v-btn @click="createMeessages(room_id, user_id, new_message)"></v-btn>
    <v-text-field
      v-model="room_name"
      placeholder="new_room_name"
    ></v-text-field>
    <v-btn @click="createNewRoom(room_name)"></v-btn>
    <v-card class="mx-auto" max-width="2000" tile>
      <v-list disabled>
        <v-subheader>REPORTS{{ computedCurrentUserName }}</v-subheader>
        <v-list-item-group v-model="computedRoomMessage" color="primary">
          <v-list-item v-for="(list, i) in computedRoomMessage" :key="i">
            <v-list-item-title
              v-text="computedUserNameList[i][0].user_name"
            ></v-list-item-title>
            <v-list-item-title v-text="list.message"></v-list-item-title>
            <v-list-item-subtitle
              v-text="list.created ? list.created.toDate() : list.created"
            ></v-list-item-subtitle>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>
<script>
import firebase from 'firebase'
import { db } from './db'
import randomNo from './randomNo'
export default {
  data: () => {
    return {
      room_list: [],
      message_list: [],
      user_name_list: [],
      rooms: [],
      user_list: '',
      user_id: '',
      room_id: '',
      message_id: '',
      room_name: '',
      new_message: '',
      user_uid: ''
    }
  },
  computed: {
    computedRoomMessage: function() {
      return this.message_list.filter((doc) => doc.room_id === this.room_id)
    },
    computedUserNameList: function() {
      const result = []
      this.computedRoomMessage.forEach((each) => {
        result.push(
          this.user_list.filter((doc) => each.user_id === doc.user_id)
        )
      })
      return result
    },
    computedCurrentUserName: function() {
      const result = this.user_list.filter(
        (doc) => doc.user_id === this.user_uid
      )
      console.log(result)
      return result.user_name
    }
  },
  async asyncData() {
    let user_uid
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user_uid = user.uid
      }
    })
    return {
      user_uid
    }
  },
  firestore: {
    room_list: db.collection('room_list'),
    user_list: db.collection('user_list'),
    message_list: db.collection('message_list')
  },
  methods: {
    createMeessages: (room_id, user_id, message) => {
      const message_id = randomNo()
      db.collection('rooms')
        .doc(`room_${room_id}`)
        .collection('users')
        .doc(`user_${user_id}`)
        .collection(`room_${room_id}_messages`)
        .doc(`message_${message_id}`)
        .set({ message_id, user_id, room_id })
      db.collection('message_list')
        .doc(message_id)
        .set({
          message_id,
          message,
          user_id,
          room_id,
          created: firebase.firestore.FieldValue.serverTimestamp()
        })
    },
    createNewRoom: (room_name) => {
      const room_id = randomNo()
      db.collection('room_list')
        .doc(room_id)
        .set({ room_id, room_name })
    }
  }
}
</script>
