<template>
    <div v-if="isDefaultGroupAvt" class="w-12 aspect-square relative">
      <img
        :src="
          channel.members[0].plainProfileUrl ||
          require('@/assets/images/avatar-default.png')
        "
        class="w-8 aspect-square rounded-full absolute bottom-0 left-0 z-10"
        alt="avt"
      />
      <img
        :src="
          channel.members[channel.members.length - 1].plainProfileUrl ||
          require('@/assets/images/avatar-default.png')
        "
        class="w-8 aspect-square rounded-full absolute top-0 right-0"
        alt="avt"
      />
    </div>
    <img v-else :src="channel.coverUrl" class="w-10 aspect-square rounded-full" />
  </template>
  
  <script>
  import { objectProp } from '@/libs/props'
  export default {
    props: {
      channel: objectProp(),
    },
    computed: {
      isDefaultGroupAvt() {
        return this.channel.coverUrl.includes('static.sendbird.com/sample/cover')
      },
    },
  }
  </script>
  