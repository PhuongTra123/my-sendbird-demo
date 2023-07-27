<template>
  <div class="relative">
    <div class="grid grid-cols-[100%] md:grid-cols-[320px_1fr]">
      <!-- <div>cgat</div> -->
      <ChannelContainer
        :class="channelsClasses"
        :channels="channels"
        :selected-channel="selectedChannel"
        @select="handleSelectChannel"
        @handleClickCreateGroup="handleCreateGroup"
      />
      <!-- v-if="selectedChannel && !isCreateGroup" -->
      <ChatBox
        :messages="messages"
        :channel="selectedChannel"
        :class="chatBoxClasses"
        @sendedMessage="handleSendedMessage"
        @back="back"
      />
      <CreateGroupChannel
        v-if="isCreateGroupChannel"
        @select="handleSelectChannel"
        @close="isCreateGroupChannel = false"
        @handleClickCreateGroupChannel="handleCreateGroupChannel"
      />
    </div>
    <CreateChannelModal
      v-if="isCreateGroup"
      @select="handleSelectChannel"
      @handleClickCreateGroup="handleCreateGroup"
      @handleClickCreateGroupChannel="handleCreateGroupChannel"
    />
  </div>
</template>

<script>
import {
  GroupChannelHandler,
  GroupChannelListOrder,
  HiddenChannelFilter,
  MyMemberStateFilter,
} from "@sendbird/chat/groupChannel";
import { sb } from "../../libs/sb";
import ChannelContainer from "./ChannelContainer";
import ChatBox from "./ChatBox";
import CreateChannelModal from "./CreateChannelModal";
import CreateGroupChannel from "./CreateGroupChannel";
import { AUTH } from "../../libs/constants";

const MOBILE_SCREEN = 768;

export default {
  name: "Chat",
  components: {
    ChannelContainer,
    ChatBox,
    CreateChannelModal,
    CreateGroupChannel,
  },

  data() {
    return {
      totalUnreadMessage: null,
      channels: [],
      channelsQuery: null,
      messages: [],
      messagesQuery: null,
      pinMessage: null,

      selectedChannel: null,
      isShowChatBox: false,
      groupChannelHandler: null,
      loading: false,
      messagesLoading: false,
      isCreateGroup: false,

      keyword: "",
      observer: null,
      isCreateGroupChannel: false,
    };
  },

  computed: {
    channelsClasses() {
      return {
        hidden: this.isShowChatBox,
      };
    },
    chatBoxClasses() {
      return {
        "hidden md:flex": true,
        "!flex": this.isShowChatBox,
      };
    },
  },

  async mounted() {
    await this.initServiceInstance();
    // await this.createChannelFromParams();
  },

  methods: {
    handleCreateGroup(value) {
      this.selectedChannel = null;
      this.isCreateGroup = value;
    },
    handleCreateGroupChannel(value) {
      this.selectedChannel = null;
      this.isCreateGroupChannel = value;
    },
    async initServiceInstance() {
      try {
        this.loading = true;
        const res = await sb.connect("tra_tran_123");
        await this.getChannels();
        this.groupChannelHandler = new GroupChannelHandler({
          onMessageReceived: (channel, message) => {
            console.log("onMessageReceived", message);
            this.getTotal();
            if (
              this.selectedChannel &&
              this.selectedChannel.url === channel.url
            ) {
              channel.markAsRead();
              this.$nextTick(() => this.scrollToLastestMessage());
              this.messages.push(message);
            }
          },
          onMessageUpdated: (channel, message) => {
            console.log("onMessageUpdated", message);
            if (
              this.selectedChannel &&
              this.selectedChannel.url === channel.url
            ) {
              const cloneMessages = [...this.messages];
              const index = cloneMessages.findIndex(
                (mess) => mess.messageId === message.messageId
              );
              cloneMessages[index] = message;
              this.messages = cloneMessages;
            }
          },
          onChannelChanged: (channel) => {
            const cloneChannels = [...this.channels];
            const indexChannelChange = cloneChannels.findIndex(
              (cn) => cn.url === channel.url
            );
            if (indexChannelChange === -1)
              return (this.channels = [channel, ...cloneChannels]);
            cloneChannels[indexChannelChange] = channel;
            this.channels = cloneChannels;
          },
          onUnreadMemberStatusUpdated: (channel) => {
            this.messages = [...this.messages];
          },
          onChannelDeleted: (channelUrl, channelType) => {
            const cloneChannels = [...this.channels].filter(
              (channel) => channel.url !== channelUrl
            );
            this.channels = cloneChannels;
            if (channelUrl === this.selectedChannel.url) {
              this.selectedChannel = null;
              Notification.success({
                title: "Success",
                message: "This channel has been deleted",
                duration: 3000,
                customClass: "success-notification",
              });
            }
          },
          onUserLeft: (channel, user) => {
            if (
              user.userId === this.$auth.user.userName &&
              channel.url === this.selectedChannel.url
            ) {
              const cloneChannels = [...this.channels].filter(
                (cn) => cn.url !== channel.url
              );
              this.channels = cloneChannels;
              this.selectedChannel = null;
              return;
            }
            if (channel.members.length < 2 && channel.myRole === OWNER_ROLE) {
              channel.delete();
            }
          },
        });

        sb.groupChannel.addGroupChannelHandler(
          "handle",
          this.groupChannelHandler
        );
      } finally {
        this.loading = false;
      }
    },

    handleSendedMessage(message) {
      this.messages.push(message);
      setTimeout(() => {
        this.scrollToLastestMessage();
      }, 100);
    },

    // async createChannelFromParams() {
    //     try {
    //       const item = this.$route.params;
    //       const formData = new FormData();
    //       formData.append("name", item.fullName);
    //       if (item.profileUrl) formData.append("coverUrl", item.profileUrl);
    //       formData.append("userIds[]", item.userName);
    //       const { data } = await this.$api.post("/chat/channel", formData);

    //       const channel = await sb.groupChannel.getChannel(
    //         data.data.channelUrl
    //       );
    //       this.handleSelectChannel(channel);
    //     } catch (e) {
    //       if (e.response) {
    //         this.$notify({
    //           type: "error",
    //           title: e.response.data.error.message,
    //         });
    //       }
    //     }
    // },

    async getChannels() {
      const params = {
        includeEmpty: true,
        includeFrozen: true,
        myMemberStateFilter: MyMemberStateFilter.JOINED,
        order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
        limit: 20,
        channelNameContainsFilter: this.keyword,
        hiddenChannelFilter: HiddenChannelFilter.ALL,
      };

      this.channelsQuery = await sb.groupChannel.createMyGroupChannelListQuery(
        params
      );

      const channels = await this.channelsQuery.next();
      console.log("channels", channels);
      // const filterDeleted = channels.filter((cn) => {
      //   if (cn.members.length < 2) {
      //     cn.leave();
      //   }
      //   return cn.members.length >= 2;
      // });
      this.channels = channels;
    },

    async handleSelectChannel(channel) {
      try {
        this.selectedChannel = null;
        this.messages = [];
        this.isCreateGroup = false;
        this.clearObserver();
        this.messagesLoading = true;
        if (document.body.offsetWidth < MOBILE_SCREEN) {
          this.isShowChatBox = true;
        }

        const PARAMS = {
          limit: 10,
          replyType: "all",
          includeThreadInfo: true,
          includeParentMessageInfo: true,
        };

        this.selectedChannel = channel;
        this.messagesQuery = await channel.createPreviousMessageListQuery(
          PARAMS
        );
        await this.loadMessages();
        // await channel.markAsRead();
        // this.getTotal();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      } finally {
        this.messagesLoading = false;
        this.scrollToLastestMessage();
        setTimeout(() => {
          this.watchFirstMessage();
        }, 1000);
      }
    },

    watchFirstMessage() {
      const target = document.querySelector("#first_message");
      if (!target) return;

      const callback = (entries, observer) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && this.messagesQuery.hasNext) {
            await this.loadMoreMessages();
            this.clearObserver();
          }
        });
      };

      this.observer = new IntersectionObserver(callback, {
        rootMargin: "0px",
        threshold: 1.0,
      });
      this.observer.observe(target);
    },

    async loadMessages() {
      const messages = await this.messagesQuery.load();
      this.messages = messages;
      console.log("message", messages);
    },

    async getTotal() {
      this.totalUnreadMessage =
        await sb.groupChannel.getTotalUnreadMessageCount();
      // this.getTotalUnread(this.totalUnreadMessage)
      return this.totalUnreadMessage;
    },

    clearObserver() {
      const target = document.querySelector("#first_message");
      if (target && this.observer) {
        this.observer.unobserve(target);
        this.observer = null;
      }
    },
    scrollToLastestMessage() {
      window.scroll({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "auto",
      });
    },
  },
};
</script>
