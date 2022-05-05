const { checkLetra, checkFound, checkId, checkIdInFound } = require('./common/checking');

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
			.addIntegerOption(option => option
				.setName('id')
				.setDescription('Id de la frase (opcional)')
				.setRequired(false)
			)
		)
	},

	async execute(interaction, client, config, data) {
		const letra = interaction.options.getString('letra').toLowerCase();
		await checkLetra(interaction, letra);

		const id = interaction.options.getInteger('id');

		const found = await data.frases.findOne({ letra: letra });
		await checkFound(interaction, found, letra);

		if (id == null) {
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
		} else {
			await checkId(interaction, id);
			await checkIdInFound(interaction, id, found);

			const msgEmbed = require('../../common/embed').execute(config)
				.setTitle('Mostrar frase')
				.addFields(
					{ name: 'Con la letra:',
						value: letra
					},
					{ name: 'Frase:',
						value: found.frases[id]
					}
				);

			await interaction.reply({
				embeds: [msgEmbed]
			});
		}
	}
}
