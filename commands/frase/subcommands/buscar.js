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
                        .setName('letra')
                        .setDescription('Letra de las frases')
                        .setRequired(true)
                )
                .addStringOption(
                    option => option
                        .setName('palabra')
                        .setDescription('La palabra a buscar')
                        .setRequired(true)
                )
        )
    },

    async execute({ interaction, phrasesColl }) {
        let letter = interaction.options.getString('letra');
        const word = interaction.options.getString('palabra');

        let msgEmbed;

        if (letter != null) {
            letter = letter.toLowerCase();
            await checkLetter(interaction, letter);

            const found = await phrasesColl.findOne({ letter: letter });
            await checkLetterFound(interaction, found, letter);

            let phrases = "";
            let quantity = 0;

            for (let i = 0; i < found.phrases.length; i++) {
                const phrase = found.phrases[i];
                if (new RegExp(word, "i").test(phrase)) {
                    phrases += `${i}: ${phrase}\n`;
                    quantity++;
                }
            }

            msgEmbed = embed()
                .setTitle(`Frases con \`${letter}\` y que contienen \`${word}\``)
                .addFields(
                    { name: 'Numero de frases:',
                      value: `${quantity}`,
                      inline: true
                    },
                    { name: 'Frases:',
                      value: phrases,
                    }
                );
        }

        await interaction.reply({
            embeds: [msgEmbed],
            ephemeral: false
        });
    }
}
