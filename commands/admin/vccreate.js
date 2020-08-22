module.exports = {
  name: "vccreate",
  category: "admin",
  description: "Creates a voice channel.",
  usage: "sb!vccreate <NAME>",
  permission: "ADMINS",
  run: async (bot, message, args) => {
    const Discord = require("discord.js");
    const fs = require("fs");

    const config = JSON.parse(fs.readFileSync(`./data/servers/server-${message.guild.id}/serverconfig.json`, "utf8"));

    if (config.staffadminenabled == false) {
      return bot.createEmbed("error", "", `Error! Admin commands are disabled. To use them, enable them with **sb!config-staff admin enable**`, [], `${message.guild.name}`, bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => console.error(error));
    }

    var n = args.slice(0).join(" ");

    if (n.length < 1) {
      return bot.createEmbed("error", "", `Error! You forgot to include a name for the channel!`, [], `${message.guild.name}`, bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => console.error(error));
    }

    if (message.member.hasPermission("ADMINISTRATOR") == false) {
      return bot.noPermsEmbed(`${message.guild.name}`, bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => console.error(error));
    }

    if (n.length > 100) {
      return bot.createEmbed("error", "", `The voice channel name has to be between 1 and 100 in **length**`, [], `${message.guild.name}`, bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => console.error(error));
    }

    message.guild.channels.create(`${n}`, { type: 'voice', reason: `Created by ${message.author.tag}` }).then((channel) => {
      return bot.createEmbed("success", "", `The voice channel **${channel.name}** has been created.`, [], `${message.guild.name}`, bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => console.error(error));
    });
  },
};
