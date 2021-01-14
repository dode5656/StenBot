module.exports = {
  name: "config-userjoin",
  category: "config",
  description: "Change all config variables related to when users join your server.",
  usage: "<SUBCOMMAND>",
  example: "enable",
  options: { permission: "ADMIN", aliases: ["c-userjoin"], enabled: true, guildOnly: true },
  run: async (bot, message, args) => {

    const Discord = require("discord.js");

    if (message.member.hasPermission("ADMINISTRATOR") === false) {
      return bot.noPermsEmbed(`${message.guild.name}`, bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => bot.log.post("error", error));
    }

    //Check if they included a setting
    let setting = args[0];

    if (setting == undefined) {
      return bot.createEmbed("error", "", `Error! You forgot to include a userjoin config setting.`, [], `${message.guild.name}`, bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => bot.log.post("error", error));
    }

    //Get the server config
    const config = await bot.mutils.getGuildById(message.guild.id);

    //settings library
    switch (setting) {
      case "enable":
        if (config.userjoin_enabled == true) {
          return bot.createEmbed("error", "", `Error! Userjoin is already enabled.`, [], `${message.guild.name}`, bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.log.post("error", error));
        }
        bot.mutils.updateGuildById(message.guild.id, {
          userjoin_enabled: true
        })
        bot.createEmbed("success", "", `Userjoin has been enabled!`, [], `${message.guild.name}`, bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.log.post("error", error));
        break;

      case "disable":
        if (config.userjoin_enabled == false) {
          return bot.createEmbed("error", "", `Error! Userjoin is already disabled!`, [], `${message.guild.name}`, bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.log.post("error", error));
        }
        bot.mutils.updateGuildById(message.guild.id, {
          userjoin_enabled: false
        })
        return bot.createEmbed("success", "", `Userjoin has been disabled!`, [], `${message.guild.name}`, bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.log.post("error", error));
        break;

      case "role":
        var targetrole = message.mentions.roles.first();

        if (config.userjoin_enabled === false) {
          return bot.createEmbed("error", "", `Error! Userjoin is not enabled. You can enable it with **sb!config-userjoin enable**`, [], `${message.guild.name}`, bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.log.post("error", error));
        }
        if (targetrole === undefined || "None") {
          bot.mutils.updateGuildById(message.guild.id, {
            userjoin_role: "0"
          })
          return bot.createEmbed("success", "", `The userjoin role has been reset.`, [], `${message.guild.name}`, bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.log.post("error", error));
        }

        let botmember = message.guild.members.cache.get(bot.user.id);
        let comparedpos = targetrole.comparePositionTo(botmember.roles.highest);

        if (comparedpos > 0) {
          return bot.createEmbed("error", "", `Error! That role is higher than the bot, therefore the bot cannot add the role to a user. Please fix this by moving the role below the bot's highest role.`, [], `${message.guild.name}`, bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.log.post("error", error));
        }

        if (targetrole.id == config.userjoin_role) {
          return bot.createEmbed("error", "", `Error! That role is already set as the auto-role.`, [], `${message.guild.name}`, bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.log.post("error", error));
        }

        bot.mutils.updateGuildById(message.guild.id, {
          userjoin_role: targetrole.id
        })
        bot.createEmbed("success", "", `Auto-role is set to **${targetrole.name}**.`, [], `${message.guild.name}`, bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.log.post("error", error));

        break;
      case "name":
        var name = args.slice(1).join(" ");

        if (name === undefined || "None") {
          bot.mutils.updateGuildById(message.guild.id, {
            userjoin_nickname: "None"
          })
          return bot.createEmbed("success", "", `The userjoin nickname has been reset.`, [], `${message.guild.name}`, bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.log.post("error", error));
        }

        if (name.length > 32) {
          return bot.createEmbed("error", "", `Error! The name is too long! It has to be less than **32** characters!`, [], `${message.guild.name}`, bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.log.post("error", error));
        }

        bot.mutils.updateGuildById(message.guild.id, {
          userjoin_nickname: name
        })
        bot.createEmbed("success", "", `Auto-name is set to **${name}**`, [], `${message.guild.name}`, bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.log.post("error", error));

        break;
      default:
        return bot.createEmbed("error", "", `Error! There isn't a userjoin config setting called **${setting}**`, [], `${message.guild.name}`, bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.log.post("error", error));
    }
  },
};