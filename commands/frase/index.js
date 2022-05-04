const fs = require('node:fs');
const path = require('path');
const { SlashCommandBuilder } = require('@discordjs/builders');

const slashCommand =
	new SlashCommandBuilder()
		.setName('frase')
		.setDescription('Comandos de frases');

const subcommands = {};

fs.readdirSync(
	path.resolve(__dirname, './subcommands'),
	{ withFileTypes: true }
).filter(
	item =>
		item.name != 'common'
		&& ((item.isFile && item.name.endsWith('.js'))
			|| item.isDirectory)
).forEach(
	item => {
		const subcommand =
			require(path.resolve(__dirname, `subcommands/${item.name}`));

		subcommand.addSubcommand(slashCommand);
		subcommands[subcommand.name] = subcommand.execute;
	}
);

module.exports = {
	slashCommand: slashCommand,

	async execute(interaction, client, config, data) {
		subcommands[interaction.options.getSubcommand()](interaction, client, config, data);
	}
}
