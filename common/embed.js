const { MessageEmbed, MessageButton } = require('discord.js');

const { userPfp } = require('../config.json');

const backId = 'back';
const forwardId = 'forward';

module.exports = {
    embed() {
        return new MessageEmbed()
            .setColor('#1abc9c')
            .setThumbnail(userPfp)
            .setTimestamp()
            .setFooter({
                text: 'Cristotractor go brrrr',
                iconURL: userPfp
            });
    },

    backId: backId,
    forwardId: forwardId,

    backButton: new MessageButton({
        style: 'SECONDARY',
        label: 'Anterior',
        emoji: '⬅️',
        customId: backId
    }),

    forwardButton: new MessageButton({
        style: 'SECONDARY',
        label: 'Siguiente',
        emoji: '➡️',
        customId: forwardId
    })
};
