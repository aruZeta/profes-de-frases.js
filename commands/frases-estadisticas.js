const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frases-estadisticas')
		.setDescription('Muestra estadisticas de las frases.'),

	async execute(interaction, client, config) {
		const canalFrases = client.channels.cache.get(config.canalFrasesId);
		const letras = 'abcdefghijklmnopqrstuvwxyz';

		const frases = {};
		let cantidad = 0;
		await canalFrases.messages.fetch().then(messages => {
			cantidad = messages.size;
			messages.forEach(message => {
				const [ _, letra, frase ] = message.content.match(/^.*([a-z]): ?\n> (.*)$/s);
				if (!frases[letra]) {
					frases[letra] = [frase];
				} else {
					frases[letra].push(frase);
				}
			})
		});

		const iteradorFrases = Object.entries(frases).sort();

		let estadisticas = "";
		for (const [key, value] of iteradorFrases) {
			estadisticas += `\`${key}: ${value.length}\`\n`;
		}

		let letrasQueFaltan = "";
		for (const letra of letras) {
			if (!frases[letra]) {
				letrasQueFaltan += `\`${letra}\`\n`;
			}
		}

		if (letrasQueFaltan.length == 0) {
			letrasQueFaltan = 'No faltan letras';
		}

		const estadisticasEmbed = new MessageEmbed()
			.setTitle('Estadisticas de frases')
			.setColor('#3498db')
			.setThumbnail(config.userPfp)
			.setTimestamp()
			.setFooter({ text: 'Cristotractor go brrrr', iconURL: config.userPfp })
			.addFields(
				{ name: 'Numero de frases:',
					value: `${cantidad}`
				},
				{ name: 'Numero de frases por letra:',
					value: `${estadisticas}`,
					inline: true
				},
				{ name: 'Letras que faltan:',
					value: `${letrasQueFaltan}`,
					inline: true
				}
			);

		await interaction.reply({
			embeds: [estadisticasEmbed]
		});
	}
}
