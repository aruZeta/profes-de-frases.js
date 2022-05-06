const { checkLetter, checkFound } = require('../../../common/checking');
const { embed } = require('../../../common/embed');
const { letters } = require('../../../config.json');

const subcommandName = 'aleatoria';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Muestra una frase aleatoria.')
			.addStringOption(option => option
				.setName('letra')
				.setDescription('Letra de la frase')
				.setRequired(false)
			)
		)
	},

	async execute({ interaction, phrasesColl }) {
		const letraRandom = () => {
			return letters.charAt(Math.floor(Math.random() * letters.length))
		};

		const find = letra => {
			return phrasesColl.findOne({ letter: letra });
		};

		let letter = interaction.options.getString('letra');
		let found = false;

		if (letter == null) {
			while (!found) {
				letter = letraRandom();
				found = await find(letter);
			}
		} else {
			letter = letter.toLowerCase();
			await checkLetter(interaction, letter);

			found = await find(letter);
			await checkFound(interaction, found, letter);
		}

		const frases = found.phrases;
		const randomPhrase = frases[Math.floor(Math.random() * frases.length)];

		const msgEmbed = embed()
			.setTitle('Frase aleatoria')
			.addFields(
				{ name: 'Con la letra:',
					value: letter
				},
				{ name: 'Frase:',
					value: randomPhrase
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
