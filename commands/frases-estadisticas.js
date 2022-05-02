const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frases-estadisticas')
		.setDescription('Muestra estadisticas de las frases.'),

	async execute(interaction, client, config) {
		const letras = 'abcdefghijklmnopqrstuvwxyz';
		const { frases, cantidad } = await require('./common/cargar-frases')
			.execute(client, config);
		const iteradorFrases = Object.entries(frases).sort();

		let estadisticas = "";
		for (const [key, value] of iteradorFrases) {
			estadisticas += `\`${key}: ${value.length}\`\n`;
		}

		let letrasQueFaltan = "";
		for (const letra of letras) {
			if (!frases[letra]) {
				letrasQueFaltan += `\`${letra}\`\n`;
			}
		}

		if (letrasQueFaltan.length == 0) {
			letrasQueFaltan = 'No faltan letras';
		}

		const msgEmbed = require('./common/embed.js').execute(config)
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
