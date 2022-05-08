const {
	checkLevelFound
	, commonCheck
	, checkId
	, checkIdInFoundInsults
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');
const { levels } = require('../../../common/levels');

const subcommandName = 'a';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Insultar a alguien.')
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
			.addIntegerOption(option => option
				.setName('id')
				.setDescription('Id del insulto')
				.setRequired(false)
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
		const id = interaction.options.getInteger('id');

		let found = false;
		let insult;

		if (id == null) {
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
			insult = insults[Math.floor(Math.random() * insults.length)];
		} else {
			if (level == null) {
				await commonCheck(
					interaction,
					'Debes espicificar un nivel si pasas un id.'
				);
			}

			await checkId(interaction, id);
			found = await find(level);
			await checkLevelFound(interaction, found, level);
			await checkIdInFoundInsults(interaction, id, found);
			insult = found.insults[id];
		}

		const msgEmbed = embed()
			.setTitle('Insulto')
			.addFields(
				{ name: 'Nivel:',
					value: level
				},
				{ name: 'Insulto:',
					value: insult.replace(
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
