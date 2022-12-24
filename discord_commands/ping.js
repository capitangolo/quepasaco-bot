const { SlashCommandBuilder } = require('discord.js');

module.exports = function (m) {

  return {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),
    async execute(interaction) {
		  await interaction.reply('Pong!');
	  },
  };
};
