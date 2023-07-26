<template>
  <div class="px-6 flex flex-col justify-between relative">
    <div>
      <div class="pt-4 bg-normal-700 sticky top-[68px] z-10">
        <div class="bg-[#FCFFFD] border border-[gray]  rounded-xl py-3 px-6">
          <div class="flex items-center">
            <span class="mr-1 min-w-[60px]">Name:</span>
            <input
              v-model="groupName"
              type="text"
              class="w-full input-name"
              placeholder="Pack name"
            />
          </div>
          <div class="flex items-center">
            <span class="mr-1 min-w-[60px]">To:</span>
            <el-select
              v-model="selectedUser"
              multiple
              filterable
              clearable
              placeholder="Search"
              class="w-full custom-select"
            >
              <el-option
              v-for="item in options"
                :key="item.value"
                clearable
                :label="item.label"
                :value="item.value"
              >
                <slot>
                  <div class="mb-1 flex items-center">
                    <img
                      :src="
                        item.avt ||
                        require('@/assets/images/avatar-default.png')
                      "
                      class="w-[20px] h-[20px] rounded-full mr-4"
                    />
                    {{ item.label }}
                  </div>
                </slot>
              </el-option>
            </el-select>
            <div class="absolute top-[18px] right-[22px]">x</div>
            <!-- <WdIcon
                name="times"
                class="cursor-pointer"
                @click="$emit('close')"
              /> -->
          </div>
          <!-- :loading="loading" -->
          <div class="ml-auto mt-2 cursor-pointer" @click="handleSubmit">Submit</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { typeMessage, AUTH, listUser } from "../../libs/constants";
import { Notification } from "element-ui";
//   import SendMessage from './SendMessage.vue'
export default {
  components: {
    //   WdIcon,
    //   SendMessage,
    //   BaseButton,
  },
  data() {
    return {
      groupName: "",
      options: [],
      selectedUser: [],
      loading: false,
      listUser,
    };
  },
  mounted() {
    this.getFollower()
  },

  methods: {
    getFollower() {
      const convertData = listUser.map((user) => ({
        label: user.username,
        value: user.username,
        avt: user.profileImage,
      }));
      this.options = convertData;
    },
    showErrorNotifi(text) {
      Notification.error({
        title: "Error",
        message: text,
        duration: 3000,
        customClass: "error-notification",
      });
    },

    handleSubmit() {
      if (!this.groupName) return this.showErrorNotifi("Please fill pack name");
      if (this.selectedUser.length < 2)
        return this.showErrorNotifi("The number of users must be more than 1");
      this.handleCreateGroup();
    },
    async handleCreateGroup() {
        console.log('this.selectedUser', this.selectedUser)
      try {
        this.loading = true;
        const params = {
          name: this.groupName,
          invitedUserIds: this.selectedUser,
          customType: "group",
          operatorUserIds: [AUTH.userId],
          isDistinct: true,
        };
        const channel = await this.$sb.groupChannel.createChannel(params);

        const message = {
          message: `${AUTH.userId} has created group`,
          customType: typeMessage.SYSTEM,
        };
        await channel.sendUserMessage(message).onSucceeded((mess) => {
          this.$emit("sendedMessage", mess);
        });
        this.$emit("select", channel);
      this.$emit("handleClickCreateGroupChannel", false);
      } catch (error) {
        // eslint-disable-next-line no-console
        this.$notify({
          type: "error",
          title: error.response.data.error.message,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.input-name {
  margin-left: 15px;
  &::placeholder {
    color: rgb(191, 194, 201);
  }
}
</style>
