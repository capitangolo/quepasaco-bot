const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

class RolesReactionsCommand {

  #mapping = undefined;

  constructor(mapping) {
    this.#mapping = mapping
  }

  data = new SlashCommandBuilder()
    .setName('roles_reactions')
    .setDescription('Configures the roles reactions')
    .addSubcommand(subcommand => subcommand
      .setName('set_message_id')
      .setDescription('Sets the message where users can set up their roles')
      .addStringOption(option => option
        .setName('messageid')
        .setDescription('The messageID to look for reactions.')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('list_roles')
      .setDescription('Provides information on the message and roles attached')
      .addBooleanOption(option => option
        .setName('code_output')
        .setDescription('If true, it will output the commands needed to restore the actual config.')
        .setRequired(false)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('add_reaction_role')
      .setDescription('Ties an emoji to a role')
      .addStringOption(option => option
        .setName('emoji')
        .setDescription('The emoji that will represent the role.')
        .setRequired(true)
      )
      .addMentionableOption(option => option
        .setName('role')
        .setDescription('The role that will be provided when the user reacts with the emoji.')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('remove_reaction_role')
      .setDescription('Unlinks an emoji from a role')
      .addStringOption(option => option
        .setName('emoji')
        .setDescription('The emoji that will represent the role.')
        .setRequired(true)
      )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    console.log(`Received command: roles_reactions ${subcommand}`);
    const message = this[subcommand](interaction.options);
    console.log(message);
		await interaction.reply(message);
  }

  set_message_id(options) {
    const messageID = options.getString('messageid');
    this.#mapping.setMessageID(messageID);
    return `Discord roles messageID set to: ${messageID}`;
  }

  list_roles(options) {
    const code_output = options.getBoolean('code_output');
    let message = "";
    if (code_output) {
      message = `/roles_reactions set_message_id messageid:${this.#mapping.getMessageID()}`;
      this.#mapping.forEach((role, emoji, map) => {
        message += `\n/roles_reactions add_reaction_role emoji:${emoji} role:@${role}`;
      })
    } else {
      message = `Messageid:${this.#mapping.getMessageID}`;
      this.#mapping.forEach((role, emoji, map) => {
        message += `\n ${emoji} => @${role}`;
      });
    }
    return message;
  }

  add_reaction_role(options) {
    const emoji = options.getString('emoji');
    const role = options.getMentionable('role');
    this.#mapping.addMapping(emoji, role.name);
    return `Assigned role @${role.name} to ${emoji}`;
  }

  remove_reaction_role(options) {
    const emoji = options.getString('emoji');
    const role = this.#mapping.removeMapping(emoji);
    if (role) {
      return `Removed role @${role} from ${emoji}`;
    } else {
      return `No role was set for ${emoji}`;
    }
  }
}

module.exports = function (m, u) {
  const command = new RolesReactionsCommand(m.c.discordRolesMapping);
  return {
    data: command.data,
    async execute(interaction) {
      command.execute(interaction)
    }
  };
};
