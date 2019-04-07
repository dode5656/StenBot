exports.run = (bot, message, args) => {

    const Discord = require("discord.js");
    const fs = require("fs");


    const config = JSON.parse(fs.readFileSync(`./data/servers/server-${message.guild.id}/serverconfig.json`, "utf8"));

    if (config.staffadminenabled == false) {
        return message.channel.send({
            embed: {
                color: bot.settings.red,
                description: `Error! Admin commands are disabled. To use them, enable them with **.config-staff admin enable**`
            }
        });
    };

    var n = args[0];


    if (n == undefined) {
        return message.channel.send({
            embed: {
                color: bot.settings.red,
                description: `Error! You forgot to include a name for the channel!`
            }
        });
    };



    if (message.member.hasPermission("ADMINISTRATOR") == false) {
        return message.channel.send({
            embed: {
                color: bot.settings.red,
                description: `Error! You do not have permission to issue this command!`
            }
        });
    };

    var t = args.slice(1).join(" ") || "None";

    if (n.length > 100) {
      return message.channel.send({
        embed: {
          color: bot.settings.red,
          description: `The channel name has to be between 1 and 100 in **length**`
        }
      })
    };

    if(t.length > 1024) {
      return message.channel.send({
        embed: {
          color: bot.settings.red,
          description: `The channel topic has to be less that 1024  characters.`
        }
      })
    };

    message.guild.createChannel(`${n}`, "text").then(channel => {
      channel.setTopic(`${t}`);
      message.channel.send({embed: {color: bot.settings.green, description: `The channel **${channel.name}** has been created.`}});
    });
};
