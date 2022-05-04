const { SlashCommandBuilder } = require('@discordjs/builders');

const letras = 'abcdefghijklmnopqrstuvwxyz';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frase')
		.setDescription('Comandos de frases')
		.addSubcommand(subcommand =>
			subcommand
				.setName('nueva')
				.setDescription('Añade una nueva frase a la DB')
				.addStringOption(option =>
					option
						.setName('letra')
						.setDescription('Letra de la frase')
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('frase')
						.setDescription('La frase en si')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('aleatoria')
				.setDescription('Muestra una frase aleatoria.')
				.addStringOption(option => option
					.setName('letra')
					.setDescription('Letra de la frase')
					.setRequired(false))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('estadisticas')
				.setDescription('Muestra las estadisticas de frases.')
		),

	async execute(interaction, client, config, data) {
		const subcommand = interaction.options.getSubcommand();

		if (subcommand === 'nueva') {
			const letra = interaction.options.getString('letra');
			const frase = interaction.options.getString('frase');

			if (letra.length != 1 || !letras.includes(letra)) {
				await interaction.reply({
					content: `
\`${letra}\` no es una letra!
Esta es la frase que escribiste:
> ${frase}
					`,
					ephemeral: true
				});
				return;
			}

			const found = await data.frases.findOne({ letra: letra });
			let operation;
			if (found) {
				operation = await data.frases.updateOne(
					{ letra: letra },
					{ $push: { frases: frase } }
				);
			} else {
				operation = await data.frases.insertOne({
					letra: letra,
					frases: [frase]
				});
			}

			if (operation.acknowledged) {
				await interaction.reply(`
Guardado!
Con la letra ${letra}:
> ${frase}
				`);
			} else {
				await interaction.reply({
					content: `
Hubo un error contactando con el servidor, contacte al admin.
Esta es la frase que escribiste:
> ${frase}
					`,
					ephemeral: true
				});
			}
		} else if (subcommand === 'aleatoria') {
			const letraRandom = () => {
				return letras.charAt(Math.floor(Math.random() * letras.length))
			};

			let letra = interaction.options.getString('letra') || letraRandom();
			let found = await data.frases.findOne({ letra: letra });
			while (!found) {
				letra = letraRandom();
				found = await data.frases.findOne({ letra: letra });
			}

			const frases = found.frases;
			const fraseRandom = frases[Math.floor(Math.random() * frases.length)];

			const msgEmbed = require('./common/embed.js').execute(config)
				.setTitle('Frase aleatoria')
				.addFields(
					{ name: 'Con la letra:',
						value: letra
					},
					{ name: 'Frase:',
						value: fraseRandom
					}
				);

			await interaction.reply({
				embeds: [msgEmbed]
			});
		} else if (subcommand === 'estadisticas') {
			let cantidad = 0;
			let estadisticas = "";
			let letrasQueFaltan = "";
			const letrasUsadas = [];

			await data.frases.find({}, { sort: { letra: 1 } }).forEach(
				({letra, frases}) => {
					estadisticas += `\`${letra}: ${frases.length}\`\n`;
					cantidad += frases.length;
					letrasUsadas.push(letra);
				}
			);

			for (const letra of letras) {
				if (letrasUsadas.indexOf(letra) < 0) {
					letrasQueFaltan += `\`${letra}\`\n`;
				}
			}
			
			if (letrasQueFaltan.length == 0) {
				letrasQueFaltan = 'No faltan letras';
			}

			const msgEmbed = require('./common/embed.js').execute(config)
				.setTitle('Estadisticas de frases')
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
				embeds: [msgEmbed]
			});
		}
	}
}
