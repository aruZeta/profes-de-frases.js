const subcommandName = 'aleatoria';

module.exports = {
	name: subcommandName,
	
	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Añade una nueva frase a la DB')
			.addStringOption(option =>
				option
					.setName('letra')
					.setDescription('Letra de la frase')
					.setRequired(true)
			)
			.addStringOption(option =>
				option
					.setName('frase')
					.setDescription('La frase en si')
					.setRequired(true)
			)
		)
	},

	async execute(interaction, client, config, data) {
		const { letras } = require('../commnon/common');
		
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
