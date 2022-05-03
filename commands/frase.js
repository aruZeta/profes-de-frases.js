const { SlashCommandBuilder } = require('@discordjs/builders');

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
		),

	async execute(interaction, client, config, data) {
		const subcommand = interaction.options.getSubcommand();
		const letras = 'abcdefghijklmnopqrstuvwxyz';

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
		}
	}
}
