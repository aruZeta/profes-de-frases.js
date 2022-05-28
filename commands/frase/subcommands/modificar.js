const {
    checkAdmin
    , checkDbOperation
    , checkLetterFound
    , checkId
    , checkIdInFoundPhrases
    , checkLetter
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');
const { capitalize } = require('../../../common/string');

const subcommandName = 'modificar';

module.exports = {
    name: subcommandName,

    addSubcommand(slashCommand) {
        slashCommand.addSubcommand(
            subcommand => subcommand
                .setName(subcommandName)
                .setDescription('Modifica una frase de la DB (solo admins).')
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
                .addStringOption(
                    option => option
                        .setName('frase')
                        .setDescription('La frase en si')
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

        const phrase = capitalize(interaction.options.getString('frase'));

        const found = await phrasesColl.findOne({ letter: letter });
        await checkLetterFound(interaction, found, letter);
        await checkIdInFoundPhrases(interaction, id, found);

        const phraseToEdit = found.phrases[id];

        const operation = await phrasesColl.updateOne(
            { letter: letter, phrases: phraseToEdit },
            { $set: { "phrases.$": phrase } }
        );
        await checkDbOperation(interaction, operation);

        const msgEmbed = embed()
              .setTitle('Frase editada')
              .addFields(
                  { name: 'Con la letra:',
                    value: letter
                  },
                  { name: 'Frase antigua:',
                    value: phraseToEdit
                  },
                  { name: 'Frase nueva:',
                    value: phrase
                  }
              );

        await interaction.reply({
            embeds: [msgEmbed]
        });
    }
}
