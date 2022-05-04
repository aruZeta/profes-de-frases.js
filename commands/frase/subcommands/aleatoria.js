const { letras } = require('./common/index');
const { checkLetra, checkFound } = require('./common/checking');

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
			if (await checkLetra(interaction, letra)) return;

			found = await comprobar(letra);
			if (await checkFound(interaction, found, letra)) return;
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
