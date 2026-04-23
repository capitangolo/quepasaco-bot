const { SlashCommandBuilder } = require('discord.js');

module.exports = function (m, u) {

  return {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!'),
    async execute(interaction) {
		  await interaction.reply('Pong!');
	  },
  };
};
