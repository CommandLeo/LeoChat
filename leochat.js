const googleTTS = require('node-google-tts-api');
const tts = new googleTTS();
const { Readable } = require('stream');

module.exports = (bot, config) => {
  bot.on('message', async message => {
    if (config.channels.includes(message.channel.name) && config.users.includes(message.author.tag) && !config.ignoreCharacters.some(character => message.content.startsWith(character))) {
      const voiceChannel = message.member.voice.channel || (config.speakOutside && message.guild.me.voice.channel);
      if (voiceChannel) {
        if (config.changeNickname) message.guild.me.setNickname(`[TTS] ${message.member.displayName}`);
        if (config.deleteMessage) message.delete();
        const connection = await voiceChannel.join();
        connection.play(Readable.from(await tts.get({text: message.content, lang: config.language || 'en-us', limit_bypass: true})));
      }
    }
  });

  bot.on('voiceStateUpdate', oldState => {
    const me = oldState.guild.me;
    if (config.autoLeave && me != oldState.member && oldState.channel?.id == me.voice.channelID && oldState.channel?.members.filter(member => !member.user.bot).size <= 1) {
      me.voice.channel?.leave();
    };
  });
}
