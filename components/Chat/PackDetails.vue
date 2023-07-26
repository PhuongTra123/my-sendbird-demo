<template>
    <div class="pt-4 bg-normal-700 sticky top-0 z-10">
        <div class="bg-[#2A2E35] rounded-xl py-3 px-6 flex justify-between items-center">
            <div class="flex gap-4 items-center">
                <!-- <WdIcon
            name="back-arrow"
            class="md:!hidden cursor-pointer"
            @click="back"
          /> -->
                <!-- AVATAR -->
                <div v-if="isGroup" class="flex gap-4 items-center">
                    <DefaultGroupAvt :channel="channel" />
                    <div class=" font-semibold">
                        {{ channel.name }}
                    </div>
                </div>
                <!-- <div v-else>
            <div
              v-for="member in channel.members.filter(
                mem => mem.userId !== $auth.user.userName
              )"
              :key="member.userId"
              class="flex gap-4 items-center"
            >
              <img
                :src="
                  member.plainProfileUrl ||
                  require('@/assets/images/avatar-default.png')
                "
                class="w-10 aspect-square rounded-full"
              />
              <div>
                {{ member.nickname }}
              </div>
            </div>
          </div> -->
                <!-- /AVATAR -->
            </div>

            <div class="flex gap-1 items-center cursor-pointer">
                <!-- @click="$emit('showSetting')" -->
                <!-- <WdIcon name="info" /> -->
                <div @click="$emit('showSetting')" class="hidden md:block font-semibold text-white">
                    Details
                </div>
            </div>
        </div>

    </div>
</template>
  
<script>
//   import WdIcon from '../WdIcon.vue'
import { CHANNEL_TYPE, typeMessage } from '@/libs/constants'
import DefaultGroupAvt from './DefaultGroupAvt.vue'
import { objectProp } from '@/libs/props'

export default {
    components: { DefaultGroupAvt },
    props: {
        channel: objectProp(),
        pinMessage: objectProp(),
    },
    // data() {
    //   return {
    //     typeMessage,
    //     CHANNEL_TYPE,
    //   }
    // },
    // computed: {
    //   isGroup() {
    //     return this.channel.customType === CHANNEL_TYPE.GROUP
    //   },
    // },
    methods: {
        //   back() {
        //     this.$emit('back')
        //   },
        //   async handleDeletePinMessage() {
        //     try {
        //       await this.channel.deleteMetaData('pinMessage')
        //     } catch (error) {
        //       // eslint-disable-next-line no-console
        //       console.log(error)
        //     }
        //   },
        //   handleParentMessageClick() {
        //     const parentMessageElm = document.getElementById(
        //       `wd_msg_${this.pinMessage.messageID}`
        //     )
        //     if (parentMessageElm)
        //       return parentMessageElm.scrollIntoView({ block: 'center' })
        //     this.$emit('handleIfNotParentMessageInList')
        //   },
    },
}
</script>
  