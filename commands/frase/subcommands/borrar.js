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
		if (!interaction.member.roles.cache.has(config.adminRoleId)) {
			await interaction.reply({
				content: 'Solo un admin puede borrar frases.',
				ephemeral: true
			});
			return;
		}

		const { letras } = require('./common/common');

		const letra = interaction.options.getString('letra').toLowerCase();
		const id = interaction.options.getInteger('id');

		if (id < 0) {
			await interaction.reply({
				content: 'El id no puede ser un numero negativo!',
				ephemeral: true
			});
			return;
		}

		if (letra.length != 1 || !letras.includes(letra)) {
			await interaction.reply({
				content: `\`${letra}\` no es una letra!`,
				ephemeral: true
			});
			return;
		}

		const found = await data.frases.findOne({ letra: letra });

		if (!found) {
			await interaction.reply({
				content: `\`${letra}\` no se encontro en la db!`,
				ephemeral: true
			});
			return;
		} else if (id > found.frases.length) {
			await interaction.reply({
				content: 'No hay ninguna frase con ese id!',
				ephemeral: true
			});
			return;
		}

		const frase = found.frases[id];

		const eliminar = await data.frases.updateOne(
			{ letra: letra },
			{ $pull: { frases: frase } }
		);

		if (!eliminar.acknowledged) {
			await interaction.reply({
				content: `
Hubo un error contactando con el servidor, contacte al admin.
Esta es la frase que escribiste:
> ${frase}
				`,
				ephemeral: true
			});
			return;
		}

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
