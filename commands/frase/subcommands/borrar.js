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
			.setDescription('Borra una frase de la DB (solo admins).')
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
		await checkAdmin(interaction, config);

		const letra = interaction.options.getString('letra').toLowerCase();
		await checkLetra(interaction, letra);

		const id = interaction.options.getInteger('id');
		await checkId(interaction, id);

		const found = await data.frases.findOne({ letra: letra });
		await checkFound(interaction, found, letra);
		await checkIdInFound(interaction, id, found);

		const frase = found.frases[id];

		const operation = await data.frases.updateOne(
			{ letra: letra },
			{ $pull: { frases: frase } }
		);
		await checkDbOperation(interaction, operation);

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
