<template>
  <div v-if="channel" class="px-6 min-h-screen flex flex-col justify-between">
    <div>
      <PackDetails :channel="channel" @back="back" @showSetting="showSetting = true" />
      <div class="grid gap-8 content-start py-8 pb-10 mt-11">
        <!-- <WdSpinner v-if="loading" /> -->
        <Message v-for="(message, i) in messages" :id="i === 0 && 'first_message'" :key="message.messageId + i"
          :channel="channel" :message="message" :seen="Boolean(channel.getReadMembers(message).length)" />
      </div>
    </div>
    <transition name="fade-up">
      <div v-if="replyMessage" class="mt-auto mb-1 sticky bottom-[80px] bg-normal-600 rounded border-normal-500 p-3">
        <div class="relative">
          <div class="text-normal-300">
            Replying to
            <span class="font-bold text-normal-100">
              {{ replyMessage.sender.nickname }}
            </span>
          </div>
          <div class="text-xs text-normal-300 max-h-10 overflow-auto">
            {{ replyMessage.message }}
          </div>
          <wd-icon name="times" class="absolute right-0 top-0 cursor-pointer" @click="replyMessage = null" />
        </div>
      </div>
    </transition>
    <SendMessage :channel="channel" @sendedMessage="mess => handleSendedMessage(mess)" />

    <!-- <transition name="fade-left"> -->
    <PackSetting v-if="showSetting" :channel="channel" @close="showSetting = false" />
    <!-- </transition> -->
  </div>
</template>
  
<script>
import Message from './Message'
import PackDetails from './PackDetails'
import SendMessage from './SendMessage'
//   import ForwardMessage from './ForwardMessage.vue'
import PackSetting from './PackSetting.vue'
//   import AddUserModel from './AddUserModel.vue'
import { objectProp, arrayProp, booleanProp } from '@/libs/props'

export default {
  components: {
    Message,
    PackDetails,
    SendMessage,
    // ForwardMessage,
    PackSetting,
    // AddUserModel,
  },
  props: {
    channel: objectProp(),
    messages: arrayProp(),
    //   loading: booleanProp(),
    //   pinMessage: objectProp(),
  },
  data() {
    return {
      query: null,
      replyMessage: null,
      copiedId: null,
      showSetting: false,
      // HiddenState,
    }
  },
  watch: {
    channel() {
      this.replyMessage = null
    },
  },
  methods: {
    back() {
      this.$emit('back')
    },
    handleReplyMessage(message) {
      this.replyMessage = message
      // eslint-disable-next-line no-console
      console.log(message)
    },
    handleSendedMessage(message) {
      this.replyMessage = null
      this.$emit('sendedMessage', message)
    },
    handleForwardMessage(message) {
      this.$modal.show('forward-message', { message })
    },

    handleCopy(messageId) {
      this.copiedId = messageId
    },
  },
}
</script>  

