const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    slashCommand: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con un pong.'),

    async execute({ interaction }) {
        await interaction.reply('Pong!');
    }
}
