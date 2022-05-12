module.exports = {
  name: "neko",
  category: "fun",
  description: "See a randomly generated picture of a Neko, also known as a Catgirl.",
  usage: "",
  example: "",
  options: { permission: "EVERYONE", enabled: true, cooldown: 3, guildOnly: false },
  run: async (bot, message, args) => {
    
    const Discord = require("discord.js");
    const fetch = require("node-fetch");

    let url;
    await fetch(`http://api.nekos.fun:8080/api/lewd`)
        .then(res => res.json())
        .then(json => url = json.image)

    const nekoEmbed = {
      "title": "I present your Neko:",
      "image": {
        "url": url
      },
      "color": bot.settings.color.yellow,
      "footer": {
        "text": "Powered by nekos.fun"
      }
    }

    message.reply({ embeds: [ nekoEmbed ]});

  },
}