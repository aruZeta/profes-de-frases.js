const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Muestra un link de invitacion del bot.'),

	async execute(interaction, _, config) {
		const scope = "bot%20applications.commands";
		const link = "https://discord.com/api/oauth2/authorize";
		const msgEmbed = new MessageEmbed()
			.setTitle('Link de invitacion')
			.setColor('#3498db')
			.setThumbnail(config.userPfp)
			.setTimestamp()
			.setFooter({ text: 'Cristotractor go brrrr', iconURL: config.userPfp })
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
