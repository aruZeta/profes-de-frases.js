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
		if (!interaction.member.roles.cache.has(config.adminRoleId)) {
			await interaction.reply({
				content: 'Solo un admin puede borrar frases.',
				ephemeral: true
			});
			return;
		}

		const { letras } = require('../commnon/common');
		
		const letra = interaction.options.getString('letra').toLowerCase();
		const frase = interaction.options.getString('frase');

		if (letra.length != 1 || !letras.includes(letra)) {
			await interaction.reply({
				content: `
\`${letra}\` no es una letra!
Esta es la frase que escribiste:
> ${frase}
				`,
				ephemeral: true
			});
			return;
		}

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

		if (operation.acknowledged) {
			await interaction.reply(`
Guardado!
Con la letra ${letra}:
> ${frase}
			`);
		} else {
			await interaction.reply({
				content: `
Hubo un error contactando con el servidor, contacte al admin.
Esta es la frase que escribiste:
> ${frase}
				`,
				ephemeral: true
			});
		}
	}
}
