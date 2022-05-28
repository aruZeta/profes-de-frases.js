const { embed } = require('../../../common/embed');
const { letters } = require('../../../config.json');

const subcommandName = 'estadisticas';

module.exports = {
    name: subcommandName,

    addSubcommand(slashCommand) {
        slashCommand.addSubcommand(
                subcommand => subcommand
                    .setName(subcommandName)
                    .setDescription('Muestra las estadisticas de frases.')
            )
    },

    async execute({ interaction, phrasesColl }) {
        let quantity = 0;
        let statistics = "";
        let missingLetters = "";
        const storedLetters = [];

        await phrasesColl.find({}, { sort: { letter: 1 } }).forEach(
            ({letter, phrases}) => {
                statistics += `\`${letter}: ${phrases.length}\`\n`;
                quantity += phrases.length;
                storedLetters.push(letter);
            }
        );

        for (const letter of letters) {
            if (storedLetters.indexOf(letter) < 0) {
                missingLetters += `\`${letter}\`\n`;
            }
        }

        if (missingLetters.length == 0) {
            missingLetters = 'No faltan letras';
        }

        const msgEmbed = embed()
              .setTitle('Estadisticas de frases')
              .addFields(
                  { name: 'Numero de frases:',
                    value: `${quantity}`
                  },
                  { name: 'Numero de frases por letra:',
                    value: `${statistics}`,
                    inline: true
                  },
                  { name: 'Letras que faltan:',
                    value: `${missingLetters}`,
                    inline: true
                  }
              );

        await interaction.reply({
            embeds: [msgEmbed]
        });
    }
}
