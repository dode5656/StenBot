module.exports = async (bot, role) => {
  const Discord = require("discord.js");
  const efunctions = require("../functions/eventUtils.js");

  let config = efunctions.getConfig(role.guild.id);
  if (config.loggingenabled == true) {
    if (efunctions.checkChannel(config.loggingchannel, bot) == true) {
      let lchannel = bot.channels.cache.get(config.loggingchannel);
      lchannel.send({
        embed: {
          color: bot.settings.color.yellow,
          description: `**Role Deleted**\n**Name:** ${role.name}\n**Id:** ${role.id}`,
          footer: { text: "Role Deleted" },
          timestamp: new Date(),
        },
      });
    }
  }
};
