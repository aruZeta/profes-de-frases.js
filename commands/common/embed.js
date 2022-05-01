const { MessageEmbed } = require('discord.js');

module.exports = {
	execute(config) {
		return new MessageEmbed()
			.setColor('#3498db')
			.setThumbnail(config.userPfp)
			.setTimestamp()
			.setFooter({ text: 'Cristotractor go brrrr', iconURL: config.userPfp });
	}
};
