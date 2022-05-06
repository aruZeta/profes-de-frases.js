const { clientId, permissions } = require('../config.json');

module.exports = {
	inviteLink: "https://discord.com/api/oauth2/authorize"
		+ `?client_id=${clientId}`
		+ `&permissions=${permissions}`
		+ `&scope=bot%20applications.commands`
}
