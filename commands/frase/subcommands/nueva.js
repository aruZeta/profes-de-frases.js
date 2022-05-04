const { checkLetra, checkAdmin, checkDbOperation } = require('./common/checking');

const subcommandName = 'nueva';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
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
	},

	async execute(interaction, client, config, data) {
		if (await checkAdmin(interaction, config)) return;

		const letra = interaction.options.getString('letra').toLowerCase();
		if (await checkLetra(interaction, letra)) return;

		const frase = interaction.options.getString('frase');

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

		if (await checkDbOperation(interaction, operation)) return;

		const msgEmbed = require('../../common/embed').execute(config)
			.setTitle('Frase añadida')
			.addFields(
				{ name: 'Con la letra:',
					value: letra
				},
				{ name: 'Frase:',
					value: frase
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
