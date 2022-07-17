const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval').setDescription('Run JavaScript code from within the bot.')
    .addStringOption(option => option.setName('code').setDescription('The code to run').setRequired(true)),
  category: 'botowner',
  usage: '<CODE>',
  example: 'message.channel.send("Hello World!")',
  options: { permission: 'BOTOWNER', enabled: true, guildOnly: true },
  run: async (bot, interaction) => {

    const Discord = require('discord.js');

    //Permission Check
    if (interaction.user.id !== bot.settings.ids.botOwner) {
      return;
    }

    try {
      let codein = interaction.getString('code');
      let code = eval(codein);

      if (typeof code !== 'string')
        code = require('util').inspect(code, {
          depth: 0,
        });
      let embed = new Discord.EmbedBuilder()
        .setTitle('Evaluate')
        .setColor(bot.settings.color.yellow)
        .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
        .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
        .setFooter({ text: 'Eval Command', iconURL: bot.user.avatarURL() })
        .setTimestamp();
      interaction.reply({ embeds: [embed.toJSON()], ephemeral: true });
    } catch (e) {
      interaction.reply(`\`\`\`js\n${e}\n\`\`\``);
    }
  },
};