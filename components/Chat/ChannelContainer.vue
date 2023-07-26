<template>
  <div class="channel-container sticky top-0 border-r border-normal-500">
    <div class="flex justify-between items-center py-[19px] px-4 border-b border-normal-500">
      Sendbird chat
      <div @click="handleCreateNewChannel"
        class="w-6 h-6 text-white text-lg font-bold bg-[#C72A2A] rounded-full flex justify-center items-center cursor-pointer pb-1">
        +
      </div>
    </div>
    <div ref="channelList" class="channel-list overflow-auto">
      <Channel v-for="channel in channels" :key="channel.url" :channel="channel"
        :unread="Boolean(channel.unreadMessageCount)" :class="{
          selecting: selectedChannel && selectedChannel.url === channel.url,
        }" @click.native="selectChannel(channel)" />

      <template v-if="channels.length === 0">
        <div class=" font-semibold text-center">
          No channels
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { arrayProp, booleanProp, objectProp } from "../../libs/props";
import Channel from "./Channel";

export default {
  props: {
    channels: arrayProp(),
    selectedChannel: objectProp(),
    hasNext: booleanProp(),
  },
  components: {
    Channel,
  },

  data() {
    return {
      query: null,
      keyword: "",
      // channelsLoading: false,
    };
  },
  // watch: {
  //   keyword: debounce(function val(val) {
  //     this.$emit('searchChannels', val)
  //   }, 500),
  // },
  methods: {
    selectChannel(channel) {
      this.$emit('select', channel)
    },
    handleCreateNewChannel() {
      this.$emit('handleClickCreateGroup', true)
    },
  },
};
</script>

<style lang="scss" scoped>
.channel-container {
  height: calc(100vh - 69px);
}

.channel-list {
  height: calc(100% - 71px - 82px);
}
</style>
