const {
	checkLetterFound
	, checkId
	, checkIdInFoundPhrases
	, checkLetter
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');

const subcommandName = 'mostrar';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Muestra las frases de una letra (o la del id dado).')
			.addStringOption(option => option
				.setName('letra')
				.setDescription('Letra de las frases')
				.setRequired(true)
			)
			.addIntegerOption(option => option
				.setName('id')
				.setDescription('Id de la frase (opcional)')
				.setRequired(false)
			)
		)
	},

	async execute({ interaction, phrasesColl }) {
		const letter = interaction.options.getString('letra').toLowerCase();
		await checkLetter(interaction, letter);

		const id = interaction.options.getInteger('id');

		const found = await phrasesColl.findOne({ letter: letter });
		await checkLetterFound(interaction, found, letter);

		if (id == null) {
			let phrases = "";
			const quantity = found.phrases.length;

			for (let i = 0; i < quantity; i++) {
				phrases += `${i}: ${found.phrases[i]}\n`;
			}

			const msgEmbed = embed()
				.setTitle(`Frases con \`${letter}\``)
				.addFields(
					{ name: 'Numero de frases:',
						value: `${quantity}`,
						inline: true
					},
					{ name: 'Frases:',
						value: phrases,
					}
				);

			await interaction.reply({
				embeds: [msgEmbed]
			});
		} else {
			await checkId(interaction, id);
			await checkIdInFoundPhrases(interaction, id, found);

			const msgEmbed = embed()
				.setTitle('Mostrar frase')
				.addFields(
					{ name: 'Con la letra:',
						value: letter
					},
					{ name: 'Frase:',
						value: found.phrases[id]
					}
				);

			await interaction.reply({
				embeds: [msgEmbed]
			});
		}
	}
}
