const { SlashCommandBuilder, PermissionFlagsBits, TextDisplayBuilder, MessageFlags, codeBlock } = require('discord.js');

class OTNLinkTracker {

  #tracker = undefined;

  constructor(tracker) {
    this.#tracker = tracker;
  }

  data = new SlashCommandBuilder()
    .setName('otn_link_tracker')
    .setDescription('Manages On The Nubs link tracker')
    .addSubcommand(subcommand => subcommand
      .setName('set_channel_id')
      .setDescription('Sets the message where links will be tracked')
      .addStringOption(option => option
        .setName('channelid')
        .setDescription('The channel ID to look for messages.')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('clear_messages')
      .setDescription('Empties the list of tracked links.')
    )
    .addSubcommand(subcommand => subcommand
      .setName('output')
      .setDescription('Outputs the list in Markdown format.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    console.log(`[OTN Tracker] Received command: ont_link_tracker ${subcommand}`);
    const message = this[subcommand](interaction.options);
    console.log(message);
		await interaction.reply(message);
  }

  set_channel_id(options) {
    const channelID = options.getString('channelid');
    this.#tracker.setDiscordChannelID(channelID);
    return `OTN Link Tracker channelid set to: ${channelID}`;
  }

  clear_messages(options) {
    this.#tracker.clearMessages();
    return `OTN Messages cleared`;
  }

  output(options) {
    var output = "";
    this.#tracker.forEachDiscordMessage((message, discordMessageID, map) => {
      output += `By ${message.collaborator} on ${message.source}\n`;
      output += message.text;
      output += "\n\n";
    });
    if (output.length == 0) {
      return "No messages tracked yet."
    } else {
      return {
        content: "Here are the tracked messages in Markdown format:",
        files: [{
          name: `OTN-${new Date().toISOString()}.md`,
          attachment: Buffer.from(output, 'utf8')
        }]
      }
    }
  }
}

module.exports = function (m, u) {
  const command = new OTNLinkTracker(m.otn.linkTracker, u);
  return {
    data: command.data,
    async execute(interaction) {
      command.execute(interaction)
    }
  };
};
