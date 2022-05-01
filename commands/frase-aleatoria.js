const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frase-aleatoria')
		.setDescription('Muestra una frase aleatoria.'),

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

		let letraRandom = null;
		let fraseRandom = null;
		while (!fraseRandom) {
			letraRandom = letras.charAt(Math.floor(Math.random() * letras.length));
			fraseRandom = frases[letraRandom];
		}

		const msgEmbed = require('./common/embed.js').execute(config)
			.setTitle('Frase aleatoria')
			.addFields(
				{ name: 'Con la letra:',
					value: `${letraRandom}`
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
