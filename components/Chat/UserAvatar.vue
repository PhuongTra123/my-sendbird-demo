<template>
    <div>
      <div
        v-for="member in channel.members.filter(
          mem => mem.userId !== AUTH.userId
        )"
        :key="member.userId"
        class="flex gap-4 items-center"
      >
        <img
          :src="
            member.plainProfileUrl ||
            require('@/assets/images/avatar-default.png')
          "
          class="w-12 aspect-square rounded-full"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { objectProp } from '@/libs/props'
import { AUTH } from '../../libs/constants';
  export default {
    props: {
      channel: objectProp(),
    },
  }
  </script>
  