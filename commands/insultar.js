const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	slashCommand: new SlashCommandBuilder()
		.setName('insultar')
		.setDescription('Insulta a alguien (juan por defecto).')
		.addUserOption(option => option
			.setName('persona')
			.setDescription('La persona/objeto que quieres insultar')
			.setRequired(false)),

	async execute(interaction, _, config) {
		const persona = interaction.options.getUser('persona') || config.insultarId;
		await interaction.reply(`Eres tonto ${persona}`);
	}
}
