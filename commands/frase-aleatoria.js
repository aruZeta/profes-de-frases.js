const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frase-aleatoria')
		.setDescription('Muestra una frase aleatoria.')
		.addStringOption(option => option
			.setName('letra')
			.setDescription('Letra de la frase')
			.setRequired(false)),

	async execute(interaction, client, config) {
		const letras = 'abcdefghijklmnopqrstuvwxyz';
		const { frases } = await require('./common/cargar-frases')
			.execute(client, config);
		let letra = interaction.options.getString('letra');
		let fraseRandom = null;

		if (letra != null) {
			if (!frases[letra]) {
				await interaction.reply({
					content: `No hay ninguna frase con la letra ${letra}`,
					ephemeral: true
				});
				return;
			} else {
				fraseRandom = frases[letra];
			}
		} else {
			while (!fraseRandom) {
				letra = letras.charAt(Math.floor(Math.random() * letras.length));
				fraseRandom = frases[letra];
			}
		}

		const msgEmbed = require('./common/embed.js').execute(config)
			.setTitle('Frase aleatoria')
			.addFields(
				{ name: 'Con la letra:',
					value: `${letra}`
				},
				{ name: 'Frase:',
					value: `${fraseRandom[Math.floor(Math.random() * fraseRandom.length)]}`
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
