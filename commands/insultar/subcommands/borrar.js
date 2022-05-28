const {
    checkAdmin
    , checkDbOperation
    , checkId
    , checkIdInFoundInsults
    , checkLevelFound
} = require('../../../common/checking');
const { embed } = require('../../../common/embed');
const { levels } = require('../../../common/levels');

const subcommandName = 'borrar';

module.exports = {
    name: subcommandName,

    addSubcommand(slashCommand) {
        slashCommand.addSubcommand(
            subcommand => subcommand
                .setName(subcommandName)
                .setDescription('Borra un insulto de la DB (solo admins).')
                .addStringOption(
                    option => option
                        .setName('nivel')
                        .setDescription('Como de fuerte es el insulto')
                        .setRequired(true)
                        .addChoices(...levels)
                )
                .addIntegerOption(
                    option => option
                        .setName('id')
                        .setDescription('Id del insulto')
                        .setRequired(true)
                )
        )
    },

    async execute({ interaction, insultsColl }) {
        await checkAdmin(interaction);

        const level = interaction.options.getString('nivel');

        const id = interaction.options.getInteger('id');
        await checkId(interaction, id);

        const found = await insultsColl.findOne({ level: level });
        await checkLevelFound(interaction, found, level);
        await checkIdInFoundInsults(interaction, id, found);

        const insult = found.insults[id];

        const operation = await insultsColl.updateOne(
            { level: level },
            { $pull: { insults: insult } }
        );
        await checkDbOperation(interaction, operation);

        const msgEmbed = embed()
              .setTitle('Insulto eliminado')
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
