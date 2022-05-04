const { letras } = require('./index');

module.exports = {
	async checkLetra(interaction, letra) {
		if (letra.length != 1 || !letras.includes(letra)) {
			await interaction.reply({
				content: `\`${letra}\` no es una letra!`,
				ephemeral: true
			});
			return true;
		}
	},

	async checkFound(interaction, found, letra) {
		if (!found) {
			await interaction.reply({
				content: `\`${letra}\` no se encontro en la db.`,
				ephemeral: true
			});
			return true;
		}
	},

	async checkAdmin(interaction, config) {
		if (!interaction.member.roles.cache.has(config.adminRoleId)) {
			await interaction.reply({
				content: 'Solo un admin puede borrar frases.',
				ephemeral: true
			});
			return true;
		}
	},

	async checkId(interaction, id) {
		if (id < 0) {
			await interaction.reply({
				content: `El id no puede ser un numero negativo, \`${id}\`.`,
				ephemeral: true
			});
			return true;
		}
	},

	async checkIdInFound(interaction, id, found) {
		if (id > found.frases.length) {
			await interaction.reply({
				content: `No hay ninguna frase con el id \`${id}\`.`,
				ephemeral: true
			});
			return true;
		}
	},

	async checkDbOperation(interaction, operation) {
		if (!operation.acknowledged) {
			await interaction.reply({
				content: 'Hubo un error con la db, contacte al admin.',
				ephemeral: false
			});
			return;
		}
	}
}