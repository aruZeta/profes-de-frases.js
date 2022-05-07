const {
	checkLevelFound
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');
const { levels } = require('../../../common/levels');

const subcommandName = 'a';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Añade un nuevo insulto a la DB (solo admmins).')
			.addUserOption(option =>
				option
					.setName('persona')
					.setDescription('A quien va dirigido el insulto')
					.setRequired(true)
			)
			.addBooleanOption(option =>
				option
					.setName('pingear')
					.setDescription('Pingear o no')
					.setRequired(false)
			)
			.addStringOption(option =>
				option
					.setName('nivel')
					.setDescription('Como de fuerte es el insulto (opcional)')
					.setRequired(false)
					.addChoices(...levels)
			)
		)
	},

	async execute({ interaction, insultsColl }) {
		const randomLevel = () => {
			return levels[(Math.floor(Math.random() * levels.length))].value;
		};

		const find = level => {
			return insultsColl.findOne({ level: level });
		};

		const person = interaction.options.getUser('persona');
		const pingear = interaction.options.getBoolean('pingear');
		let level = interaction.options.getString('nivel');

		let found = false;

		if (level == null) {
			while (!found) {
				level = randomLevel();
				found = await find(level);
			}
		} else {
			found = await find(level);
			await checkLevelFound(interaction, found, level);
		}

		const insults = found.insults;
		const randomInsult = insults[Math.floor(Math.random() * insults.length)];

		const msgEmbed = embed()
			.setTitle('Insulto')
			.addFields(
				{ name: 'Nivel:',
					value: level
				},
				{ name: 'Insulto:',
					value: randomInsult.replace(
						/<P>/,
						pingear
							? person
							: interaction.guild.members.cache.get(person.id).displayName
					)
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
