const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
require('dotenv').config().parsed.token;

const commands = [];
fs.readdirSync('./commands', { withFileTypes: true }).filter(
	item =>
		item.name != 'common'
		&& ((item.isFile && item.name.endsWith('.js'))
			|| item.isDirectory)
).forEach(item => {
	let command;
	if (item.isDirectory()) {
		command = require(`./commands/${item.name}/index.js`);
	} else {
		command = require(`./commands/${item.name}`);
	}

	commands.push(command.slashCommand.toJSON());
});

const rest = new REST({ version: '9' }).setToken(process.env.token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
