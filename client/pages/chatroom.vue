<template>
  <div>
    <v-select
      v-model="user_id"
      :items="user_list"
      item-text="user_name"
      item-value="user_id"
      label="user"
    ></v-select>
    <v-select
      v-model="room_id"
      :items="room_list"
      item-text="room_name"
      item-value="room_id"
      label="room"
      @change="roomSelected"
    ></v-select>
    <v-text-field v-model="new_message" placeholder="newMessage"></v-text-field>
    <v-btn @click="createMeessages(room_id, user_id, new_message)"></v-btn>
    <v-text-field
      v-model="room_name"
      placeholder="new_room_name"
    ></v-text-field>
    <v-btn @click="createNewRoom(room_name)"></v-btn>
    <v-card class="mx-auto" max-width="300" tile>
      <v-list disabled>
        <v-subheader>REPORTS</v-subheader>
        <v-list-item-group v-model="room_message" color="primary">
          <v-list-item v-for="(list, i) in room_message" :key="i">
            <v-list-item-title
              v-text="computedUserNameList[i]"
            ></v-list-item-title>
            <v-list-item-title v-text="list.message"></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    {{ room_message }}
  </div>
</template>
<script>
// import firebase from 'firebase'
import { db } from './db'
export default {
  data: () => {
    return {
      user_list: [],
      room_list: [],
      message_list: [],
      rooms: [],
      user_id: '',
      room_id: '',
      message_id: '',
      room_name: '',
      new_message: '',
      room_message: [],
      user_name_list: []
    }
  },
  firestore: {
    room_list: db.collection('room_list'),
    user_list: db.collection('user_list'),
    message_list: db.collection('message_list'),
    room_message: db
  },
  computed: {
    computedUserNameList: function() {
      return this.user_name_list
    }
  },
  methods: {
    changeMessage: (value) => {
      console.log(value)
    },
    createMeessages: (roomId, userId, newMessage) => {
      // console.log(roomId, userId, newMessage)
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 20
      const messageId = Array.from(Array(N))
        .map(() => S[Math.floor(Math.random() * S.length)])
        .join('')
      db.collection('rooms')
        .doc(`room_${roomId}`)
        .collection('users')
        .doc(`user_${userId}`)
        .collection(`room_${roomId}_messages`)
        .doc(`message_${messageId}`)
        .set({ message_id: messageId, user_id: userId, room_id: roomId })
      db.collection('message_list')
        .doc(messageId)
        .set({
          message_id: messageId,
          message: newMessage,
          user_id: userId,
          room_id: roomId
        })
    },
    createNewRoom: (roomName) => {
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 20
      const roomId = Array.from(Array(N))
        .map(() => S[Math.floor(Math.random() * S.length)])
        .join('')
      db.collection('room_list')
        .doc(roomId)
        .set({ room_id: roomId, room_name: roomName })
    },
    async searchMessage(roomId) {
      const messageList = []
      const message = await db.collection('message_list')
      await message
        .where('room_id', '==', roomId)
        .get()
        .then(async (querySnapshot) => {
          await querySnapshot.forEach(async (doc) => {
            await messageList.push(await doc.data())
          })
        })
      this.room_message = messageList
      return messageList
    },
    async roomSelected(roomId) {
      // Vue cannot detect property addition or deletion.
      // https://stackoverflow.com/questions/54715544/why-is-this-vue-computed-property-not-reactive
      this.user_name_list = []
      const messageList = await this.searchMessage(roomId)
      console.log(messageList)
      await messageList.forEach((doc, index) => {
        console.log('iii')
        this.searchUserName(doc.user_id, index)
      })
    },
    async searchUserName(userId, index) {
      console.log(userId, index)
      const user = await db.collection('user_list')
      let result
      await user
        .where('user_id', '==', userId)
        .get()
        .then(async (querySnapshot) => {
          await querySnapshot.forEach(async (doc) => {
            result = await doc.data().user_name
          })
        })
      console.log(result, 'result')
      this.user_name_list = [...this.user_name_list, result]
    }
  }
}
</script>
