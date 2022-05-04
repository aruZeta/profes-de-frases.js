const subcommandName = 'aleatoria';

module.exports = {
	name: subcommandName,
	
	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Muestra una frase aleatoria.')
			.addStringOption(option => option
				.setName('letra')
				.setDescription('Letra de la frase')
				.setRequired(false)
			)
		)
	},

	async execute(interaction, client, config, data) {
		const { letras } = require('./common/common');
		
		const letraRandom = () => {
			return letras.charAt(Math.floor(Math.random() * letras.length))
		};

		const comprobar = letra => {
			return data.frases.findOne({ letra: letra });
		};

		let letra = interaction.options.getString('letra');
		let found = false;

		if (letra == null) {
			while (!found) {
				letra = letraRandom();
				found = await comprobar(letra);
			}
		} else {
			letra = letra.toLowerCase();
			if (!letras.includes(letra)) {
				await interaction.reply({
					content: `\`${letra}\` no es una letra valida.`,
					ephemeral: true
				});
				return;
			} else {
				found = await comprobar(letra);

				if (!found) {
					await interaction.reply({
						content: `\`${letra}\` no se encontro en la db.`,
						ephemeral: true
					});
					return;
				}
			}
		}

		const frases = found.frases;
		const fraseRandom = frases[Math.floor(Math.random() * frases.length)];

		const msgEmbed = require('../../common/embed').execute(config)
			.setTitle('Frase aleatoria')
			.addFields(
				{ name: 'Con la letra:',
					value: letra
				},
				{ name: 'Frase:',
					value: fraseRandom
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
