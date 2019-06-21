module.exports = async (bot, oldMessage, newMessage) => {

  const Discord = require("discord.js");
	const efunctions = require("../functions/eventfunctions.js")
	const checker = require("is-url");
	
  let config = efunctions.getConfig(newMessage.guild.id)
  if (config.loggingenabled == true) {
    if (config.logginglevel == "medium" || config.logginglevel == "high") {
      if (efunctions.checkChannel(config.loggingchannel, bot) == true) {
        if (oldMessage.author.bot) return;
        if (oldMessage.createdTimestamp === newMessage.createdTimestamp && checker(oldMessage)) return;
        //AHem
        if (oldMessage.content == newMessage.content) return;
        let lchannel = bot.channels.get(config.loggingchannel);
        lchannel.send({embed: {color: bot.settings.yellow, description:`**Message Edited**\n**Before:**\n${oldMessage}\n**After:**\n${newMessage}\n**Sent in:** ${newMessage.channel}`, footer: {icon_url: newMessage.author.avatarURL, text: 'Message Edited'}, timestamp: new Date()}})
      }
    }
  }
};