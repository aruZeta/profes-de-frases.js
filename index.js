const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');
require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
	const pingLoop = setInterval(() => {
		console.log('Ping!');
	}, 60000);
})

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles =
	fs.readdirSync('./commands')
		.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	client.user.setActivity('con tu madre');
	client.user.setUsername('Cristotractor');
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client, config);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});

client.login(process.env.token);
