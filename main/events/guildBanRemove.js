module.exports = async (bot, guild, user) => {
  const Discord = require("discord.js");
  const efunctions = require("../functions/eventfunctions.js");

  let config = efunctions.getConfig(guild.id);
  if (config.loggingenabled == true) {
    if (config.logginglevel == "medium" || config.logginglevel == "high") {
      if (efunctions.checkChannel(config.loggingchannel, bot) == true) {
        let lchannel = bot.channels.cache.get(config.loggingchannel);
        bot.createEmbed("warning", "", `**Member Unbanned**\n**User:** ${user.tag}\n**Unban Date:** ${new Date()}`, [], `${lchannel.guild.name}`, bot)
              .then(embed => lchannel.send(embed))
              .catch(error => console.error(error))
      }
    }
  }
};
