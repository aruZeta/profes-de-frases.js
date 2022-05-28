const { letters, adminRoleId } = require('../config.json');

module.exports = {
    async checkLetter(interaction, letter) {
        if (letter.length != 1 || !letters.includes(letter)) {
            await interaction.reply({
                content: `\`${letter}\` no es una letra del abecedario!`,
                ephemeral: true
            });
            throw 'Check failed';
        }
    },

    async checkLetterFound(interaction, found, letter) {
        if (!found) {
            await interaction.reply({
                content: `No existen frases con \`${letter}\` en la DB.`,
                ephemeral: true
            });
            throw 'Check failed';
        }
    },

    async checkAdmin(interaction) {
        if (!interaction.member.roles.cache.has(adminRoleId)) {
            await interaction.reply({
                content: 'Solo un admin puede ejecutar este comando.',
                ephemeral: true
            });
            throw 'Check failed';
        }
    },

    async checkId(interaction, id) {
        if (id < 0) {
            await interaction.reply({
                content: `El id no puede ser un numero negativo, \`${id}\`.`,
                ephemeral: true
            });
            throw 'Check failed';
        }
    },

    async checkIdInFoundPhrases(interaction, id, found) {
        if (id >= found.phrases.length) {
            await interaction.reply({
                content: `No hay ninguna frase con el id \`${id}\`.`,
                ephemeral: true
            });
            throw 'Check failed';
        }
    },

    async checkDbOperation(interaction, operation) {
        if (!operation.acknowledged) {
            await interaction.reply({
                content: 'Hubo un error con la DB, contacte al admin.',
                ephemeral: false
            });
            throw 'Check failed';
        }
    },

    async checkInsult(interaction, insult) {
        if (!insult.match(/.*<P>.*/)) {
            await interaction.reply({
                content: ''
                    + 'El insulto debe llevar el texto \`<P>\` que se cambiara'
                    + 'por el nombre de la persona a la que se insulta.'
                    + '\n'
                    +'Ej: \`Eres tonto <P>\` al insultar quedaria como'
                    + '\`Eres tonto Juan\` si insultas a Juan.',
                ephemeral: true
            });
            throw 'Check failed';
        }
    },
    async checkLevel(interaction, level) {
        if (!level) {
            await interaction.reply({
                content: `Debes espicificar un nivel.`,
                ephemeral: true
            });
            throw 'Check failed';
        }
    },

    async checkLevelFound(interaction, found, level) {
        if (!found) {
            await interaction.reply({
                content: `No existen insultos de nivel \`${level}\` en la DB.`,
                ephemeral: true
            });
            throw 'Check failed';
        }
    },

    async checkIdInFoundInsults(interaction, id, found) {
        if (id >= found.insults.length) {
            await interaction.reply({
                content: `No hay ninguna insulto con el id \`${id}\`.`,
                ephemeral: true
            });
            throw 'Check failed';
        }
    },

    async commonCheck(interaction, text) {
        await interaction.reply({
            content: text,
            ephemeral: true
        });
        throw 'Check failed';
    }
}
