module.exports = {
  name: "bal",
  category: "eco",
  description: "Check your balance.",
  usage: "sb!bal",
  permission: "EVERYONE",
  run: async (bot, message, args) => {
    const Discord = require("discord.js");
    const fs = require("fs");
    const db = require("quick.db");

    let person = message.mentions.users.first() || message.author;

    if (!person) return message.channel.send("Help Embed Needs Doing");

    if (person.id === message.author.id) {
      let bal = db.fetch(`money_${message.author.id}`);
      if (bal === null) bal = 0;
      bot
        .createEmbed(
          "info",
          "Balance",
          `You currently have a balance of **${bal}** coins.`,
          [],
          `${message.guild.name}`,
          bot
        )
        .then((embed) => message.channel.send(embed))
        .catch((error) => console.error(error));
    } else {
      let bal = db.fetch(`money_${message.author.id}`);
      if (bal === null) bal = 0;
      bot
        .createEmbed(
          "info",
          `${person.tag}'s Balance`,
          `${person.tag} currently has a balance of **${bal}** coins.`,
          [],
          `${message.guild.name}`,
          bot
        )
        .then((embed) => message.channel.send(embed))
        .catch((error) => console.error(error));
    }
  },
};
