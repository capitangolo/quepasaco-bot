const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = function (m) {

  return {
    data: new SlashCommandBuilder()
      .setName('roles_reactions')
      .setDescription('Configures the roles reactions')
      .addSubcommand(subcommand =>
        subcommand
          .setName('set_message_id')
          .setDescription('Sets the message where users can set up their roles')
          .addStringOption(option =>
            option
              .setName('messageid')
              .setDescription('The messageID to look for reactions.')
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('list_roles')
          .setDescription('Provides information on the message and roles attached')
          .addBooleanOption(option =>
            option
              .setName('code_output')
              .setDescription('If true, it will output the commands needed to restore the actual config.')
              .setRequired(false)
          )

      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('add_reaction_role')
          .setDescription('Ties an emoji to a role')
          .addStringOption(option =>
            option
              .setName('emoji')
              .setDescription('The emoji that will represent the role.')
              .setRequired(true)
          )
          .addMentionableOption(option =>
            option
              .setName('role')
              .setDescription('The role that will be provided when the user reacts with the emoji.')
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('remove_reaction_role')
          .setDescription('Unlinks an emoji from a role')
          .addStringOption(option =>
            option
              .setName('emoji')
              .setDescription('The emoji that will represent the role.')
              .setRequired(true)
          )
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    async execute(interaction) {
      let message = '';
      let emoji = undefined;
      let role = undefined;
      switch(interaction.options.getSubcommand()) {
        case 'set_message_id':
          m.c.DISCORD_ROLES_MESSAGE_ID = interaction.options.getString('messageid');
          message = `Discord roles messageID set to: ${m.c.DISCORD_ROLES_MESSAGE_ID}`;
          console.log(message);
		      await interaction.reply(message);
          break;
        case 'list_roles':
          console.log(`Listing roles.`);
          if (interaction.options.getBoolean('code_output')) {
            message = `/roles_reactions set_message_id messageid:${m.c.DISCORD_ROLES_MESSAGE_ID}`;
            m.c.DISCORD_ROLES_MAPPING.forEach((role, emoji, map) => {
              message += `\n/roles_reactions add_reaction_role emoji:${emoji} role:@${role}`;
            })
          } else {
            message = `Messageid:${m.c.DISCORD_ROLES_MESSAGE_ID}`;
            m.c.DISCORD_ROLES_MAPPING.forEach((role, emoji, map) => {
              message += `\n ${emoji} => @${role}`;
            });
          }
		      await interaction.reply(message);
          break;
        case 'add_reaction_role':
          emoji = interaction.options.getString('emoji');
          role = interaction.options.getMentionable('role');
          m.c.DISCORD_ROLES_MAPPING.set(emoji, role.name);
          message = `Assigned role @${role.name} to ${emoji}`;
          console.log(message);
		      await interaction.reply(message);
          break;
        case 'remove_reaction_role':
          emoji = interaction.options.getString('emoji');
          if (m.c.DISCORD_ROLES_MAPPING.has(emoji)) {
            role = m.c.DISCORD_ROLES_MAPPING.get(emoji);
            message = `Removed role @${role} from ${emoji}`;
          } else {
            message = `No role set for ${emoji}`;
          }
          console.log(message);
		      await interaction.reply(message);
          break;
      }
	  },
  };
};
