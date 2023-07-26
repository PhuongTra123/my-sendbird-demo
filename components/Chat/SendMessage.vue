<template>
    <div class="pb-4 bg-normal-700 sticky bottom-0">
        <!-- <div
        class="bg-normal-500 mb-1 rounded overflow-x-hidden overflow-y-auto max-h-[160px]"
      >
        <div
          v-for="(user, idx) in mentionUsers"
          :id="`mention_${user.userId}`"
          :key="user.userId"
          class="flex gap-2 mt-2 px-3 py-2"
          :class="{
            'bg-normal-400':
              user.userId === mentionUsers[indexSelectingMentionUser].userId,
          }"
          @click="() => handleSelectMentionUser(idx)"
        >
          <div>
            <img
              :src="
                user.plainProfileUrl ||
                require('@/assets/images/avatar-default.png')
              "
              :alt="user.nickname"
              class="w-6 aspect-square rounded-full"
            />
          </div>
          <div>
            <div class="text-sm font-semibold text-normal-100">
              {{ user.nickname }}
            </div>
            <div class="text-xs text-normal-300">@{{ user.userId }}</div>
          </div>
        </div>
      </div> -->
        <div class="rounded border border-normal-500 bg-normal-600 py-2 px-3 grid grid-cols-[1fr_20px] gap-3 items-center">
            <div>
                <form @submit.prevent="sendMessage">
                    <div class="mb-1">
                        <!-- <label v-if="!file" for="picture">
                            <WdIcon name="add-picture" class="cursor-pointer" />
                        </label> -->
                        <!-- <input
                id="picture"
                name="picture"
                accept="image/png, image/jpeg, video/mp4"
                class="hidden"
                type="file"
                @input="handleInputFile"
              /> -->
                        <!-- <div v-if="displayImg || displayVideo" class="relative mb-2">
                <img
                  v-if="displayImg"
                  :src="displayImg"
                  class="max-h-[200px] max-w-[200px]"
                  alt="preload"
                />
                <video
                  v-if="displayVideo"
                  :src="displayVideo"
                  class="max-h-[200px] max-w-[200px]"
                  alt="preload"
                  controls
                />
                <WdIcon
                  name="times"
                  class="cursor-pointer text-xs absolute top-[3px] left-[175px] bg-slate-600 p-1 rounded"
                  @click="handleRemoveFile"
                />
              </div> -->
                    </div>
                    <input id="input_chat" v-model="message" type="text" placeholder="Start typing" class="w-full"
                        autocomplete="off" maxlength="2000" />
                </form>
            </div>
            <!-- <WdIcon
          name="send"
          class="!text-normal-400 cursor-pointer !leading-[21px] mt-auto"
          :class="{ '!text-blue-500': message.trim() || file }"
          @click="sendMessage"
        /> -->
            <div class="cursor-pointer !leading-[21px] mt-auto" @click="sendMessage">
                <img :src="require('@/assets/images/send.png')
                    " alt="send-icon" class="w-6 aspect-square rounded-full" />
            </div>

        </div>
    </div>
</template>
  
<script>
import { CHANNEL_TYPE, typeMessage } from '../../libs/constants'
import { objectProp } from '@/libs/props'

export default {
    props: {
        channel: objectProp(),
        replyMessage: objectProp(),
    },
    data() {
        return {
            message: '',
            mentionUsers: [],
            indexSelectingMentionUser: 0,
            file: null,
            displayImg: null,
            displayVideo: null,
            preloadError: false,
        }
    },
    watch: {
        replyMessage(val) {
            if (!val) return
            document.querySelector('#input_chat').focus()
        },
        // message(val) {
        //     if (val.includes('@') && this.channel.customType !== CHANNEL_TYPE.DM) {
        //         const keywords = val.split(' ')
        //         const keyword = keywords[keywords.length - 1]
        //         if (!keyword.includes('@') || !keyword.startsWith('@'))
        //             return (this.mentionUsers = [])
        //         this.mentionUsers = this.channel.members.filter(mem => {
        //             return (
        //                 (mem.userId
        //                     .toLowerCase()
        //                     .includes(keyword.toLowerCase().replace('@', '')) ||
        //                     mem.nickname
        //                         .toLowerCase()
        //                         .includes(keyword.toLowerCase().replace('@', ''))) &&
        //                 mem.userId !== this.$auth.user.userName
        //             )
        //         })
        //         document.addEventListener('keydown', this.eventKeydown)
        //         return
        //     }
        //     this.mentionUsers = []
        // },
        channel() {
            this.message = ''
            this.mentionUsers = []
            this.indexSelectingMentionUser = 0
            document.removeEventListener('keydown', this.eventKeydown)
        },
    },
    mounted() {
        document.removeEventListener('keydown', this.eventKeydown)
    },
    methods: {
        // replaceMentionMessage() {
        //     const mess = this.message.split(' ').slice(0, -1).join(' ')
        //     this.message = `${mess} @${this.mentionUsers[this.indexSelectingMentionUser].userId
        //         } `
        //     this.indexSelectingMentionUser = 0
        //     document.removeEventListener('keydown', this.eventKeydown)
        // },
        eventKeydown(e) {
            if (
                e.key === 'ArrowDown' &&
                this.indexSelectingMentionUser < this.mentionUsers.length - 1
            ) {
                this.indexSelectingMentionUser += 1
            } else if (e.key === 'ArrowUp' && this.indexSelectingMentionUser > 0) {
                this.indexSelectingMentionUser -= 1
            } else if (e.key === 'Escape') {
                this.indexSelectingMentionUser = 0
                this.mentionUsers = []
                document.removeEventListener('keydown', this.eventKeydown)
            }
            // const targetUser = document.getElementById(
            //     `mention_${this.mentionUsers[this.indexSelectingMentionUser].userId}`
            // )
            // targetUser.scrollIntoView()
        },
        // getListMentionUserId() {
        //     const arrayWord = this.message.trim().split(' ')
        //     const listMentionId = arrayWord.reduce((pre, cur) => {
        //         if (MENTION_REGEX.test(cur)) return [...pre, cur.replace('@', '')]
        //         return pre
        //     }, [])
        //     return listMentionId.filter(mention =>
        //         this.channel.members.map(mem => mem.userId).includes(mention)
        //     )
        // },
        // handleSelectMentionUser(idx) {
        //     this.indexSelectingMentionUser = idx
        //     this.replaceMentionMessage()
        // },
        async sendMessage() {

            // if (this.mentionUsers.length) return this.replaceMentionMessage()
            try {
                const params = {
                    message: this.message.trim(),
                }
                /// handle send text message
                this.message = ''
                await this.channel.sendUserMessage(params).onSucceeded(message => {
                    this.$emit('sendedMessage', message)
                })
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error)
            }
        },
        // handleInputFile(e) {
        //     const file = e.target.files[0]

        //     if (file.size / (1024 * 1024) > 100)
        //         // bytes => MB
        //         return Notification.error({
        //             title: 'Error',
        //             message: 'File size must be less than 100MB',
        //             duration: 3000,
        //             customClass: 'error-notification',
        //         })

        //     this.file = file
        //     const reader = new FileReader()
        //     reader.onload = evt => {
        //         if (this.isFileImage(file)) {
        //             this.displayImg = evt.target.result
        //         } else {
        //             this.displayVideo = evt.target.result
        //         }
        //         e.target.value = null
        //     }
        //     reader.readAsDataURL(file)
        // },
        // handleRemoveFile() {
        //     this.file = null
        //     this.displayImg = null
        //     this.displayVideo = null
        // },
        // isFileImage(file) {
        //     const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']
        //     return file && acceptedImageTypes.includes(file.type)
        // },
        handlePreloadError(e) {
            this.preloadError = true
        },
    },
}
</script>
  