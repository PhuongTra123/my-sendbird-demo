import SendbirdChat from '@sendbird/chat'
import { OpenChannelModule } from '@sendbird/chat/openChannel'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'

export const sb = SendbirdChat.init({
  appId: "10078E63-266E-4490-9580-374BBC2D9233",
  modules: [new OpenChannelModule(), new GroupChannelModule()],
});
