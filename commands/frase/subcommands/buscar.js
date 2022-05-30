const {
    checkLetterFound
    , checkId
    , checkIdInFoundPhrases
    , checkLetter
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');

const subcommandName = 'buscar';

module.exports = {
    name: subcommandName,

    addSubcommand(slashCommand) {
        slashCommand.addSubcommand(
            subcommand => subcommand
                .setName(subcommandName)
                .setDescription('Muestra las frases con la palabra pasada.')
                .addStringOption(
                    option => option
                        .setName('palabra')
                        .setDescription('La palabra a buscar')
                        .setRequired(true)
                )
                .addStringOption(
                    option => option
                        .setName('letra')
                        .setDescription('Letra de las frases')
                        .setRequired(false)
                )
        )
    },

    async execute({ interaction, phrasesColl }) {
        let letter = interaction.options.getString('letra');
        const word = interaction.options.getString('palabra');

        let title;
        let quantity = 0;
        let phrases = '';

        if (letter != null) {
            letter = letter.toLowerCase();
            await checkLetter(interaction, letter);

            title = `Frases con \`${letter}\` y que contienen \`${word}\``;

            const found = await phrasesColl.findOne({ letter: letter });
            await checkLetterFound(interaction, found, letter);

            for (let i = 0; i < found.phrases.length; i++) {
                const phrase = found.phrases[i];
                if (new RegExp(word, "i").test(phrase)) {
                    phrases += `${i}: ${phrase}\n`;
                    quantity++;
                }
            }
        } else {
            title = `Frases que contienen \`${word}\``;

            const found = await phrasesColl.aggregate([
                { $unwind: {
                    path: '$phrases',
                    includeArrayIndex: 'id'
                }},
                { $match: {
                    phrases: { $regex: word }
                }}
            ]);

            let lastLetter = '';

            await found.forEach(phrase => {
                if (phrase.letter != lastLetter) {
                    phrases += `\nCon la letra \`${phrase.letter}\`:\n`;
                    lastLetter = phrase.letter;
                }

                phrases += `${phrase.id}: ${phrase.phrases}\n`;
                quantity++;
            });
        }

        const msgEmbed = embed()
              .setTitle(title)
              .addFields(
                  { name: 'Numero de frases:',
                    value: `${quantity}`,
                    inline: true
                  },
                  { name: 'Frases:',
                    value: phrases.length > 0
                    ? phrases
                    : 'No hay frases con esa palabra'
                  }
              );

        await interaction.reply({
            embeds: [msgEmbed],
            ephemeral: false
        });
    }
}
