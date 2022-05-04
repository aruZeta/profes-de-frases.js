const { checkLetra, checkFound } = require('./common/checking');

const subcommandName = 'mostrar';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Muestra las frases de una letra')
			.addStringOption(option => option
				.setName('letra')
				.setDescription('Letra de las frases')
				.setRequired(true)
			)
		)
	},

	async execute(interaction, client, config, data) {
		const letra = interaction.options.getString('letra').toLowerCase();
		if (await checkLetra(interaction, letra)) return;

		const found = await data.frases.findOne({ letra: letra });
		if (await checkFound(interaction, found, letra)) return;

		let frases = "";
		const cantidad = found.frases.length;

		for (let i = 0; i < cantidad; i++) {
			frases += `${i}: ${found.frases[i]}\n`;
		}

		const msgEmbed = require('../../common/embed').execute(config)
			.setTitle(`Frases con \`${letra}\``)
			.addFields(
				{ name: 'Numero de frases:',
					value: `${cantidad}`,
					inline: true
				},
				{ name: 'Frases:',
					value: `${frases}`,
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
