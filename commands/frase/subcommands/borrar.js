const {
	checkAdmin
	, checkId
	, checkLetra
	, checkFound
	,	checkIdInFound
	,	checkDbOperation
} = require('./common/checking');

const subcommandName = 'borrar';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Borra una frase de la db (solo admins).')
			.addStringOption(option => option
				.setName('letra')
				.setDescription('Letra de la frase')
				.setRequired(true)
			)
			.addIntegerOption(option => option
				.setName('id')
				.setDescription('Id de la frase')
				.setRequired(true)
			)
		)
	},

	async execute(interaction, client, config, data) {
		if (await checkAdmin(interaction, config)) return;

		const letra = interaction.options.getString('letra').toLowerCase();
		if (await checkLetra(interaction, letra)) return;

		const id = interaction.options.getInteger('id');
		if (await checkId(interaction, id)) return;

		const found = await data.frases.findOne({ letra: letra });
		if (await checkFound(interaction, found, letra)) return;
		if (await checkIdInFound(interaction, id, found)) return;

		const frase = found.frases[id];

		const operation = await data.frases.updateOne(
			{ letra: letra },
			{ $pull: { frases: frase } }
		);
		if (await checkDbOperation(interaction, operation)) return;

		const msgEmbed = require('../../common/embed').execute(config)
			.setTitle('Frase eliminada')
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
