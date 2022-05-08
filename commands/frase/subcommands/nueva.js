const {
	checkLetter
	, checkAdmin
	, checkDbOperation
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');
const { capitalize } = require('../../../common/string');

const subcommandName = 'nueva';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Añade una nueva frase a la DB (solo admins).')
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

	async execute({ interaction, phrasesColl }) {
		await checkAdmin(interaction);

		const letter = interaction.options.getString('letra').toLowerCase();
		await checkLetter(interaction, letter);

		const phrase = capitalize(interaction.options.getString('frase'));

		const found = await phrasesColl.findOne({ letter: letter });
		let operation;
		if (found) {
			operation = await phrasesColl.updateOne(
				{ letter: letter },
				{ $push: { phrases: phrase } }
			);
		} else {
			operation = await phrasesColl.insertOne({
				letter: letter,
				phrases: [phrase]
			});
		}

		await checkDbOperation(interaction, operation);

		const msgEmbed = embed()
			.setTitle('Frase añadida')
			.addFields(
				{ name: 'Con la letra:',
					value: letter
				},
				{ name: 'Frase:',
					value: phrase
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
