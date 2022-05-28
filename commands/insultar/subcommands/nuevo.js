const {
    checkAdmin
    , checkDbOperation
    , checkInsult
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');
const { capitalize } = require('../../../common/string');
const { levels } = require('../../../common/levels');

const subcommandName = 'nuevo';

module.exports = {
    name: subcommandName,

    addSubcommand(slashCommand) {
        slashCommand.addSubcommand(
            subcommand => subcommand
                .setName(subcommandName)
                .setDescription('Añade un nuevo insulto a la DB.')
                .addStringOption(
                    option => option
                        .setName('nivel')
                        .setDescription('Como de fuerte es el insulto')
                        .setRequired(true)
                        .addChoices(...levels)
                )
                .addStringOption(
                    option => option
                        .setName('insulto')
                        .setDescription('El insulto en si')
                        .setRequired(true)
                )
        )
    },

    async execute({ interaction, insultsColl }) {
        const level = interaction.options.getString('nivel');

        const insult = capitalize(interaction.options.getString('insulto'));
        await checkInsult(interaction, insult);

        const found = await insultsColl.findOne({ level: level });
        let operation;
        if (found) {
            operation = await insultsColl.updateOne(
                { level: level },
                { $push: { insults: insult } }
            );
        } else {
            operation = await insultsColl.insertOne({
                level: level,
                insults: [insult]
            });
        }

        await checkDbOperation(interaction, operation);

        const msgEmbed = embed()
              .setTitle('Insulto añadido')
              .addFields(
                  { name: 'Nivel:',
                    value: level
                  },
                  { name: 'Insulto:',
                    value: insult
                  }
              );

        await interaction.reply({
            embeds: [msgEmbed]
        });
    }
}
