const { MessageEmbed } = require('discord.js');

const { userPfp } = require('../config.json');

module.exports = {
	embed() {
		return new MessageEmbed()
			.setColor('#3498db')
			.setThumbnail(userPfp)
			.setTimestamp()
			.setFooter({ text: 'Cristotractor go brrrr', iconURL: userPfp });
	}
};
