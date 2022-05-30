const { MessageButton, MessageActionRow } = require('discord.js');

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
        let phrases = [];
        let actualPage = 0;
        let actualLength = 0;

        const pagePhrase = text => {
            actualLength += text.length;

            if (actualLength >= 1024) {
                phrases.push('');
                actualLength = text.length;
                actualPage++;
            }

            return text;
        }

        if (letter != null) {
            letter = letter.toLowerCase();
            await checkLetter(interaction, letter);

            title = `Frases con \`${letter}\` y que contienen \`${word}\``;

            const found = await phrasesColl.findOne({ letter: letter });
            await checkLetterFound(interaction, found, letter);

            for (let i = 0; i < found.phrases.length; i++) {
                const phrase = found.phrases[i];
                if (new RegExp(word, "i").test(phrase)) {
                    let text = pagePhrase(`${i}: ${phrase}\n`);
                    phrases[actualPage] += text;
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
                    let text = pagePhrase(`\nCon la letra \`${phrase.letter}\`:\n`);
                    phrases[actualPage] += text;
                    lastLetter = phrase.letter;
                }

                text = pagePhrase(`${phrase.id}: ${phrase.phrases}\n`);
                phrases[actualPage] += text;
                quantity++;
            });
        }

        let embedPage = 0;

        const backId = 'back';
        const forwardId = 'forward';

        const backButton = new MessageButton({
            style: 'SECONDARY',
            label: 'Anterior',
            emoji: '⬅️',
            customId: backId
        });

        const forwardButton = new MessageButton({
            style: 'SECONDARY',
            label: 'Siguiente',
            emoji: '➡️',
            customId: forwardId
        });

        if (phrases.length > 1) {
            const msgEmbed = () => {
                return embed()
                    .setTitle(title)
                    .addFields(
                        { name: 'Numero de frases:',
                          value: `${quantity}`,
                          inline: true
                        },
                        { name: 'Pagina:',
                          value: `${embedPage + 1}/${phrases.length}`,
                          inline: true
                        },
                        { name: 'Frases:',
                          value: phrases.length > 0
                          ? phrases[embedPage]
                          : 'No hay frases con esa palabra'
                        }
                    );
            }

            await interaction.reply('Resultado:',);
            
            const embedReply =
                  await interaction.channel.send({
                      embeds: [msgEmbed()],
                      components: [
                          new MessageActionRow(
                              { components: [
                                  forwardButton
                              ]}
                          )
                      ],
                      ephemeral: false
                  });
            
            const collector = embedReply.createMessageComponentCollector({
                componentType: 'BUTTON'
            });
            
            collector.on('collect', async interaction => {
                interaction.customId === backId ? (embedPage--) : (embedPage++);
                await interaction.update({
                    embeds: [msgEmbed()],
                    components: [
                        new MessageActionRow(
                            { components: [
                                ...(embedPage == 0 ? [] : [backButton]),
                                ...(embedPage == phrases.length - 1 ? [] : [forwardButton])
                            ]}
                        )
                    ],
                    ephemeral: false
                });
            });
        } else {
            await interaction.reply({
                embeds: [
                    embed()
                        .setTitle(title)
                        .addFields(
                            { name: 'Numero de frases:',
                              value: `${quantity}`,
                              inline: true
                            },
                            { name: 'Frases:',
                              value: phrases.length > 0
                              ? phrases[0]
                              : 'No hay frases con esa palabra'
                            }
                        )
                ],
                ephemeral: false
            });
        }
    }
}
