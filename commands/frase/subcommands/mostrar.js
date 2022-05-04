const subcommandName = 'mostrar';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Muestra las estadisticas de frases.')
			.addStringOption(option => option
				.setName('letra')
				.setDescription('Letra de las frases')
				.setRequired(true)
			)
		)
	},

	async execute(interaction, client, config, data) {
		const { letras } = require('../commnon/common');

		const letra = interaction.options.getString('letra');

		if (letra.length != 1 || !letras.includes(letra)) {
			await interaction.reply({
				content: `\`${letra}\` no es una letra!`,
				ephemeral: true
			});
			return;
		}

		const found = await data.frases.findOne({ letra: letra });

		if (!found) {
			await interaction.reply({
				content: `\`${letra}\` no se encontro en la db!`,
				ephemeral: true
			});
			return;
		}

		let frases = "";
		const cantidad = found.frases.length;

		for (let i = 0; i < cantidad; i++) {
			frases += `${i}: ${found.frases[i]}\n`;
		}

		const msgEmbed = require('../../common/embed').execute(config)
			.setTitle('Estadisticas de frases')
			.addFields(
				{ name: 'Letra:',
					value: `${letra}`,
					inline: true
				},
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
