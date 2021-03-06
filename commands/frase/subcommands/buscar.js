const { MessageActionRow } = require('discord.js');

const {
    checkLetterFound
    , checkId
    , checkIdInFoundPhrases
    , checkLetter
} = require('../../../common/checking');

const {
    embed
    , backId
    , backButton
    , forwardId
    , forwardButton
} = require('../../../common/embed');

const { Pager } = require('../../../common/pager');

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

        const pager = new Pager();

        if (letter != null) {
            letter = letter.toLowerCase();
            await checkLetter(interaction, letter);

            title = `Frases con \`${letter}\` y que contienen \`${word}\``;

            await checkLetterFound(
                interaction,
                await phrasesColl.findOne({ letter: letter }),
                letter
            );

            const found = await phrasesColl.aggregate([
                { $match: { letter: letter } },
                { $unwind: {
                    path: '$phrases',
                    includeArrayIndex: 'id'
                }},
                { $match: {
                    phrases: { $regex: word, $options: 'i' }
                }}
            ]);

            await found.forEach(phrase => {
                pager.add(`${phrase.id}: ${phrase.phrases}\n`);
                quantity++;
            });
        } else {
            title = `Frases que contienen \`${word}\``;

            const found = await phrasesColl.aggregate([
                { $unwind: {
                    path: '$phrases',
                    includeArrayIndex: 'id'
                }},
                { $match: {
                    phrases: { $regex: word, $options: 'i' }
                }}
            ]);

            let lastLetter = '';

            await found.forEach(phrase => {
                if (phrase.letter != lastLetter) {
                    pager.add(`\nCon la letra \`${phrase.letter}\`:\n`);
                    lastLetter = phrase.letter;
                }

                pager.add(`${phrase.id}: ${phrase.phrases}\n`);
                quantity++;
            });
        }

        const msgEmbed = () => {
            return embed()
                .setTitle(title)
                .addFields(
                    { name: 'Numero de frases:',
                      value: `${quantity}`,
                      inline: true
                    },
                    { name: 'Pagina:',
                      value: `${pager.actualPage + 1}/${pager.size}`,
                      inline: true
                    },
                    { name: 'Frases:',
                      value: pager.size > 0
                      ? pager.actualPageText
                      : 'No hay frases con esa palabra'
                    }
                );
        };

        const buttons = () => {
            return new MessageActionRow({
                components: [
                    ...(pager.isFirstPage() ? [] : [backButton]),
                    ...(pager.isLastPage() ? [] : [forwardButton])
                ]
            });
        }

        const reply = () => {
            return {
                embeds: [ msgEmbed() ],
                components: ( pager.size > 1
                              ? [ buttons() ]
                              : null
                            ),
                ephemeral: false
            }
        }

        if (pager.size == 0) {
            await interaction.reply(reply());
        } else {
            await interaction.reply('Resultado:');
            
            const embedReply = await interaction.channel.send(reply());
            
            const collector = embedReply.createMessageComponentCollector({
                componentType: 'BUTTON'
            });
            
            collector.on('collect', async interaction => {
                interaction.customId === backId
                    ? (pager.previousPage())
                    : (pager.nextPage());

                await interaction.update(reply());
            });
        }
    }
}
