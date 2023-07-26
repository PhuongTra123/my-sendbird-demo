<template>
  <!-- <div class="px-6 flex flex-col justify-between"> -->
  <!-- <div> -->
  <div
    class="absolute pt-4 top-[50%] left-[50%] z-10 w-[500px] -translate-x-1/2 -translate-y-1/2"
  >
    <div
      class="bg-[#FCFFFD] border border-[gray] flex flex-col justify-between rounded-xl py-3 px-6"
    >
      <!-- <div> -->
      <div class="flex justify-between items-center py-3.5 px-8 bg-normal-650">
        <div class="font-semibold text-[25px]">New message</div>
        <div
          class="!text-black text-[25px] font-semibold cursor-pointer"
          @click="close"
        >
          x
        </div>
      </div>

      <div
        class="hover:!bg-normal-500 cursor-pointer px-8 py-4"
        @click="handleCreateGroup"
      >
        <span
          class="font-semibold px-2 py-1 pb-2 border border-[gray] rounded-lg"
          >Create a group</span
        >
      </div>
      <div ref="list" class="h-[50vh] grid gap-x-4 auto-rows-max overflow-auto">
        <div
          v-for="(item, ind) in getUser"
          :key="ind"
          class="flex justify-between items-center pl-8 cursor-pointer hover:!bg-normal-500"
          @click="handleClick(item)"
        >
          <div class="flex gap-4 py-2 items-center">
            <img
              :src="
                item.profileImage ||
                require('@/assets/images/avatar-default.png')
              "
              class="w-11 h-11 rounded-full pointer-events-none"
              alt="avt"
            />

            <div>
              <div>
                <div class="max-w-[400px] font-semibold">
                  {{ item.username }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
  <!-- </div> -->
  <!-- </modal> -->
</template>

<script>
//   import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
//   import debounce from 'debounce'
// eslint-disable-next-line no-unused-vars
import { typeMessage, listUser, AUTH } from "../../libs/constants";

export default {
  data() {
    return {
      keyword: "",
      query: null,
      message: "",
      AUTH,
    };
  },
  // async fetch() {
  //   this.resetUserList()
  //   this.isShow = false
  //   await this.getFollowerData(this.keyword)
  // },
  computed: {
    //   ...mapState('account/get-follower', {
    //     loading: 'loading',
    //   }),
    //   ...mapGetters('account/get-follower', {
    //     list: 'followerList',
    //   }),
    getUser() {
      return listUser;
    },
  },
  // watch: {
  //   keyword: debounce(async function (val) {
  //     this.resetUserList()
  //     await this.getFollowerData(this.keyword)
  //   }, 500),
  // },
  // destroyed() {
  //   const followerList = this.$refs.list
  //   if (!followerList) return
  //   followerList.removeEventListener('scroll', this.loadMore)
  // },
  methods: {
    //   ...mapActions({
    //     getFollowerData: 'account/get-follower/load',
    //   }),
    //   ...mapMutations('account/get-follower', {
    //     resetUserList: 'RESET',
    //   }),
    //   async getFollower(val) {
    //     await this.getFollowerData(val)
    //   },
    //   initEvent() {
    //     const followerList = this.$refs.list
    //     followerList.addEventListener('scroll', this.loadMore)
    //   },
    //   loadMore() {
    //     const followerList = this.$refs.list
    //     if (
    //       followerList.offsetHeight + followerList.scrollTop >=
    //       followerList.scrollHeight
    //     ) {
    //       this.getFollowerData(this.keyword)
    //     }
    //   },
    async handleClick(item) {
      try {
        // const formData = new FormData();
        // formData.append("name", item.fullName);
        // if (item.profileUrl) formData.append("coverUrl", item.profileUrl);
        // formData.append("userIds[]", item.userName);

        // const { data } = await this.$api.post("/chat/channel", formData);

        const params = {
          name: item.username,
          invitedUserIds: [item.username],
          coverUrl:
            item.profileImage || require("@/assets/images/avatar-default.png"),
          customType: "1-1",
          operatorUserIds: [AUTH.userId],
          isDistinct: true,
        };

        const channel = await this.$sb.groupChannel.createChannel(params);
        // this.$emit("select", channel);
        // this.$emit("handleClickCreateGroup", false);
        console.log("channel", channel);

        // const channel = await this.$sb.groupChannel.getChannel(
        //   data.data.channelUrl
        // );

        if (!channel.lastMessage) {
          const messParams = {
            message: "A chat has been created",
            customType: typeMessage.SYSTEM,
          };
          channel.sendUserMessage(messParams).onSucceeded((message) => {
            this.$emit("select", channel);
            this.$emit("handleClickCreateGroup", false);
          });
          return;
        }
        // this.$emit("select", channel);
        // this.$modal.hide("create-channel");
      } catch (e) {
        if (e.response) {
          console.log(e.response);
        }
      }
    },
    close() {
      this.$emit("handleClickCreateGroup", false);
    },
    closeItem(item) {
      this.users = this.users.filter((user) => user !== item);
    },
    handleClose() {
      this.keyword = "";
      this.users = [];
      this.resetUserList();
    },
    handleCreateGroup() {
      this.close();
      this.$emit("handleClickCreateGroupChannel", true);
    },
  },
};
</script>
