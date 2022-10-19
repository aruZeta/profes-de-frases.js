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

const subcommandName = 'mostrar';

module.exports = {
    name: subcommandName,

    addSubcommand(slashCommand) {
        slashCommand.addSubcommand(
            subcommand => subcommand
                .setName(subcommandName)
                .setDescription('Muestra las frases de una letra (o la del id dado).')
                .addStringOption(
                    option => option
                        .setName('letra')
                        .setDescription('Letra de las frases')
                        .setRequired(true)
                )
                .addIntegerOption(
                    option => option
                        .setName('id')
                        .setDescription('Id de la frase (opcional)')
                        .setRequired(false)
                )
        )
    },

    async execute({ interaction, phrasesColl }) {
        const letter = interaction.options.getString('letra').toLowerCase();
        await checkLetter(interaction, letter);

        const id = interaction.options.getInteger('id');

        const found = await phrasesColl.findOne({ letter: letter });
        await checkLetterFound(interaction, found, letter);

        if (id == null) {
            const pager = new Pager();
            const quantity = found.phrases.length;

            for (let i = 0; i < quantity; i++) {
                pager.add(`${i}: ${found.phrases[i]}\n`);
            }

            const msgEmbed = () => {
                return embed()
                  .setTitle(`Frases con \`${letter}\``)
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
                        value: pager.actualPageText
                      }
                  );
            }

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
        } else {
            await checkId(interaction, id);
            await checkIdInFoundPhrases(interaction, id, found);

            const msgEmbed = embed()
                  .setTitle('Mostrar frase')
                  .addFields(
                      { name: 'Con la letra:',
                        value: letter
                      },
                      { name: 'Frase:',
                        value: found.phrases[id]
                      }
                  );

            await interaction.reply({
                embeds: [msgEmbed]
            });
        }
    }
}
