const { SlashCommandBuilder } = require('@discordjs/builders');

const { readSubcommands } = require('../../common/read');

const slashCommand =
	new SlashCommandBuilder()
		.setName('frase')
		.setDescription('Comandos de frases');

const subcommands = readSubcommands(slashCommand, __dirname);

module.exports = {
	slashCommand: slashCommand,

	async execute({ interaction, discord, mongoCollections: { phrasesColl } }) {
		await subcommands[interaction.options.getSubcommand()](
			{ interaction, discord, phrasesColl }
		);
	}
}
