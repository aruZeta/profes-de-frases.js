const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	slashCommand: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Muestra un link de invitacion del bot.'),

	async execute(interaction, _, config) {
		const scope = "bot%20applications.commands";
		const link = "https://discord.com/api/oauth2/authorize";
		const msgEmbed = require('./common/embed.js').execute(config)
			.setTitle('Link de invitacion')
			.addFields(
				{ name: 'Link:',
					value: `${link}?client_id=${config.clientId}&permissions=${config.permissions}&scope=${scope}`
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
