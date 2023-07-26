<template>
    <div class="fixed top-0 right-0 z-20 w-full h-full max-w-[480px] p-4">
      <div class="pack-setting relative bg-[#2F343C] rounded-lg h-full">
        <div
          class="w-full px-4 py-5 pr-6 bg-[#414753] rounded-t-lg flex justify-between"
          style="border-bottom: 1px solid #606876"
        >
          <span class="font-semibold text-white text-base">Channel details</span>
          <div class="text-white text-lg cursor-pointer" @click="$emit('close')">x</div>
          
        </div>
        <div class="pt-16 px-6 flex flex-col">
          <div class="flex gap-6 items-center">
            <div class="relative">
              <DefaultGroupAvt v-if="isGroup" :channel="channel" />
              <UserAvatar v-else :channel="channel" />
              <label
                v-if="isGroup"
                for="cover_url"
                class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer z-10"
              >
                <!-- <WdIcon class="!text-[#1C1F2D] text-xs" name="pencil" /> -->
              </label>
              <input
                id="cover_url"
                accept="image/png, image/jpeg"
                class="hidden"
                type="file"
                :disabled="channel.isFrozen"
                @input="handleInputFile"
              />
            </div>
            <div v-if="isGroup" class="font-semibold text-sm">
              Profile picture
            </div>
          </div>
          <form class="mt-8" @submit="handleSaveName">
            <div class="text-xs text-[#E8EAED] font-semibold">
              {{ isGroup ? 'Pack name' : 'Profile name' }}
            </div>
            <div class="flex gap-2">
              <input
                v-model="packName"
                :disabled="!isGroup || channel.isFrozen"
                type="text"
                class="w-full px-2 bg-[#1E2125] rounded text-white h-10 text-xs mt-1 border border-solid border-[#414753]"
              />
              <button
                v-if="packName !== channel.name"
                mini
                class="mt-1"
                @click="handleSaveName"
              >
                Save
              </button>
            </div>
          </form>
          <div v-if="isGroup" class="mt-8 border-b border-solid border-[#414753]">
            <div class="text-xs text-[#E8EAED] font-semibold mb-1">
              Members: {{ channel.members.length }}
            </div>
            <div
              class="pt-4 pb-6 flex flex-col gap-6 max-h-[200px] overflow-y-auto"
            >
              <div
                v-for="(mem, i) in channel.members"
                :key="i"
                class="flex gap-4 items-center"
              >
                <img
                  class="w-8 rounded-full"
                  :src="
                    mem.plainProfileUrl ||
                    require('@/assets/images/avatar-default.png')
                  "
                  alt="avt"
                />
                <div class="text-sm font-semibold text-white">
                  {{ mem.nickname }}
                </div>
                <div v-if="mem.role === OWNER_ROLE" class="ml-auto">Owner</div>
              </div>
            </div>
          </div>
          <div
            v-if="isGroup"
            class="pt-6 flex gap-4 items-center cursor-pointer"
            @click="handleAddUserToPack"
          >
            <div
              class="w-8 h-8 rounded-full border border-solid border-[#E8EAED] flex items-center justify-center"
            >
              <div class="text-sm text-[#FAFAFA]" name="plus" >+</div>

            </div>
            <div class="font-semibold text-sm">Add to the pack</div>
          </div>
        </div>
        <div
          v-if="isGroup"
          class="absolute bottom-0 p-4 flex gap-4 justify-end w-full"
        >
          <button
            v-if="!channel.isFrozen && channel.myRole === OWNER_ROLE"
            outline
            @click="handleArchivePack"
          >
            Archive
          </button>
          <!-- <button
            v-if="channel.isFrozen && channel.myRole === OWNER_ROLE"
            outline
            @click="handleUnArchivePack"
          >
            UnArchive
          </button> -->
          <button
            v-if="channel.myRole === OWNER_ROLE"
            outline
            @click="handleDeletePack"
          >
            Delete Pack
          </button>
          <button v-else outline @click="handleLeavePack">
            Leave Pack
          </button>
        </div>
        <div v-else class="absolute bottom-0 p-4 flex gap-4 justify-end w-full">
          <button outline @click="handleDelete">
            {{ channel.myRole === OWNER_ROLE ? 'Delete' : 'Leave conversation' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { CHANNEL_TYPE, OWNER_ROLE } from '../../libs/constants'
  import { objectProp } from '../../libs/props'
  import DefaultGroupAvt from './DefaultGroupAvt.vue'
  import UserAvatar from './UserAvatar.vue'
  
  export default {
    components: { DefaultGroupAvt, UserAvatar },
    props: {
      channel: objectProp(),
    },
    data() {
      return {
        packName: '',
        OWNER_ROLE,
        loading: false,
        CHANNEL_TYPE,
      }
    },
    computed: {
      isGroup() {
        return this.channel.channelType === CHANNEL_TYPE.GROUP
      },
    },
    watch: {
      channel() {
        this.packName = this.channel.name
      },
    },
    mounted() {
      this.packName = this.channel.name
    },
    methods: {
      handleAddUserToPack() {
        if (this.channel.isFrozen) return
        this.$modal.show('add-user')
      },
      handleDelete() {
        if (this.channel.myRole === OWNER_ROLE) return this.handleDeletePack()
        this.$modal.show('confirm-box', {
          title: 'Alert',
          message: 'Are you sure that you want to leave this Pack?',
          action: () => this.channel.leave(),
        })
      },
      handleDeletePack() {
        this.$modal.show('confirm-box', {
          title: 'Alert',
          message: 'Are you sure that you want to delete this Pack?',
          action: () => this.channel.delete(),
        })
      },
      handleLeavePack() {
        this.$modal.show('confirm-box', {
          title: 'Alert',
          message: 'Are you sure that you want to leave this Pack?',
          action: () => this.channel.leave(),
        })
      },
      async handleArchivePack() {
        await this.channel.freeze()
        this.$emit('close')
      },
      async handleUnArchivePack() {
        await this.channel.unfreeze()
        this.$emit('close')
      },
      async handleInputFile(e) {
        try {
          this.loading = true
          const file = e.target.files[0]
          const reader = new FileReader()
          reader.onload = evt => {
            e.target.value = null
          }
          reader.readAsDataURL(file)
          const formData = new FormData()
          formData.append('file', file)
          try {
            await this.$api.put(`/chat/channel/${this.channel.url}`, formData)
          } catch (error) {
            this.$notify({
              type: 'error',
              title: error.response.data.error.message,
            })
          }
        } catch (error) {
          this.$notify({
            type: 'error',
            title: error.response.data.error.message,
          })
        } finally {
          this.loading = false
        }
      },
      handleSaveName(e) {
        e && e.preventDefault()
        const params = {
          name: this.packName,
        }
        this.updateChannel(params)
      },
      async updateChannel(params) {
        try {
          await this.$api.put(`/chat/channel/${this.channel.url}`, params)
        } catch (error) {
          this.$notify({
            type: 'error',
            title: error.response.data.error.message,
          })
        }
      },
    },
  }
  </script>
  
  <style lang="scss">
  .pack-setting {
    box-shadow: 0px 4px 16px 0px #000000bf;
  }
  </style>
  