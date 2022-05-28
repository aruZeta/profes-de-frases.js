const {
    checkAdmin
    , checkDbOperation
    , checkLetterFound
    , checkId
    , checkIdInFoundPhrases
    , checkLetter
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');

const subcommandName = 'borrar';

module.exports = {
    name: subcommandName,

    addSubcommand(slashCommand) {
        slashCommand.addSubcommand(
            subcommand => subcommand
                .setName(subcommandName)
                .setDescription('Borra una frase de la DB (solo admins).')
                .addStringOption(
                    option => option
                        .setName('letra')
                        .setDescription('Letra de la frase')
                        .setRequired(true)
                )
                .addIntegerOption(
                    option => option
                        .setName('id')
                        .setDescription('Id de la frase')
                        .setRequired(true)
                )
        )
    },

    async execute({ interaction, phrasesColl }) {
        await checkAdmin(interaction);

        const letter = interaction.options.getString('letra').toLowerCase();
        await checkLetter(interaction, letter);

        const id = interaction.options.getInteger('id');
        await checkId(interaction, id);

        const found = await phrasesColl.findOne({ letter: letter });
        await checkLetterFound(interaction, found, letter);
        await checkIdInFoundPhrases(interaction, id, found);

        const phrase = found.phrases[id];

        const operation = await phrasesColl.updateOne(
            { letter: letter },
            { $pull: { phrases: phrase } }
        );
        await checkDbOperation(interaction, operation);

        const msgEmbed = embed()
              .setTitle('Frase eliminada')
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
