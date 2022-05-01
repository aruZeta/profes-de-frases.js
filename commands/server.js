const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Muestra estadisticas del servidor.'),

	async execute(interaction, _, config) {
		const msgEmbed = require('./common/embed.js').execute(config)
			.setTitle('Estadisticas del servidor')
			.addFields(
				{ name: 'Nombre:',
					value: `${interaction.guild.name}`
				},
				{ name: 'Numero de miembros:',
					value: `${interaction.guild.memberCount}`
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
