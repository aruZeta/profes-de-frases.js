const { SlashCommandBuilder } = require('@discordjs/builders');

const { embed } = require('../common/embed');
const { inviteLink } = require('../common/invite');

module.exports = {
	slashCommand: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Muestra un link de invitacion del bot.'),

	async execute({ interaction }) {
		const msgEmbed = embed()
			.setTitle('Link de invitacion')
			.addFields(
				{ name: 'Link:',
					value: inviteLink
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
