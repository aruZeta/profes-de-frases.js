const subcommandName = 'estadisticas';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Muestra las estadisticas de frases.')
		)
	},

	async execute(interaction, client, config, data) {
		const { letras } = require('../commnon/common');
		
		let cantidad = 0;
		let estadisticas = "";
		let letrasQueFaltan = "";
		const letrasUsadas = [];

		await data.frases.find({}, { sort: { letra: 1 } }).forEach(
			({letra, frases}) => {
				estadisticas += `\`${letra}: ${frases.length}\`\n`;
				cantidad += frases.length;
				letrasUsadas.push(letra);
			}
		);

		for (const letra of letras) {
			if (letrasUsadas.indexOf(letra) < 0) {
				letrasQueFaltan += `\`${letra}\`\n`;
			}
		}

		if (letrasQueFaltan.length == 0) {
			letrasQueFaltan = 'No faltan letras';
		}

		const msgEmbed = require('../../common/embed').execute(config)
			.setTitle('Estadisticas de frases')
			.addFields(
				{ name: 'Numero de frases:',
					value: `${cantidad}`
				},
				{ name: 'Numero de frases por letra:',
					value: `${estadisticas}`,
					inline: true
				},
				{ name: 'Letras que faltan:',
					value: `${letrasQueFaltan}`,
					inline: true
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
