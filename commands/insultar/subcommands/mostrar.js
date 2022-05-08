const {
	checkLevelFound
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');
const { levels } = require('../../../common/levels');

const subcommandName = 'mostrar';

module.exports = {
	name: subcommandName,

	addSubcommand(slashCommand) {slashCommand
		.addSubcommand(subcommand => subcommand
			.setName(subcommandName)
			.setDescription('Muestra los insultos de un nivel.')
			.addStringOption(option =>
				option
					.setName('nivel')
					.setDescription('Como de fuerte es el insulto')
					.setRequired(true)
					.addChoices(...levels)
			)
		)
	},

	async execute({ interaction, insultsColl }) {
		const level = interaction.options.getString('nivel');

		const found = await insultsColl.findOne({ level: level });
		await checkLevelFound(interaction, found, level);

		let insults = "";
		const quantity = found.insults.length;

		for (let i = 0; i < quantity; i++) {
			insults += `${i}: ${found.insults[i]}\n`;
		}

		const msgEmbed = embed()
			.setTitle(`Insultos de nivel \`${level}\``)
			.addFields(
				{ name: 'Numero de insultos:',
					value: `${quantity}`,
					inline: true
				},
				{ name: 'Insultos:',
					value: insults,
				}
			);

		await interaction.reply({
			embeds: [msgEmbed]
		});
	}
}
