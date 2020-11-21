const tts = require('google-tts-api');
const textchunk = require('textchunk');

module.exports = (bot, config) => {
  bot.on('message', async message => {
    if (config.channels.includes(message.channel.name) && config.users.includes(message.author.tag) && !config.ignoreCharacters.some(character => message.content.startsWith(character))) {
      const voiceChannel = message.member.voice.channel || (config.speakOutside && message.guild.me.voice.channel);
      if (voiceChannel) {
        if (config.changeNickname) ssage.guild.me.setNickname(`[TTS] ${message.member.displayName}`);
        if (config.deleteMessage) message.delete();
        const connection = await voiceChannel.join();
        const parts = textchunk.chunk(message.content, 200);
        play(connection, parts);
      }
    }
  });

  bot.on('voiceStateUpdate', oldState => {
    const me = oldState.guild.me;
    if (config.autoLeave && me != oldState.member && oldState.channel?.id == me.voice.channelID && oldState.channel?.members.filter(member => !member.user.bot).size <= 1) {
      me.voice.channel?.leave();
    };
  })

  async function play(connection, parts, i = 0) {

    const dispatcher = connection.play(await tts(parts[i], config.language || 'it', config.speed || 1));

    dispatcher.on('finish', () => {
      if (i < parts.length - 1) play(connection, parts, i + 1);
    });

  }
}
