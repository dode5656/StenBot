module.exports = {
  name: "config-tickets",
  category: "config",
  description: "Change all config variables related to tickets.",
  usage: "sb!config-tickets <SUBCOMMAND>",
  permission: "ADMIN",
  run: async (bot, message, args) => {

    const Discord = require("discord.js");
    if (!message.guild) return;
    const fs = require("fs");
    const checker = require("typechecker");

    let servertag = message.guild.name;

    const ownersid = message.guild.ownerID;
    const adminperm = message.member.hasPermission("ADMINISTRATOR");

    var access = true;

    if (adminperm == false) {
      var access = false;
    }

    if (access == false) {
      if (ownersid == message.author.id) {
        var access = true;
      }
    }

    if (access == false) {
      return bot.createEmbed("error","",`Error! You are not the owner or admin of this guild.`,[],`${message.guild.name}`,bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => bot.logger("error", error));
    }

    //Check if they included a setting
    let setting = args[0];

    if (setting == undefined) {
      return bot.createEmbed("error","",`Error! You forgot to include a ticket setting.`,[],`${message.guild.name}`,bot)
        .then((embed) => message.channel.send(embed))
        .catch((error) => bot.logger("error", error));
    }

    //Get the server config
    const config = await bot.mutils.getGuildById(message.guild.id);

    //settings library
    switch (setting) {
      case "enable":
        if (config.tickets_enabled == true) {
          return bot.createEmbed("error","",`Error! Tickets are already enabled.`,[],`${message.guild.name}`,bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.logger("error", error));
        }
        bot.mutils.updateGuildById(message.guild.id, { tickets_enabled: true })

        //Check for a category called tickets, if it does not exist create one
        function isCatTickets(element) {
          if (element.constructor.name != "CategoryChannel") {
            return false;
          }
          if (element.name != "Tickets") {
            return false;
          }
          return true;
        }
        if (!message.guild.channels.cache.some(isCatTickets)) {
          message.guild.channels.create("Tickets", { type: "category", reason: 'Category for StenBot Tickets' });
        }

        bot.createEmbed("success","",`Tickets have been enabled.`,[],`${message.guild.name}`,bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.logger("error", error));

        break;
      case "disable":
        if (config.ticketsenabled == false) {
          return bot.createEmbed("error","",`Error! Tickets are already disabled.`,[],`${message.guild.name}`,bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.logger("error", error));
        }
        bot.mutils.updateGuildById(message.guild.id, { tickets_enabled: false })
        //Find and delete tickets category
        message.guild.channels.cache.find(c=>c.name=="Tickets" && c.type=="category").delete();

        bot.createEmbed("success","",`Tickets have been disabled.`,[],`${message.guild.name}`,bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.logger("error", error));
        break;
      case "message":
        var tmessage = args.slice(1).join(" ");

        if (tmessage.length < 1) {
          return bot.createEmbed("error","",`Error! You haven't included a message.`,[],`${message.guild.name}`,bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.logger("error", error));
        }

        if (tmessage.length > 256) {
          return bot.createEmbed("error","",`Error! The message you have provided is too long! Make sure it is less than **256** characters.`,[],`${message.guild.name}`,bot)
            .then((embed) => message.channel.send(embed))
            .catch((error) => bot.logger("error", error));
        }

        bot.mutils.updateGuildById(message.guild.id, { tickets_message: tmessage });
        bot.createEmbed("success","",`Ticket message set!`,[],`${message.guild.name}`,bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.logger("error", error));

        break;
      default:
        return bot.createEmbed("error","",`Error! There is no ticket config setting called **${setting}**.`,[],`${message.guild.name}`,bot)
          .then((embed) => message.channel.send(embed))
          .catch((error) => bot.logger("error", error));
    }
  },
};
