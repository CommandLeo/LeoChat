const { Client } = require('discord.js');
const leochat = require('./leochat');
const config = require('./config.json');
const path = require('path');
const fs = require('fs');
const bot = new Client();

bot.once('ready', () => {
  console.log(`${bot.user.username} is online!`);
  bot.guilds.cache.each(guild => guild.me.setNickname('TTS'));
  //bot.user.setAvatar('https://i.imgur.com/pREnrwo.png').catch(console.error);
});

leochat(bot, config);

bot.login(config.token);
