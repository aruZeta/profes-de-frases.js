const { SlashCommandBuilder } = require('@discordjs/builders');

const { embed } = require('../common/embed');

module.exports = {
    slashCommand: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Muestra estadisticas del servidor.'),

    async execute({ interaction }) {
        const msgEmbed = embed()
              .setTitle('Estadisticas del servidor')
              .addFields(
                  { name: 'Nombre:',
                    value: `${interaction.guild.name}`
                  },
                  { name: 'Numero de miembros:',
                    value: `${interaction.guild.memberCount}`
                  }
              );

        await interaction.reply({
            embeds: [msgEmbed]
        });
    }
}
