<!-- eslint-disable vue/no-v-html -->
<template>
    <div class="message-container">

        <!-- <div class="max-w-[300px] overflow-clip"> {{ message.message }}</div> -->

        <div v-if="message.sender && message.customType !== typeMessage.SYSTEM"
            :class="containerClasses">
            <img :src="message.sender.plainProfileUrl ||
                require('@/assets/images/avatar-default.png')
                " :alt="message.sender.nickname" class="w-6 aspect-square rounded-full" />
            <div class="min-w-[120px]">
                <div :class="messageClasses">
                    <div v-if="!isSender" class="text-normal-300 font-semibold">
                        {{ message.sender.nickname }}
                    </div>

                    <!-- MEDIA MESSAGGE -->
                    <!-- <div v-if="message.customType === typeMessage.MEDIA ||
                        message.customType === typeMessage.FORWARD_MEDIA
                        ">
                        <img v-if="urlIsImage(message.plainUrl)" :src="message.plainUrl" alt="media"
                            class="max-w-[300px] max-h-[400px]" @click="handleShowImg" />
                        <video v-else ref="video" :src="message.plainUrl" controls muted loop
                            class="max-w-[300px] max-h-[400px]">
                            Your browser does not support the video tag.
                        </video>
                        <WdTypography variant="subtitle" class="max-w-[300px] overflow-clip mt-2"
                            v-html="convertMediaMessage"></WdTypography>
                    </div> -->
                    <!-- /MEDIA MESSAGGE -->
                    <!-- CONTRIBUTE BET -->
                    <!-- <div v-if="message.customType === typeMessage.CONTRIBUTE_BET">
                        <img :src="contributeBetMsg.image" alt="media" class="max-w-[300px] max-h-[400px]"
                            @click="handleShowCopyBet" />
                        <ButtonAddBetslip class="mt-2 w-full" :contribute-data="contributeBetMsg" :message="message" />
                        <WdTypography v-if="!isSystemMessage" variant="subtitle" class="max-w-[300px] overflow-clip mt-2"
                            v-html="convertMessage" />
                    </div> -->

                    <!-- /FORWARD MSG -->
                    <!-- <div v-else-if="message.customType === typeMessage.FORWARD">
                        <template v-if="forwardMsg.image">
                            <img :src="forwardMsg.image" alt="media" class="max-w-[300px] max-h-[400px]"
                                @click="handleShowForwardMsg" />
                            <ButtonAddBetslip class="mt-2 w-full" :contribute-data="forwardMsg" :message="message" />
                        </template>

                        <ShareBetMessage v-if="forwardMsg.tid" :message="message" />

                        <WdTypography v-if="!isSystemMessage" variant="subtitle" class="max-w-[300px] overflow-clip mt-2"
                            v-html="convertMessage" />
                    </div> -->

                    <!-- SHARE BET MESSAGE -->
                    <!-- <div v-else-if="message.customType === typeMessage.SHARE_BET">
                        <ShareBetMessage :message="message" />
                        <WdTypography v-if="!isSystemMessage" variant="subtitle" class="max-w-[300px] overflow-clip mt-2"
                            v-html="convertMessage" />
                    </div> -->
                    <!-- SHARE BET MESSAGE -->

                    <!-- TEXT MESSAGE -->
                    <div v-else-if="!isSystemMessage" variant="subtitle" class="max-w-[300px] overflow-clip"
                        v-html="convertMessage" />

                    <!-- /TEXT MESSAGE -->

                    <!-- PREVIEW LINK -->
                    <!-- <a v-if="ogMetaData" :href="ogMetaData.url" target="_blank" rel="noopener noreferrer"
                        class="mt-2 max-w-[300px]">
                        <div>
                            <img v-if="ogMetaData.defaultImage" :src="ogMetaData.defaultImage.url" alt="meta"
                                class="max-w-full max-h-[200px] mx-auto" />
                            <div class="text-base font-bold mt-2">{{ ogMetaData.title }}</div>
                            <div class="text-xs mt-1">
                                {{ ogMetaData.description }}
                            </div>
                        </div>
                    </a> -->
                    <!-- /PREVIEW LINK -->

                    <!-- HANDLE -->
                    <!-- <div v-if="!selected" class="options-btn absolute flex items-center cursor-pointer top-0 h-full" :class="!isSender
                            ? 'pl-[28px] pr-2 right-[-20px] text-left'
                            : 'pr-[28px] pl-2 left-[-20px] text-right'
                        " @click="handleOpenActions">
                        <WdIcon name="option-vertical" />
                    </div>
                    <div v-if="selected" :ref="`actions_${message.messageId}`"
                        class="message-btn min-w-[160px] text-xs absolute cursor-pointer top-0 h-full text-normal-300 flex items-center"
                        :class="!isSender
                                ? 'right-[-175px] text-left'
                                : 'left-[-175px] text-right'
                            ">
                        <div class="flex gap-2 bg-normal-400 p-1 rounded">
                            <div v-if="!message.parentMessage"
                                class="hover:scale-[1.1] text-normal-100 transition-transform" @click="() => {
                                        selected = false
                                        $emit('handleReplyMessage', message)
                                    }
                                    ">
                                Reply
                            </div>
                            <div class="hover:scale-[1.1] text-normal-100 transition-transform" @click="handlePinMessage">
                                Pin
                            </div>
                            <div class="hover:scale-[1.1] text-normal-100 transition-transform"
                                @click="handleForwardMessage">
                                Forward
                            </div>
                            <div class="hover:scale-[1.1] text-normal-100 transition-transform" @click="handleCopyMessage">
                                <span v-if="isCopied">Copied</span>
                                <span v-else>Copy</span>
                            </div>
                        </div>
                    </div> -->
                    <!-- /HANDLE -->
                </div>

                <div class="text-xs text-normal-300 flex flex-row justify-between mt-1">
                    <div>{{ distanceToNow(message.createdAt ) }}</div>
                </div>
            </div>
        </div>

    </div>
</template>
  
<script>
import { formatRelative } from 'date-fns'
import { enAU } from 'date-fns/locale'

//   import { Notification } from 'element-ui'
import { AUTH, typeMessage } from '../../libs/constants'
//   import WdIcon from '../WdIcon.vue'
//   import ForwardMessage from './ForwardMessage.vue'
//   import ShareBetMessage from './ShareBetMessage.vue'
//   import ButtonAddBetslip from './ButtonAddBetslip.vue'
//   import { MENTION_REGEX } from '@/libs/constants'
import { booleanProp, objectProp } from '@/libs/props'
//   import urlify from '@/libs/helpers/urlify'
import { distanceToNow } from "@/libs/format";

export default {
    // components: { ForwardMessage, WdIcon, ShareBetMessage, ButtonAddBetslip },
    props: {
        message: objectProp(),
        seen: booleanProp(),
        channel: objectProp(),
        isCopied: booleanProp(),
    },
    data() {
        return {
            distanceToNow,
            // enAU,
            replyMessage: null,
            // MENTION_REGEX,
            typeMessage,
            idTextCopied: null,
            selected: false,
        }
    },
    computed: {
        isSender() {
            if (!this.message) return false
            return (
                this.message.sender &&
                this.message.sender.userId === AUTH.userId
            )
        },
        containerClasses() {
            return {
                'flex gap-2 justify-start items-start relative': true,
                'flex-row-reverse': this.isSender,
            }
        },
        messageClasses() {
            return {
                'rounded border border-normal-400 p-2 grid gap-2 bg-normal-400 relative': true,
                '!bg-normal-500': this.isSender,
            }
        },
        isSystemMessage() {
            return this.message.message && this.message.message.slice(-1) === '\u0020'
        },
        forwardMsg() {
            const { customType, data } = this.message
            const { FORWARD } = typeMessage
            if (customType !== FORWARD) return ''
            if (!data) return ''
            const contributeData = JSON.parse(data)
            return contributeData
        },
        convertMessage() {
            if (!this.message.message) return ''
            const message = this.message.message.split(' ').map(mess => {
                // const url = urlify(mess)
                // if (
                //     MENTION_REGEX.test(mess) &&
                //     this.channel.members
                //         .map(mem => mem.userId)
                //         .includes(mess.replace('@', ''))
                // )
                //     return `<span class="font-semibold text-blue-500 cursor-pointer">${mess}</span>`
                // if (url) {
                //     url.forEach(item => {
                //         mess = mess.replaceAll(
                //             `${item}`,
                //             `<a class="text-info-200 hover:underline" href="${item}" target="_blank">${item}</a>`
                //         )
                //     })
                // }
                return mess
            })
            return message.join(' ')
        },
        convertMediaMessage() {
            if (!this.message.data) return ''
            const message = this.message.data.split(' ').map(mess => {
                if (
                    MENTION_REGEX.test(mess) &&
                    this.channel.members
                        .map(mem => mem.userId)
                        .includes(mess.replace('@', ''))
                )
                    return `<span class="font-semibold text-blue-500 cursor-pointer">${mess}</span>`
                return mess
            })
            return message.join(' ')
        },
        ogMetaData() {
            if (!this.message.ogMetaData) return ''
            return this.message.ogMetaData
        },
    },
    created() {
        // eslint-disable-next-line nuxt/no-globals-in-created
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        formatRelative,
        handleReply(message) {
            this.replyMessage = message
        },
        handleParentMessageClick() {
            const parentMessageElm = document.getElementById(
                `wd_msg_${this.message.parentMessage.messageId}`
            )
            if (parentMessageElm)
                return parentMessageElm.scrollIntoView({ block: 'center' })
            this.$emit('handleIfNotParentMessageInList')
        },
        handleForwardMessage() {
            this.selected = false
            this.$emit('handleForwardMessage', this.message)
        },
        handlePinMessage() {
            this.selected = false
            this.$emit('handlePinMessage', this.message)
        },
        closeActions() {
            this.selected = false
            window.document.removeEventListener('click', this.closeActions)
        },
        handleCopyMessage() {
            try {
                navigator.clipboard.writeText(this.message.message)
                this.$emit('handleCopy', this.message.messageId)
                this.idTextCopied = this.message.messageId
                this.selected = false
                Notification.info({
                    title: 'Copied',
                    message: 'Message has been copied',
                    duration: 1000,
                    customClass: 'error-notification',
                })
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error)
            }
        },
        urlIsImage(url) {
            return url.match(/\.(jpeg|jpg|png)$/) != null
        },

        handleOpenActions() {
            this.selected = true
            setTimeout(() => {
                window.document.addEventListener('click', this.closeActions)
            }, 0)
        },
        handleScroll() {
            if (!this.$refs.video) return
            const video = this.$refs.video
            const windowHeight = window.innerHeight
            const rect = video.getBoundingClientRect().top
            const videoHeight = video.clientHeight
            if (
                rect <= windowHeight - videoHeight * 0.5 &&
                rect >= 0 - videoHeight * -0.3
            ) {
                video.play()
            } else {
                video.pause()
            }
        },
        handleShowImg() {
            this.$modal.show('img-zoom', { img: this.message.plainUrl })
        },
        handleShowCopyBet() {
            this.$modal.show('img-zoom', { img: this.contributeBetMsg.image })
        },
        handleShowForwardMsg() {
            this.$modal.show('img-zoom', { img: this.forwardMsg.image })

        },
    },
}
</script>
  
<style lang="scss">
.message-container {
    .options-btn {
        display: none;
    }

    &:hover {
        .options-btn {
            display: flex;
        }
    }
}
</style>
  