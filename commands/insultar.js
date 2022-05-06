const { SlashCommandBuilder } = require('@discordjs/builders');

const { insultarId } = require('../config.json');

module.exports = {
	slashCommand: new SlashCommandBuilder()
		.setName('insultar')
		.setDescription('Insulta a alguien (juan por defecto).')
		.addUserOption(option => option
			.setName('persona')
			.setDescription('La persona/objeto que quieres insultar')
			.setRequired(false)),

	async execute({ interaction }) {
		const persona = interaction.options.getUser('persona') || insultarId;
		await interaction.reply(`Eres tonto ${persona}`);
	}
}
