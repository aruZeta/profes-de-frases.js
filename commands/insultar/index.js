const { SlashCommandBuilder } = require('@discordjs/builders');

const { readSubcommands } = require('../../common/read');

const slashCommand =
      new SlashCommandBuilder()
      .setName('insultar')
      .setDescription('Insulta a alguien (juan por defecto).');

const subcommands = readSubcommands(slashCommand, __dirname);

module.exports = {
    slashCommand: slashCommand,

    async execute({ interaction, discord, mongoCollections: { insultsColl } }) {
        await subcommands[interaction.options.getSubcommand()](
            { interaction, discord, insultsColl }
        );
    }
}
