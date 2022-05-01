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
		const canalFrases = client.channels.cache.get(config.canalFrasesId);
		const letras = 'abcdefghijklmnopqrstuvwxyz';

		const frases = {};
		await canalFrases.messages.fetch().then(messages => {
			messages.forEach(message => {
				const [ _, letra, frase ] = message.content.match(/^.*([a-z]): ?\n> (.*)$/s);
				if (!frases[letra]) {
					frases[letra] = [frase];
				} else {
					frases[letra].push(frase);
				}
			})
		});

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
