<template>
  <div
    class="channel grid gap-4 items-center py-3 px-4 cursor-pointer"
    :class="unread ? 'text-[#FAFAFA] font-bold' : 'text-[#B0B6BF]'"
  >
    <DefaultGroupAvt v-if="isGroup" :channel="channel" />
    <template v-else>
      <div
        v-for="member in channel.members.filter(
          (mem) => mem.userId !== AUTH.userId
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
    </template>

    <div class="relative">
      <div v-if="isGroup" :class="unread ? 'font-bold' : 'font-normal'">
        {{ channel.name }}
      </div>
      <template v-else>
        <div
          v-for="member in channel.members.filter(
          (mem) => mem.userId !== AUTH.userId
        )"
          :key="member.userId"
          class="flex gap-4 items-center"
        >
          <div :class="unread ? 'font-bold' : 'font-normal'">
            {{ member.nickname }}
          </div>
        </div>
      </template>

      <div v-if="channel.lastMessage" class="truncate">
        <span v-if="channel.customType === 'group'">
          {{
            `${channel.lastMessage.sender.nickname}: ${channel.lastMessage.message}`
          }}
        </span>
        <span v-else>
          {{ channel.lastMessage.message }}
        </span>
      </div>
    </div>
    <div :class="unread ? 'font-semibold' : 'font-normal'">
      {{
        channel.lastMessage &&
        formatDate(new Date(channel.lastMessage.createdAt), "dd MMMM")
      }}
    </div>
  </div>
</template>

<script>
import DefaultGroupAvt from "./DefaultGroupAvt.vue";
import { CHANNEL_TYPE } from "@/libs/constants";
import { objectProp, booleanProp } from "@/libs/props";
import { formatDate } from "@/libs/format";
import { AUTH } from "../../libs/constants";

export default {
  components: { DefaultGroupAvt },
  props: {
    channel: objectProp(),
    unread: booleanProp(),
  },
  data() {
    return {
      formatDate,
      AUTH,
    };
  },
  computed: {
    isDefaultGroupAvt() {
      return this.channel.coverUrl.includes("static.sendbird.com/sample/cover");
    },
    isGroup() {
      return this.channel.customType === CHANNEL_TYPE.GROUP;
    },
  },
};
</script>

<style lang="scss" scoped>
.channel {
  grid-template-columns: 48px calc(100% - 48px - 56px - 32px) 56px;
  &.selecting {
    background: #2f343c;
  }
}
</style>
